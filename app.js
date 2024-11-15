const express = require('express');
require('dotenv').config();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

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

// Check if server is running
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
