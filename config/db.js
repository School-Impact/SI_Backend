const mysql = require("mysql"); // call mysql library
require("dotenv").config(); // call dotenv library

// Create connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

module.exports = db; // export db
