// src/components/Notes/NoteModal.jsx
import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const NoteModal = ({ note, isOpen, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isFavorite, setIsFavorite] = useState(note.isFavorite);
  const fileInputRef = useRef(null);
  const { token } = useAuth();

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${note._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          isFavorite
        })
      });

      if (response.ok) {
        setIsEditing(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`http://localhost:5000/api/notes/${note._id}/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const updatedNote = await response.json();
        setContent(updatedNote.content);
        onUpdate();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  if (!isOpen) return null;


const modalClasses = `fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4`;

const contentClasses = `bg-white rounded-lg shadow-xl transform transition-all w-full ${
  isFullscreen 
    ? 'fixed inset-0 m-0 rounded-none'
    : 'max-w-2xl mx-auto'
}`;

  return (
    <div className={modalClasses}>
      <div className={contentClasses}>
        {/* Modal Header */}
        <div className="p-4 border-b flex justify-between items-center">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 border rounded px-2 py-1 mr-2"
            />
          ) : (
            <h2 className="text-xl font-bold">{title}</h2>
          )}
          <div className="flex gap-2">
            {/* Toggle Favorite Button */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded ${
                isFavorite ? 'text-yellow-500' : 'text-gray-500'
              }`}
            >
              ★
            </button>
            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              {isFullscreen ? '↙' : '↗'}
            </button>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4">
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 border rounded p-2"
            />
          ) : (
            <div className="prose max-w-none">
              {content}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t flex justify-between">
          <div>
            {/* Edit/Save Buttons */}
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setTitle(note.title);
                    setContent(note.content);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
            )}
          </div>
          <div>
            {/* Image Upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;