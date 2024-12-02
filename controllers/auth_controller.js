const AuthModel = require("../models/auth_model"); // call model
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendVerification } = require("../config/emailService");
const uploadImage = require("../helpers/helpers");
const { format } = require("date-fns");

const currentDate = new Date();

// counting expiredAt
// currentDate.getTime() + (minutes) * (seconds) * (miliseconds)
const expiredAt = new Date(currentDate.getTime() + 5 * 60 * 1000); // 5 minutes from now

const expiredAtFormat = format(expiredAt, "yyyy-MM-dd HH:mm:ss");

// counting time difference (in seconds) between expiredAt and now
const expiresIn = Math.floor((expiredAt - currentDate) / 1000); // in seconds

const AuthController = {
  // register process
  register: (req, res) => {
    // console.log(req.body);

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please fill in the email" });
    }

    // Find user by email
    AuthModel.getuser(email, (err, rows) => {
      if (err) return res.status(500).json({ message: err });
      const user = rows[0];
      // console.log(user);

      if (user) {
        return res.status(400).json({
          message: "The email already registered, you can login now!",
        });
      } else {
        // Create token
        const token = jwt.sign({ email }, process.env.SECRET_KEY, {
          expiresIn: expiresIn,
        });

        // Verify process
        AuthModel.email_register_verif(
          email,
          token,
          expiredAtFormat,
          (err, rows) => {
            if (err) return res.status(500).json({ message: err });

            // User will receive email message for verification
            sendVerification(email, token, "verify");

            return res.status(200).json({
              message: "Email has sent, please check your email for verify!",
            });
          }
        );
      }
    });
  },

  // Forgot password process
  forgotPassword: (req, res) => {
    // console.log(req.body);

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please fill in the email" });
    }

    // Find user by email
    AuthModel.getuser(email, (err, rows) => {
      if (err) return res.status(500).json({ message: err });
      const user = rows[0];
      // console.log(user);

      if (user) {
        // Create token
        const token = jwt.sign({ email }, process.env.SECRET_KEY, {
          expiresIn: expiresIn,
        });

        // Verify process
        AuthModel.email_fp_verif(email, token, expiredAtFormat, (err, rows) => {
          if (err) return res.status(500).json({ message: err });

          // User will receive email message for verification
          sendVerification(email, token, "resetPassword");

          return res.status(200).json({
            message: "Email has sent, please check your email for verify!",
          });
        });
      } else {
        return res.status(400).json({
          message: "User not found",
        });
      }
    });
  },

  verify_email: (req, res) => {
    const { email, token, action } = req.query;
    // console.log(action);

    // Email verify for register
    if (action === "verify") {
      AuthModel.getemail(email, (err, rows) => {
        if (err) return res.status(500).json({ message: err });

        const user = rows[0];

        if (user.status === 0) {
          return res.status(400).json({ message: "Invalid" });
        }

        if (currentDate > user.expired_at) {
          return res.status(400).json({ message: "Token Expired" });
        } else {
          // Verify process
          jwt.verify(token, process.env.SECRET_KEY, (err) => {
            if (err) return res.status(500).json({ message: err });

            AuthModel.email_register_verified(email, (err) => {
              if (err) {
                return res.status(500).json({ message: err });
              } else {
                return res
                  .status(200)
                  .json({ message: "Email verified, you can register now!" });
              }
            });
          });
        }
      });
    }

    // Email verify for forgot password
    if (action === "resetPassword") {
      AuthModel.getrp(email, (err, rows) => {
        if (err) return res.status(500).json({ message: err });

        const user = rows[0];

        if (user.status === 0) {
          return res.status(400).json({ message: "Invalid" });
        }

        if (currentDate > user.expired_at) {
          return res.status(400).json({ message: "Token Expired" });
        } else {
          jwt.verify(token, process.env.SECRET_KEY, (err) => {
            if (err) return res.status(500).json({ message: err });

            AuthModel.email_fp_verified(email, (err) => {
              if (err) {
                return res.status(500).json({ message: err });
              } else {
                return res.status(200).json({
                  message: "Email verified, you can reset password now!",
                });
              }
            });
          });
        }
      });
    }

    // console.log(user);
  },

  // Data completion process
  data_register: async (req, res) => {
    const { name, email, education, phone_number, password } = req.body;

    // console.log(req.file);

    if (!name || !email || !education || !phone_number || !password) {
      return res.status(400).json({ message: "Please fill in all fields!" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image!" });
    }

    try {
      const image = await uploadImage(req.file);

      // console.log(image);

      AuthModel.getemail(email, (err, rows) => {
        if (err) return res.status(500).json({ message: err });

        const verifiedUser = rows[0];

        if (!verifiedUser)
          return res.status(400).json({
            message: "The email isn't registered yet, please register first!",
          });

        // console.log(user);

        if (verifiedUser.status === 1) {
          return res.status(400).json({
            message: "The email isn't verified yet, please verify email first!",
          });
        }

        AuthModel.getuser(email, (err, rows) => {
          if (err) return res.status(500).json({ message: err });

          const user = rows[0];

          // console.log(user);

          if (user.created_at !== null) {
            return res.status(400).json({
              message: "The email already registered, you can login now!",
            });
          }

          const userData = { ...req.body, image: req.file.originalname };
          AuthModel.register(userData, (err) => {
            if (err) return res.status(500).json({ message: err });

            return res
              .status(201)
              .json({ message: "Register success, you can login now!" });
          });
        });
      });
    } catch (err) {
      // console.log(err.message);
      return res.status(500).json({ message: err.message });
    }
  },

  // Change password before login
  reset_password: (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields!" });
    }

    AuthModel.getrp(email, (err, rows) => {
      const resetPassUser = rows[0];

      // console.log(resetPassUser);

      if (resetPassUser.status === 2) {
        return res.status(400).json({
          message: "The email isn't verified yet, please verify email first!",
        });
      }

      if (resetPassUser.status === 0) {
        return res.status(400).json({
          message: "Please request reset password again!",
        });
      }

      AuthModel.getuser(email, (err, rows) => {
        if (err) return res.status(500).json({ message: err });

        const user = rows[0];

        if (!user) return res.status(400).json({ message: "User not found!" });

        // console.log(user);

        AuthModel.change_pass(req.body, (err) => {
          if (err) return res.status(500).json({ message: err });

          return res.status(200).json({ message: "Reset password success!" });
        });
      });
    });
  },

  // login process
  login: (req, res) => {
    // console.log(req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Find user by email
    AuthModel.getuser(email, (err, rows) => {
      if (err) return res.status(500).json({ message: err });

      const user = rows[0];
      // console.log(user);

      // Prepare payload data
      const payload = {
        name: user.name,
        email: email,
        education: user.education,
        image: `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${user.image}`,
        phone_number: user.phone_number,
      };

      if (!user || !user.email) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Password check
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) return res.status(500).json({ message: err });

        if (result) {
          // create token and send payload data
          const token = jwt.sign({ payload }, process.env.SECRET_KEY, {
            expiresIn: "1h",
          });

          AuthModel.login(email, token, (err) => {
            if (err) return res.status(500).json({ message: err });
            return res
              .status(200)
              .json({ message: "Login Success!", token, data: payload });
          });
        } else {
          return res.status(400).json({ message: "Invalid email or password" });
        }
      });
    });
  },

  // logout process
  // Note :
  // This process will be deleted remember_token column
  logout: (req, res) => {
    AuthModel.logout(req.user.payload.email, (err) => {
      if (err) return res.status(500).json({ message: err });

      return res.status(200).json({ message: "Logout Success!" });
    });
    // req.session.destroy(); // destroy session
  },
};

module.exports = AuthController; // export controller
