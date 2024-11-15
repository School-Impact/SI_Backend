const db = require('./../config/db'); // call and execute db
// const bcrypt = require("bcrypt"); // call bcrypt library

// Create model
const AuthModel = {
  // Get all
  read: (callback) => {
    db.query('SELECT * FROM users', (err, result) => {
      if (err) throw err;
      callback(result);
    });
  },

  // Get by email
  getuser: (email, callback) => {
    db.query(`SELECT * FROM users WHERE email = '${email}'`, callback);
  },

  // Add
  register: (data, callback) => {
    db.query(
      `INSERT INTO users SET
      fullname = '${data.fullname}',
      email = '${data.email}',
      password = '${data.password}'`,
      callback
    );
  },
};

module.exports = AuthModel; // export model
