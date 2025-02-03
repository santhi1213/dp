import Note from '../models/Note.js';

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNote = async (req, res) => {
  const { title, content, isAudio, imageUrl } = req.body;
  try {
    const note = new Note({ title, content, userId: req.user.id, isAudio, imageUrl });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateNote = async (req, res) => {
  const { title, content, isFavorite, imageUrl } = req.body;
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, { title, content, isFavorite, imageUrl }, { new: true });
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};