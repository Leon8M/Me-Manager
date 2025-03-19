from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Income, Expenses, Savings, Leftover  # Import the models
import config  # Import config settings
import calc
from apscheduler.schedulers.background import BackgroundScheduler

# Initialize the Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# Database setup
engine = create_engine(config.DATABASE_URL, echo=True)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

budget = {"num": 0}
scheduler = BackgroundScheduler()

@scheduler.scheduled_job("cron", day=1, hour=0)
def monthly_budget_job():
    """Scheduled job to handle end-of-month tasks."""
    calc.track_monthly_budget(session, budget)


scheduler.start()

# Example route: Home
@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Me-Manager API!"})

@app.route('/income', methods=['POST'])
def add_income():
    data = request.json
    
    try:
        new_income = Income(
            name=data['name'],
            amount=data['amount'],
        )
        session.add(new_income)
        session.commit()
        return jsonify({"message": "Income record added successfully!"}), 201
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/income', methods=['GET'])
def get_income():
    income_records = session.query(Income).all()
    total = sum(record.amount for record in income_records)
    income_list = [
        {
            "id": record.id,
            "name": record.name,
            "amount": record.amount,
            "total": total
        }
        for record in income_records
    ]
    return jsonify(income_list), 200

@app.route('/expenses', methods=['POST'])
def add_expenses():
    data = request.json
    
    try:
        new_expense = Expenses(
            name=data['name'], 
            category=data['category'],
            amount=data['amount'],
        )
        session.add(new_expense)
        session.commit()
        return jsonify({"message": "Expense added successfully"})
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/expenses', methods=['GET'])
def get_expenses():
    expenses_records = session.query(Expenses).all()
    total_expenses = sum(record.amount for record in expenses_records)
    
    expenses_list = [
        {
            'id': record.id,
            "name": record.name,
            'category': record.category,
            'amount': record.amount,
            'total': total_expenses
        }
        for record in expenses_records
    ]
    return jsonify(expenses_list), 200
    

@app.route('/budget', methods=['POST'])
def set_budget():
    data = request.get_json()
    budget["num"] =  data['budget']
    
    return jsonify({'message': 'budget changed'}), 201


@app.route('/budget', methods=['GET'])
def get_budget():
    return jsonify(budget), 200


@app.route ('/save', methods=['POST'])
def add_savings():
    data = request.json
    
    try:
        new_save = Savings(
            action=data['action'],
            amount=data['amount'],
        )
        session.add(new_save)
        session.commit()
        return jsonify({"message": "Savings added successfully"})
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route ('/save', methods=['GET'])
def get_savings():
    savings_records = session.query(Savings).all()
    total_savings = sum(record.amount for record in savings_records)
    
    saving_list = [
        {
         'id': record.id,
         'action': record.action,
         'amount': record.amount,
         'total': total_savings}
        for record in savings_records
    ]
    
    return jsonify(saving_list), 200

@app.route('/leftover', methods=['POST'])
def save_leftover():
    data = request.json
    leftover_amount = data.get("leftover", 0)

    try:
        # Save leftover in a database table for future reference
        new_leftover = Leftover(amount=leftover_amount)
        session.add(new_leftover)
        session.commit()
        return jsonify({"message": "Leftover saved successfully"}), 201
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/leftover', methods=['GET'])
def get_leftover():
    leftovers = session.query(Leftover).all()
    leftover_list = [
        {
            "id": record.id,
            "amount": record.amount,
            "created_at": record.created_at,
        }
        for record in leftovers
    ]
    return jsonify(leftover_list), 200


# Run the Flask app
if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=config.PORT, debug=config.DEBUG)
    finally:
        scheduler.shutdown()
