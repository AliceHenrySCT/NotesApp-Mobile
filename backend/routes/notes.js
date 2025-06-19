const express = require('express');
const router = express.Router();
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  getUsers,
  getUserNotes, 
} = require('../controllers/noteController');

// All routes in this file should be protected in app.js using isAuthenticated middleware

router.post('/', createNote);                  // POST /api/notes
router.get('/user/:user', getNotes);           // GET /api/notes/user/:user (all notes for a user)
router.get('/note/:id', getNoteById);            // GET /api/notes/:id (single note by ID)
router.put('/:id', updateNote);                // PUT /api/notes/:id
router.delete('/:id', deleteNote);             // DELETE /api/notes/:id
router.get('/', getUserNotes); // Handles GET /api/notes
router.get('/users', getUsers);                // GET /api/notes/users (all users, for sharing notes)

module.exports = router;
