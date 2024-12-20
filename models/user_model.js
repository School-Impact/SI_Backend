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

  update: async (userEmail, data, callback) => {
    const { name, education, image, phone_number, password } = data;
    const passwordHashed = await bcrypt.hash(password, 10);
    db.query(
      `UPDATE users SET
      name = '${name}',
      education = '${education}',
      image = '${image}',
      phone_number = '${phone_number}',
      password = '${passwordHashed}'
      WHERE email = '${userEmail}'`,
      callback
    );
  },

  getmajors: (category, callback) => {
    db.query(
      `SELECT id, name, description
      FROM majors
      WHERE category = '${category}'`,
      callback
    );
  },

  getdetailmajors: (id, callback) => {
    console.log("Executing query for ID:", id);
    db.query(
      `SELECT majors.name AS major_name, majors.description, 
      programs.name AS program_name, competencies.name AS competency_name
      FROM majors
      LEFT JOIN programs
      ON majors.id = programs.major_id
      LEFT JOIN competencies
      ON programs.id = competencies.program_id 
      WHERE majors.id = '${id}'`,
      callback
    );
  },

  savePrediction: (userId, major, interest, callback) => {
    const currentDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const query = `INSERT INTO predictions (user_id, majors, interest, created_at) VALUES (?, ?, ?, ?)`;
    db.query(query, [userId, major, interest, currentDate], (err, result) => {
      if (err) {
        console.error("Error inserting prediction: ", err);
        return callback(err);
      }
      callback(null, result);
    });
  },
};

module.exports = UserModel; // export model
