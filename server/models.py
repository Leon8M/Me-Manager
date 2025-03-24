from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, JSON
from datetime import datetime

Base = declarative_base()

class Income(Base):
    __tablename__ = 'income'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Expenses(Base):
    __tablename__ = 'expenses'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    month = Column(String, nullable=False)  # Track expenses by month (e.g., "2023-10")

class Savings(Base):
    __tablename__ = 'savings'
    id = Column(Integer, primary_key=True, autoincrement=True)
    action = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    month = Column(String, nullable=False)  # Track savings by month

class Leftover(Base):
    __tablename__ = "leftovers"
    id = Column(Integer, primary_key=True)
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    month = Column(String, nullable=False)  # Track leftovers by month

class Note(Base):
    __tablename__ = 'notes'
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    content = Column(Text, nullable=True)
    note_type = Column(String(20), nullable=False)  # 'text', 'list', 'checklist'
    is_locked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    note_data = Column(JSON, nullable=True)  # For additional data like list items, etc.
    tags = Column(String(200), nullable=True)  # Comma-separated tags
    

class Note(Base):
    # ... existing columns ...

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'note_type': self.note_type,
            'is_locked': self.is_locked,
            'note_data': self.note_data,
            'tags': self.tags,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }