# notes.py
from flask import Blueprint, request, jsonify
from sqlalchemy.orm import sessionmaker
from models import Note, Base
from datetime import datetime
import json

notes_bp = Blueprint('notes', __name__)

# Database setup (assuming engine is imported from app.py)
engine = create_engine(config.DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

@notes_bp.route('/notes', methods=['POST'])
def create_note():
    data = request.json
    try:
        # Handle different note types
        metadata = {}
        if data.get('note_type') == 'list':
            metadata = {'items': data.get('items', [])}
        elif data.get('note_type') == 'checklist':
            metadata = {'items': [{'text': item, 'checked': False} for item in data.get('items', [])]}

        new_note = Note(
            title=data.get('title', 'Untitled Note'),
            content=data.get('content', ''),
            note_type=data.get('note_type', 'text'),
            is_locked=data.get('is_locked', False),
            metadata=metadata,
            tags=','.join(data.get('tags', [])) if 'tags' in data else None
        )
        
        session.add(new_note)
        session.commit()
        return jsonify(new_note.to_dict()), 201
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400

@notes_bp.route('/notes', methods=['GET'])
def get_notes():
    try:
        notes = session.query(Note).order_by(Note.updated_at.desc()).all()
        return jsonify([note.to_dict() for note in notes]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@notes_bp.route('/notes/<int:note_id>', methods=['GET'])
def get_note(note_id):
    try:
        note = session.query(Note).filter_by(id=note_id).first()
        if not note:
            return jsonify({"error": "Note not found"}), 404
        return jsonify(note.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@notes_bp.route('/notes/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    try:
        note = session.query(Note).filter_by(id=note_id).first()
        if not note:
            return jsonify({"error": "Note not found"}), 404
            
        if note.is_locked:
            return jsonify({"error": "Note is locked and cannot be modified"}), 403
            
        data = request.json
        
        if 'title' in data:
            note.title = data['title']
        if 'content' in data:
            note.content = data['content']
        if 'note_type' in data:
            note.note_type = data['note_type']
        if 'is_locked' in data:
            note.is_locked = data['is_locked']
        if 'metadata' in data:
            note.metadata = data['metadata']
        if 'tags' in data:
            note.tags = ','.join(data['tags']) if isinstance(data['tags'], list) else data['tags']
            
        session.commit()
        return jsonify(note.to_dict()), 200
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400

@notes_bp.route('/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    try:
        note = session.query(Note).filter_by(id=note_id).first()
        if not note:
            return jsonify({"error": "Note not found"}), 404
            
        if note.is_locked:
            return jsonify({"error": "Cannot delete a locked note"}), 403
            
        session.delete(note)
        session.commit()
        return jsonify({"message": "Note deleted successfully"}), 200
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 400

@notes_bp.route('/notes/search', methods=['GET'])
def search_notes():
    try:
        query = request.args.get('q', '')
        tag = request.args.get('tag', '')
        
        notes_query = session.query(Note)
        
        if query:
            notes_query = notes_query.filter(
                (Note.title.ilike(f'%{query}%')) | 
                (Note.content.ilike(f'%{query}%'))
            )
            
        if tag:
            notes_query = notes_query.filter(Note.tags.ilike(f'%{tag}%'))
            
        notes = notes_query.order_by(Note.updated_at.desc()).all()
        return jsonify([note.to_dict() for note in notes]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400