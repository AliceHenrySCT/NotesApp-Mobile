const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getUsername,
  removeUser,
} = require('../controllers/noteController');
const { isAuthenticated } = require('../middlewares/auth');

// Auth and user management routes
router.post('/register', register);   // POST /api/auth/register
router.post('/login', login);         // POST /api/auth/login
router.get('/welcome', isAuthenticated, (req, res) => {
  res.status(200).json({ message: `Welcome ${req.user.username}` });
});

router.get('/username/:id', getUsername);      // GET /api/auth/username/:id
router.put('/username/:id', removeUser);       // PUT /api/auth/username/:id

module.exports = router;
