from flask import Flask, jsonify, request
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Income, Budget, Expenses, Savings  # Import the models
import config  # Import config settings

# Initialize the Flask app
app = Flask(__name__)

# Database setup
engine = create_engine(config.DATABASE_URL, echo=True)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

# Example route: Home
@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Me-Manager API!"})

# Route to add income
@app.route('/income', methods=['POST'])
def add_income():
    data = request.json
    try:
        new_income = Income(
            name=data['name'],
            amount=data['amount'],
            date=data['date'],
            total_current_amount=data['total_current_amount']
        )
        session.add(new_income)
        session.commit()
        return jsonify({"message": "Income record added successfully!"}), 201
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400

# Route to view all income records
@app.route('/income', methods=['GET'])
def get_income():
    income_records = session.query(Income).all()
    income_list = [
        {
            "id": record.id,
            "name": record.name,
            "amount": record.amount,
            "date": str(record.date),
            "total_current_amount": record.total_current_amount
        }
        for record in income_records
    ]
    return jsonify(income_list)

# Route to delete an income record by ID
@app.route('/income/<int:id>', methods=['DELETE'])
def delete_income(id):
    record = session.query(Income).filter_by(id=id).first()
    if record:
        session.delete(record)
        session.commit()
        return jsonify({"message": f"Income record with ID {id} deleted successfully!"}), 200
    else:
        return jsonify({"error": "Record not found"}), 404

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=config.PORT, debug=config.DEBUG)
