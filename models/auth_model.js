const db = require('./../config/db'); // call and execute db
const bcrypt = require('bcrypt'); // call bcrypt library

// Create model
const AuthModel = {
  // Get all
  read: (callback) => {
    db.query('SELECT * FROM users', (err, result) => {
      if (err) throw err;
      callback(result);
    });
  },

  // Get user by email
  getuser: (email, callback) => {
    db.query(`SELECT * FROM users WHERE email = '${email}'`, callback);
  },

  // Add
  register: async (data, created_at, callback) => {
    const password = await bcrypt.hash(data.password, 10);
    db.query(
      `UPDATE users SET
      name = '${data.name}',
      email = '${data.email}',
      education = '${data.education}',
      phone_number = '${data.phone_number}',
      password = '${password}',
      created_at = '${created_at}'`,
      callback
    );
  },

  // Get email verification
  getemail: (email, callback) => {
    db.query(
      `SELECT * FROM email_verification_tokens WHERE email = '${email}' ORDER BY id DESC LIMIT 1`,
      callback
    );
  },

  // Email verification
  email_verif: (email, token, expired_at, callback) => {
    db.query(
      `INSERT INTO email_verification_tokens SET
      email = '${email}',
      token = '${token}',
      expired_at = '${expired_at}'`,
      callback
    );
  },

  email_verified: (email, callback) => {
    db.query(
      `UPDATE email_verification_tokens SET
      status = '0'
      WHERE email = '${email}'`,
      callback
    );

    db.query(
      `INSERT INTO users SET
      email = '${email}'`,
      callback
    );
  },
};

module.exports = AuthModel; // export model
