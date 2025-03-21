from datetime import datetime
from models import Expenses, Leftover, Savings
from sqlalchemy.orm import Session

def get_current_month():
    """Get the current month in 'YYYY-MM' format."""
    return datetime.now().strftime("%Y-%m")

def calculate_monthly_expenses(session: Session, month: str) -> float:
    """Calculate the total expenses for a specific month."""
    expenses = session.query(Expenses).filter(Expenses.month == month).all()
    return sum(expense.amount for expense in expenses)

def save_leftover(session: Session, amount: float, month: str):
    """Save the leftover for a specific month."""
    new_leftover = Leftover(amount=amount, month=month)
    session.add(new_leftover)
    session.commit()

def reset_budget(session: Session, budget: dict):
    """Reset the budget for a new month."""
    budget["num"] = 0  # Reset the budget
    session.commit()

def is_new_month() -> bool:
    """Check if the current day is the first day of the month."""
    now = datetime.now()
    return now.day == 1

def track_monthly_budget(session: Session, budget: dict):
    """Handle the end-of-month calculations and budget reset."""
    if is_new_month():
        current_month = get_current_month()
        previous_month = (datetime.now().replace(day=1) - timedelta(days=1))
        previous_month_str = previous_month.strftime("%Y-%m")

        # Calculate leftover for the previous month
        total_expenses = calculate_monthly_expenses(session, previous_month_str)
        leftover = budget["num"] - total_expenses

        # Save leftover and reset budget
        if leftover > 0:
            save_leftover(session, leftover, previous_month_str)
            # Add leftover to savings
            new_saving = Savings(action="Increment", amount=leftover, month=previous_month_str)
            session.add(new_saving)
            session.commit()

        reset_budget(session, budget)