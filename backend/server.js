// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { Readable } = require('stream');

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/notes-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Models
const User = mongoose.model('User', {
  email: String,
  password: String
});

const Note = mongoose.model('Note', {
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  content: String,
  isAudio: Boolean,
  isFavorite: Boolean,
  createdAt: { type: Date, default: Date.now }
});

// Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'your-secret-key');
    req.user = { _id: decoded._id };
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const uploadImage = multer({ storage: storage });

// Add image upload endpoint
app.post('/api/notes/:id/image', auth, uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ error: 'No image provided' });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!note) {
      return res.status(404).send();
    }

    // Add image URL to note content
    const imageUrl = `/uploads/${req.file.filename}`;
    note.content += `\n![Image](${imageUrl})`;
    await note.save();

    res.send(note);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    
    const token = jwt.sign({ _id: user._id }, 'your-secret-key');
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid login credentials');
    }
    
    const token = jwt.sign({ _id: user._id }, 'your-secret-key');
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Note Routes
app.get('/api/notes', auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.send(notes);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/api/notes', auth, async (req, res) => {
  try {
    const note = new Note({
      ...req.body,
      userId: req.user._id
    });
    await note.save();
    res.status(201).send(note);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/api/notes/audio', auth, upload.single('audio'), async (req, res) => {
  try {
    // Here you would implement the audio-to-text conversion
    // For this example, we'll create a note with placeholder text
    const note = new Note({
      userId: req.user._id,
      title: 'Audio Note',
      content: 'Transcribed text would go here',
      isAudio: true
    });
    await note.save();
    res.status(201).send(note);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.patch('/api/notes/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!note) {
      return res.status(404).send();
    }
    res.send(note);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/api/notes/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!note) {
      return res.status(404).send();
    }
    res.send(note);
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});