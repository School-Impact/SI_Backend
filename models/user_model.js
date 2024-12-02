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
  update: async (data, token, callback) => {
    const { name, education, image, phone_number, email, password } = data;
    const passwordHashed = await bcrypt.hash(password, 10);
    db.query(
      `UPDATE users SET
      name = '${name}',
      education = '${education}',
      image = '${image}',
      phone_number = '${phone_number}',
      password = '${passwordHashed}',
      remember_token = '${token}'
      WHERE email = '${email}'`,
      callback
    );
  },
};

module.exports = UserModel; // export model
