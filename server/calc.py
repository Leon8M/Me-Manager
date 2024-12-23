import calendar
from datetime import datetime
from models import Expenses, Leftover
from sqlalchemy.orm import Session


def calculate_monthly_expenses(session: Session) -> float:
    """Calculate the total expenses for the current month."""
    now = datetime.now()
    expenses = session.query(Expenses).all()
    monthly_expenses = [
        expense.amount for expense in expenses if expense.created_at.month == now.month and expense.created_at.year == now.year
    ]
    return sum(monthly_expenses)


def save_leftover(session: Session, leftover: float):
    """Save the leftover for the current month."""
    new_leftover = Leftover(amount=leftover)
    session.add(new_leftover)
    session.commit()


def reset_budget(session: Session, budget: dict):
    """Reset the budget for a new month."""
    budget["num"] = 0  # Reset the budget
    session.query(Expenses).delete()  # Clear the expenses for the new month
    session.commit()


def is_new_month() -> bool:
    """Check if the current day is the first day of the month."""
    now = datetime.now()
    return now.day == 1


def track_monthly_budget(session: Session, budget: dict):
    """Handle the end-of-month calculations and budget reset."""
    if is_new_month():
        # Calculate leftover
        total_expenses = calculate_monthly_expenses(session)
        leftover = budget["num"] - total_expenses

        # Save leftover and reset budget
        if leftover > 0:
            save_leftover(session, leftover)
        reset_budget(session, budget)
