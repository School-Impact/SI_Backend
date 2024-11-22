const express = require('express');
require('dotenv').config();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // JWT library
const nodemailer = require('nodemailer');

// Session library
const session = require('express-session');

// Router
const authRouter = require('./routes/auth_route');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: process.env.SESSION,
    saveUninitialized: false,
    resave: false,
  })
);

// Use Router
app.use('/auth', authRouter);

// Root
app.get('/', (req, res) => {
  return res.status(200).json({ message: 'OK!' });
});

// Ensure user has login with middleware
app.get('/home', authenticateToken, (req, res) => {
  return res.status(200).json({ message: "You're logged in!" });
});

// Middleware for token verify
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(403).json({ message: 'Unauthorized' });

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    console.log(err);
    if (err) return res.status(403).json({ message: 'Unauthorized' });
    req.user = user;
    next();
  });
}

// Check if server is running
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
