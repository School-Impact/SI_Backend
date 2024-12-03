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
        res.status(400).json({ message: "Please login first!" });
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
        res.status(400).json({ message: "Cannot get user data" });
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
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = UserController; // export controller
