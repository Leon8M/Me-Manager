// Notes.jsx
import React, { useState, useEffect } from 'react';
import { FaLock, FaUnlock, FaTrash, FaEdit, FaSearch, FaPlus } from 'react-icons/fa';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTag, setActiveTag] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);
    const [noteType, setNoteType] = useState('text');

    useEffect(() => {
        fetchNotes();
    }, [searchQuery, activeTag]);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            let url = 'http://localhost:8080/api/notes';
            
            if (searchQuery || activeTag) {
                url = 'http://localhost:8080/api/notes/search?';
                if (searchQuery) url += `q=${encodeURIComponent(searchQuery)}`;
                if (activeTag) url += `${searchQuery ? '&' : ''}tag=${encodeURIComponent(activeTag)}`;
            }
            
            const response = await fetch(url, {
                credentials: 'include'  // Needed for cookies/sessions if I ever use them
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`Expected JSON but got: ${text.substring(0, 50)}`);
            }
    
            const data = await response.json();
            setNotes(data);
            setError('');
        } catch (err) {
            setError(`Failed to fetch notes: ${err.message}`);
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNote = () => {
        setCurrentNote({
            title: '',
            content: '',
            note_type: 'text',
            is_locked: false,
            note_data: null,
            tags: []
        });
        setNoteType('text');
        setIsModalOpen(true);
    };

    const handleEditNote = (note) => {
        setCurrentNote({
            ...note,
            tags: note.tags ? note.tags.split(',') : []
        });
        setNoteType(note.note_type);
        setIsModalOpen(true);
    };

    const handleDeleteNote = async (id) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                const response = await fetch(`/api/notes/${id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) throw new Error('Failed to delete note');
                fetchNotes();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleToggleLock = async (note) => {
        try {
            const response = await fetch(`/api/notes/${note.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...note,
                    is_locked: !note.is_locked
                })
            });
            if (!response.ok) throw new Error('Failed to update note');
            fetchNotes();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = currentNote.id ? 'PUT' : 'POST';
            const url = currentNote.id ? `/api/notes/${currentNote.id}` : '/api/notes';
            
            let note_data = {};
            if (noteType === 'list') {
                const items = currentNote.note_data?.items || [];
                note_data = { items };
            } else if (noteType === 'checklist') {
                const items = currentNote.note_data?.items || [];
                note_data = { items: items.map(item => typeof item === 'string' ? 
                    { text: item, checked: false } : item) };
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: currentNote.title,
                    content: currentNote.content,
                    note_type: noteType,
                    is_locked: currentNote.is_locked,
                    note_data,
                    tags: currentNote.tags
                })
            });

            if (!response.ok) throw new Error(`Failed to ${currentNote.id ? 'update' : 'create'} note`);
            
            setIsModalOpen(false);
            fetchNotes();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentNote(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTagChange = (e) => {
        const { value } = e.target;
        setCurrentNote(prev => ({
            ...prev,
            tags: value.split(',').map(tag => tag.trim())
        }));
    };

    const handleListItemChange = (index, value) => {
        setCurrentNote(prev => ({
            ...prev,
            note_data: {
                ...prev.note_data,
                items: prev.note_data?.items?.map((item, i) => 
                    i === index ? (typeof item === 'string' ? value : { ...item, text: value }) : item)
            }
        }));
    };

    const handleAddListItem = () => {
        setCurrentNote(prev => ({
            ...prev,
            note_data: {
                ...prev.note_data,
                items: [...(prev.note_data?.items || []), noteType === 'checklist' ? 
                    { text: '', checked: false } : '']
            }
        }));
    };

    const handleRemoveListItem = (index) => {
        setCurrentNote(prev => ({
            ...prev,
            note_data: {
                ...prev.note_data,
                items: prev.note_data?.items?.filter((_, i) => i !== index)
            }
        }));
    };

    const handleCheckboxToggle = (index) => {
        setCurrentNote(prev => ({
            ...prev,
            note_data: {
                ...prev.note_data,
                items: prev.note_data?.items?.map((item, i) => 
                    i === index ? { ...item, checked: !item.checked } : item)
            }
        }));
    };

    const allTags = Array.from(new Set(
        notes.flatMap(note => note.tags ? note.tags.split(',') : [])
    )).filter(tag => tag);

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Notes</h1>
                <button 
                    onClick={handleCreateNote}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
                >
                    <FaPlus className="mr-2" /> New Note
                </button>
            </div>

            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setActiveTag('')}
                        className={`px-3 py-1 rounded-full text-sm ${!activeTag ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                        All
                    </button>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag === activeTag ? '' : tag)}
                            className={`px-3 py-1 rounded-full text-sm ${tag === activeTag ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {notes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No notes found. Create your first note!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notes.map(note => (
                        <div key={note.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg truncate">{note.title}</h3>
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => handleToggleLock(note)}
                                        className="text-gray-500 hover:text-blue-500"
                                        title={note.is_locked ? 'Unlock note' : 'Lock note'}
                                    >
                                        {note.is_locked ? <FaLock /> : <FaUnlock />}
                                    </button>
                                    <button 
                                        onClick={() => handleEditNote(note)}
                                        className="text-gray-500 hover:text-blue-500"
                                        title="Edit note"
                                        disabled={note.is_locked}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteNote(note.id)}
                                        className="text-gray-500 hover:text-red-500"
                                        title="Delete note"
                                        disabled={note.is_locked}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                            
                            {note.tags && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {note.tags.split(',').map(tag => (
                                        tag && <span key={tag} className="bg-gray-100 px-2 py-1 text-xs rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            
                            <div className="text-sm text-gray-600 mb-2">
                                {new Date(note.updated_at).toLocaleString()}
                            </div>
                            
                            {note.note_type === 'text' && (
                                <p className="text-gray-700 whitespace-pre-line">
                                    {note.content.length > 100 ? `${note.content.substring(0, 100)}...` : note.content}
                                </p>
                            )}
                            
                            {note.note_type === 'list' && note.note_data?.items && (
                                <ul className="list-disc list-inside">
                                    {note.note_data.items.slice(0, 3).map((item, i) => (
                                        <li key={i} className="text-gray-700">
                                            {typeof item === 'string' ? item : item.text}
                                        </li>
                                    ))}
                                    {note.note_data.items.length > 3 && <li>...</li>}
                                </ul>
                            )}
                            
                            {note.note_type === 'checklist' && note.note_data?.items && (
                                <ul className="space-y-1">
                                    {note.note_data.items.slice(0, 3).map((item, i) => (
                                        <li key={i} className="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                checked={item.checked} 
                                                className="mr-2" 
                                                readOnly 
                                            />
                                            <span className={`text-gray-700 ${item.checked ? 'line-through' : ''}`}>
                                                {item.text}
                                            </span>
                                        </li>
                                    ))}
                                    {note.note_data.items.length > 3 && <li>...</li>}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Note Editor Modal, getti g kinda long, am sorry :) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center border-b p-4">
                            <h2 className="text-xl font-semibold">
                                {currentNote.id ? 'Edit Note' : 'Create New Note'}
                            </h2>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                &times;
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={currentNote.title}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Type</label>
                                <select
                                    value={noteType}
                                    onChange={(e) => setNoteType(e.target.value)}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="text">Text Note</option>
                                    <option value="list">List</option>
                                    <option value="checklist">Checklist</option>
                                </select>
                            </div>
                            
                            {noteType === 'text' && (
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Content</label>
                                    <textarea
                                        name="content"
                                        value={currentNote.content}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}
                            
                            {(noteType === 'list' || noteType === 'checklist') && (
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Items</label>
                                    <div className="space-y-2">
                                        {currentNote.note_data?.items?.map((item, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                {noteType === 'checklist' && (
                                                    <input
                                                        type="checkbox"
                                                        checked={typeof item === 'object' ? item.checked : false}
                                                        onChange={() => handleCheckboxToggle(index)}
                                                        className="h-5 w-5"
                                                    />
                                                )}
                                                <input
                                                    type="text"
                                                    value={typeof item === 'object' ? item.text : item}
                                                    onChange={(e) => handleListItemChange(index, e.target.value)}
                                                    className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveListItem(index)}
                                                    className="text-red-500 hover:text-red-700 p-2"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={handleAddListItem}
                                            className="text-blue-500 hover:text-blue-700 mt-2 flex items-center"
                                        >
                                            <FaPlus className="mr-1" /> Add Item
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    value={currentNote.tags.join(', ')}
                                    onChange={handleTagChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="work, personal, ideas"
                                />
                            </div>
                            
                            <div className="mb-4 flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_locked"
                                    name="is_locked"
                                    checked={currentNote.is_locked}
                                    onChange={(e) => setCurrentNote(prev => ({
                                        ...prev,
                                        is_locked: e.target.checked
                                    }))}
                                    className="h-5 w-5 mr-2"
                                />
                                <label htmlFor="is_locked" className="text-gray-700">
                                    Lock this note (prevent edits)
                                </label>
                            </div>
                        </form>
                        
                        <div className="flex justify-end space-x-2 border-t p-4">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                {currentNote.id ? 'Update' : 'Create'} Note
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notes;