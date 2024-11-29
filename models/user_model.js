const db = require("../config/db"); // call and execute db
const bcrypt = require("bcrypt"); // call bcrypt library
const { format } = require("date-fns");

const currentDate = new Date();

const dateNowAtFormat = format(currentDate, "yyyy-MM-dd HH:mm:ss");

// Create model
const UserModel = {
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

  // Update data
  update: async (data, callback) => {
    const password = await bcrypt.hash(data.password, 10);
    db.query(
      `UPDATE users SET
      name = '${data.name}',
      education = '${data.education}',
      phone_number = '${data.phone_number}',
      password = '${password}',
      created_at = '${dateNowAtFormat}'
      WHERE email = '${data.email}'`,
      callback
    );
  },

  // ========================================================================================
  // Not finished yet
  // change_pass: async (data, callback) => {
  //   const password = await bcrypt.hash(data.password, 10);
  //   db.query(
  //     `UPDATE users SET
  //     password = '${password}'
  //     WHERE email = '${data.email}'`,
  //     (err, result) => {
  //       if (err) {
  //         return callback(err);
  //       }

  //       db.query(
  //         `UPDATE password_reset_tokens SET
  //         status = '0'
  //         WHERE email = '${data.email}'`,
  //         (err, result) => {
  //           if (err) {
  //             return callback(err);
  //           }

  //           callback(null, result);
  //         }
  //       );
  //     }
  //   );
  // },
  // ========================================================================================
};

module.exports = UserModel; // export model
