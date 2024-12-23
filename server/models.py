from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, Date ,DateTime
from datetime import datetime

Base = declarative_base()

class Income(Base):
    __tablename__ = 'income'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)


class Expenses(Base):
    __tablename__ = 'expenses'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Savings(Base):
    __tablename__ = 'savings'
    id = Column(Integer, primary_key=True, autoincrement=True)
    action = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    
class Leftover(Base):
    __tablename__ = "leftovers"
    id = Column(Integer, primary_key=True)
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
