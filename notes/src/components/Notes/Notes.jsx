// import { useState, useEffect, useRef } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import NoteCard from './NoteCard';
// import NoteModal from './NoteModal';
// import AudioRecorder from './AudioRecorder';
// import SearchBar from './SearchBar';

// const Notes = () => {
//   const [notes, setNotes] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedNote, setSelectedNote] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const { token } = useAuth();

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   const fetchNotes = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/notes', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       const data = await response.json();
//       setNotes(data);
//     } catch (error) {
//       console.error('Error fetching notes:', error);
//     }
//   };

//   const filteredNotes = notes.filter(note => 
//     note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     note.content.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="container mx-auto p-4">
//       <SearchBar onSearch={setSearchTerm} />

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//         {filteredNotes.map(note => (
//           <NoteCard
//             key={note._id}
//             note={note}
//             onSelect={() => {
//               setSelectedNote(note);
//               setIsModalOpen(true);
//             }}
//             onDelete={fetchNotes}
//           />
//         ))}
//       </div>

//       <AudioRecorder onNoteCreated={fetchNotes} />

//       {isModalOpen && (
//         <NoteModal
//           note={selectedNote}
//           isOpen={isModalOpen}
//           onClose={() => {
//             setIsModalOpen(false);
//             setSelectedNote(null);
//           }}
//           onUpdate={fetchNotes}
//         />
//       )}
//     </div>
//   );
// };

// export default Notes;

// src/components/Notes/Notes.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import NoteCard from './NoteCard';
import NoteModal from './NoteModal';
import AudioRecorder from './AudioRecorder';
import SearchBar from './SearchBar';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/notes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setNotes(data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNoteSelect = (note) => {
        setSelectedNote(note);
        setIsModalOpen(true);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <SearchBar onSearch={setSearchTerm} />
            </div>

            <AudioRecorder onNoteCreated={fetchNotes} />

            <div className='flex border border-white'>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotes.map(note => (
                            <NoteCard
                                className='justify-self-center'
                                key={note._id}
                                note={note}
                                onSelect={handleNoteSelect}
                                onDelete={fetchNotes}
                            />
                    ))}
                </div>
            </div>

            {selectedNote && (
                <NoteModal
                    note={selectedNote}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedNote(null);
                    }}
                    onUpdate={fetchNotes}
                />
            )}
        </div>
    );
};

export default Notes;