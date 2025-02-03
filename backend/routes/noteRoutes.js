import express from 'express';
import { getNotes, createNote, deleteNote, updateNote } from '../controllers/noteController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/', getNotes);
router.post('/', createNote);
router.delete('/:id', deleteNote);
router.put('/:id', updateNote);

export default router;