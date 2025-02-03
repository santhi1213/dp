// import { useState } from 'react';
// import { useAuth } from '../../context/AuthContext';

// const NoteCard = ({ note, onSelect, onDelete }) => {
//   const { token } = useAuth();
//   const [isRenaming, setIsRenaming] = useState(false);
//   const [newTitle, setNewTitle] = useState(note.title);

//   const handleCopy = async () => {
//     await navigator.clipboard.writeText(note.content);
//     alert('Copied to clipboard!');
//   };

//   const handleDelete = async () => {
//     try {
//       await fetch(`http://localhost:5000/api/notes/${note._id}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       onDelete();
//     } catch (error) {
//       console.error('Error deleting note:', error);
//     }
//   };

//   const handleRename = async () => {
//     try {
//       await fetch(`http://localhost:5000/api/notes/${note._id}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ title: newTitle })
//       });
//       setIsRenaming(false);
//       onDelete(); // Refresh notes
//     } catch (error) {
//       console.error('Error renaming note:', error);
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-4">
//       {isRenaming ? (
//         <div className="flex gap-2">
//           <input
//             type="text"
//             value={newTitle}
//             onChange={(e) => setNewTitle(e.target.value)}
//             className="flex-1 border rounded px-2"
//           />
//           <button 
//             onClick={handleRename}
//             className="bg-blue-500 text-white px-2 py-1 rounded"
//           >
//             Save
//           </button>
//         </div>
//       ) : (
//         <h3 className="font-bold mb-2">{note.title}</h3>
//       )}
      
//       <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>
      
//       <div className="flex justify-end gap-2">
//         <button 
//           onClick={handleCopy}
//           className="text-blue-500 hover:text-blue-700"
//         >
//           Copy
//         </button>
//         <button 
//           onClick={() => setIsRenaming(true)}
//           className="text-green-500 hover:text-green-700"
//         >
//           Rename
//         </button>
//         <button 
//           onClick={handleDelete}
//           className="text-red-500 hover:text-red-700"
//         >
//           Delete
//         </button>
//         <button 
//           onClick={() => onSelect(note)}
//           className="text-purple-500 hover:text-purple-700"
//         >
//           View
//         </button>
//       </div>
//     </div>
//   );
// };

// export default NoteCard;

// src/components/Notes/NoteCard.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const NoteCard = ({ note, onSelect, onDelete }) => {
  const { token } = useAuth();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(note.title);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(note.content);
    alert('Copied to clipboard!');
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:5000/api/notes/${note._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      onDelete();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleRename = async () => {
    try {
      await fetch(`http://localhost:5000/api/notes/${note._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTitle })
      });
      setIsRenaming(false);
      onDelete(); // Refresh notes
    } catch (error) {
      console.error('Error renaming note:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      {isRenaming ? (
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 border rounded px-2 py-1"
            autoFocus
          />
          <button 
            onClick={handleRename}
            className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
          >
            Save
          </button>
          <button 
            onClick={() => setIsRenaming(false)}
            className="bg-gray-500 text-white px-2 py-1 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      ) : (
        <h3 className="font-bold mb-2 text-lg">{note.title}</h3>
      )}
      
      <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>
      
      <div className="flex justify-end gap-2">
        <button 
          onClick={handleCopy}
          className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded text-sm"
        >
          Copy
        </button>
        <button 
          onClick={() => setIsRenaming(true)}
          className="text-green-500 hover:text-green-700 px-2 py-1 rounded text-sm"
        >
          Rename
        </button>
        <button 
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 px-2 py-1 rounded text-sm"
        >
          Delete
        </button>
        <button 
          onClick={() => onSelect(note)}
          className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default NoteCard;