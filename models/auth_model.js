const db = require("./../config/db"); // call and execute db
const bcrypt = require("bcrypt"); // call bcrypt library
const { format } = require("date-fns");

const currentDate = new Date();

const dateNowAtFormat = format(currentDate, "yyyy-MM-dd HH:mm:ss");

// Create model
const AuthModel = {
  // Get all
  read: (callback) => {
    db.query("SELECT * FROM users", (err, result) => {
      if (err) throw err;
      callback(result);
    });
  },

  // Get user by email
  getuser: (email, callback) => {
    db.query(`SELECT * FROM users WHERE email = '${email}'`, callback);
  },

  // Add
  register: async (data, callback) => {
    const { name, education, image, phone_number, email, password } = data;
    const passwordHashed = await bcrypt.hash(password, 10);
    db.query(
      `UPDATE users SET
      name = '${name}',
      education = '${education}',
      image = '${image}',
      phone_number = '${phone_number}',
      password = '${passwordHashed}',
      created_at = '${dateNowAtFormat}'
      WHERE email = '${email}'`,
      callback
    );
  },

  login: (email, token, callback) => {
    db.query(
      `UPDATE users SET
      remember_token = '${token}'
      WHERE email = '${email}'`,
      callback
    );
  },

  logout: (email, callback) => {
    db.query(
      `UPDATE users SET
      remember_token = ''
      WHERE email = '${email}'`,
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

  // Get email verification
  getrp: (email, callback) => {
    db.query(
      `SELECT * FROM password_reset_tokens WHERE email = '${email}' ORDER BY id DESC LIMIT 1`,
      callback
    );
  },

  // Email verification
  email_register_verif: (email, token, expired_at, callback) => {
    db.query(
      `INSERT INTO email_verification_tokens SET
      email = '${email}',
      token = '${token}',
      expired_at = '${expired_at}'`,
      callback
    );
  },

  email_fp_verif: (email, token, expired_at, callback) => {
    db.query(
      `INSERT INTO password_reset_tokens SET
      email = '${email}',
      token = '${token}',
      expired_at = '${expired_at}'`,
      callback
    );
  },

  email_register_verified: (email, callback) => {
    db.query(
      `UPDATE email_verification_tokens SET
      status = '0'
      WHERE email = '${email}'`,
      (err, result) => {
        if (err) {
          return callback(err);
        }
        db.query(
          `INSERT INTO users SET
          email = '${email}',
          verified_at = '${dateNowAtFormat}'`,
          (err, result) => {
            if (err) {
              return callback(err);
            }

            callback(null, result);
          }
        );
      }
    );
  },

  email_fp_verified: (email, callback) => {
    db.query(
      `UPDATE password_reset_tokens SET
      status = '1'
      WHERE email = '${email}'`,
      (err, result) => {
        if (err) {
          return callback(err);
        }
      }
    );
  },

  change_pass: async (data, callback) => {
    const password = await bcrypt.hash(data.password, 10);
    db.query(
      `UPDATE users SET
      password = '${password}'
      WHERE email = '${data.email}'`,
      (err, result) => {
        if (err) {
          return callback(err);
        }

        db.query(
          `UPDATE password_reset_tokens SET
          status = '0'
          WHERE email = '${data.email}'`,
          (err, result) => {
            if (err) {
              return callback(err);
            }

            callback(null, result);
          }
        );
      }
    );
  },
};

module.exports = AuthModel; // export model
