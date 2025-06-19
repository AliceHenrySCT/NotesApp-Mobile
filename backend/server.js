const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth');
const notesRouter = require('./routes/notes');
const {isAuthenticated} = require('./middlewares/auth');
const connectDB = require('./config/db');

//Load environment variables
require('dotenv').config();

//Initialize the app
const app = express();

//Middleware
app.use(cors());
app.use(bodyParser.json());

//Connect to MongoDB
connectDB();

//Routes
app.use('/api/auth', authRouter);
app.use('/api/notes', isAuthenticated, notesRouter);

//Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
