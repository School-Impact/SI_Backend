const UserModel = require("../models/user_model"); // call model
const uploadImage = require("../helpers/helpers");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const UserController = {
  // Ensure user has login with middleware
  home: (req, res) => {
    UserModel.getuser(req.user.payload.email, (err, rows) => {
      if (err) return res.status(500).json({ message: err });
      const user = rows[0];
      if (user.remember_token !== "") {
        res.status(200).json({
          message: "You're logged in!",
          data: req.user.payload,
        });
      } else {
        res.status(403).json({ message: "Please login first!" });
      }
    });
  },

  // Get data personal (profile)
  user: (req, res) => {
    UserModel.getuser(req.user.payload.email, (err, rows) => {
      if (err) return res.status(500).json({ message: err });
      const user = rows[0];
      if (user.remember_token) {
        res.status(200).json({
          message: "Get personal data success!",
          data: req.user.payload,
        });
      } else {
        res.status(403).json({ message: "Cannot get user data" });
      }
    });
  },

  // ========================================================================================
  // Not finished yet
  changePassword: (req, res) => {
    // console.log(req.body);

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please fill in the email" });
    }

    // Find user by email
    UserModel.getuser(email, (err, rows) => {
      if (err) return res.status(500).json({ message: err });
      const user = rows[0];
      console.log(user);

      // if (user) {

      // } else {
      //   return res.status(400).json({
      //     message: "User not found",
      //   });
      // }
    });
  },
  // ========================================================================================

  // Update data
  update: async (req, res) => {
    const { name, email, education, phone_number, password } = req.body;

    if (!name || !email || !education || !phone_number || !password) {
      return res.status(400).json({ message: "Please fill in all fields!" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image!" });
    }

    try {
      await uploadImage(req.file);

      UserModel.getuser(email, (err, rows) => {
        if (err) return res.status(500).json({ message: err });

        const user = rows[0];

        if (!user) {
          return res.status(400).json({
            message: "User not found!",
          });
        }

        const payload = {
          name: name,
          email: email,
          education: education,
          image: `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${req.file.originalname}`,
          phone_number: phone_number,
        };

        const userData = { ...req.body, image: req.file.originalname };
        const token = jwt.sign({ payload }, process.env.SECRET_KEY, {
          expiresIn: "1h",
        });
        UserModel.update(userData, token, (err) => {
          if (err) return res.status(500).json({ message: err });

          return res
            .status(201)
            .json({ message: "Update Successfully", token });
        });
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  majorsList: (req, res) => {
    const category = req.query.category;
    UserModel.getuser(req.user.payload.email, (err, rows) => {
      if (err) return res.status(500).json({ message: err });
      const user = rows[0];
      if (user.remember_token !== "") {
        UserModel.getmajors(category, (err, rows) => {
          if (err) return res.status(500).json({ message: err });
          res
            .status(200)
            .json({ message: "Get majors list success!", data: rows });
        });
      } else {
        res.status(403).json({ message: "Please login first!" });
      }
    });
  },

  majorsDetail: (req, res) => {
    const id = req.params.id; // Ambil ID dari path params
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
    console.log("Received ID:", id); // Debugging: Pastikan ID diterima dengan benar

    UserModel.getuser(req.user.payload.email, (err, rows) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "Error fetching user", error: err });
      }

      const user = rows[0];
      if (!user || user.remember_token === "") {
        return res.status(403).json({ message: "Please login first!" });
      }

      // Lanjutkan ke model untuk mendapatkan detail major
      UserModel.getdetailmajors(id, (err, rows) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "Error fetching major details", error: err });
        }

        // Proses data menjadi struktur yang diinginkan
        const majorsData = [];
        rows.forEach((row) => {
          // Cari major berdasarkan nama
          let major = majorsData.find((m) => m.name === row.major_name);
          if (!major) {
            major = {
              name: row.major_name,
              description: row.description,
              programs: [],
            };
            majorsData.push(major);
          }

          // Cari program berdasarkan nama
          let program = major.programs.find((p) => p.name === row.program_name);
          if (!program) {
            program = {
              name: row.program_name,
              competencies: [],
            };
            major.programs.push(program);
          }

          // Tambahkan competency jika ada
          if (row.competency_name) {
            program.competencies.push({
              name: row.competency_name,
            });
          }
        });

        // Berikan respons dengan data yang sudah terstruktur
        res.status(200).json({
          message: "Get detail majors success!",
          data: majorsData,
        });
      });
    });
  },
};

module.exports = UserController; // export controller
