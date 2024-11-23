const AuthModel = require('../models/auth_model'); // call model
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendVerification } = require('../config/emailService');
const { format } = require('date-fns');

const currentDate = new Date();

// counting expiredAt
// currentDate.getTime() + (minutes) * (seconds) * (miliseconds)
const expiredAt = new Date(currentDate.getTime() + 5 * 60 * 1000); // 5 minutes from now

const expiredAtFormat = format(expiredAt, 'yyyy-MM-dd HH:mm:ss');
// const dateNowAtFormat = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

// counting time difference (in seconds) between expiredAt and now
const expiresIn = Math.floor((expiredAt - currentDate) / 1000); // in seconds

const AuthController = {
  // render form
  // loginForm: (req, res) => {
  //   res.render("auth032/form_login_032", {
  //     success: req.flash("success"),
  //     failed: req.flash("failed"),
  //   });
  // },

  // register process
  register: (req, res) => {
    // console.log(req.body);

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please fill in the email' });
    }

    // Find user by email
    AuthModel.getuser(email, (err, rows) => {
      if (err) return res.status(500).json({ message: err });
      const user = rows[0];
      // console.log(user);

      if (user) {
        return res.status(400).json({
          message: 'The email already registered, you can login now!',
        });
      } else {
        const token = jwt.sign({ email }, process.env.SECRET_KEY, {
          expiresIn: expiresIn,
        });

        AuthModel.email_register_verif(
          email,
          token,
          expiredAtFormat,
          (err, rows) => {
            if (err) return res.status(500).json({ message: err });

            sendVerification(email, token, 'verify');

            return res.status(200).json({
              message: 'Email has sent, please check your email for verify!',
            });
          }
        );
      }
    });
  },

  // register process
  forgotPassword: (req, res) => {
    // console.log(req.body);

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please fill in the email' });
    }

    // Find user by email
    AuthModel.getuser(email, (err, rows) => {
      if (err) return res.status(500).json({ message: err });
      const user = rows[0];
      // console.log(user);

      if (user) {
        const token = jwt.sign({ email }, process.env.SECRET_KEY, {
          expiresIn: expiresIn,
        });

        AuthModel.email_fp_verif(email, token, expiredAtFormat, (err, rows) => {
          if (err) return res.status(500).json({ message: err });

          sendVerification(email, token, 'resetPassword');

          return res.status(200).json({
            message: 'Email has sent, please check your email for verify!',
          });
        });
      } else {
        return res.status(400).json({
          message: 'User not found',
        });
      }
    });
  },

  verify_email: (req, res) => {
    const { email, token, action } = req.query;
    // console.log(action);
    if (action === 'verify') {
      AuthModel.getemail(email, (err, rows) => {
        if (err) return res.status(500).json({ message: err });

        const user = rows[0];

        if (user.status === 0) {
          return res.status(400).json({ message: 'Invalid' });
        }

        if (currentDate > user.expired_at) {
          return res.status(400).json({ message: 'Token Expired' });
        } else {
          jwt.verify(token, process.env.SECRET_KEY, (err) => {
            if (err) return res.status(500).json({ message: err });

            AuthModel.email_register_verified(email, (err) => {
              if (err) {
                return res.status(500).json({ message: err });
              } else {
                return res
                  .status(200)
                  .json({ message: 'Email verified, you can register now!' });
              }
            });
          });
        }
      });
    }

    if (action === 'resetPassword') {
      AuthModel.getrp(email, (err, rows) => {
        if (err) return res.status(500).json({ message: err });

        const user = rows[0];

        if (user.status === 0) {
          return res.status(400).json({ message: 'Invalid' });
        }

        if (currentDate > user.expired_at) {
          return res.status(400).json({ message: 'Token Expired' });
        } else {
          jwt.verify(token, process.env.SECRET_KEY, (err) => {
            if (err) return res.status(500).json({ message: err });

            AuthModel.email_fp_verified(email, (err) => {
              if (err) {
                return res.status(500).json({ message: err });
              } else {
                return res.status(200).json({
                  message: 'Email verified, you can reset password now!',
                });
              }
            });
          });
        }
      });
    }

    // console.log(user);
  },

  data_register: (req, res) => {
    const { name, email, education, phone_number, password } = req.body;
    // const currentDate = new Date();
    const dateFormat = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

    if (!name || !email || !education || !phone_number || !password) {
      return res.status(400).json({ message: 'Please fill in all fields!' });
    }

    // console.log(user);
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
            message: 'The email already registered, you can login now!',
          });
        }

        AuthModel.register(req.body, (err) => {
          if (err) return res.status(500).json({ message: err });

          req.session.user = {
            name: name,
            email: email,
            education: education,
            phone_number: phone_number,
          };
          return res
            .status(201)
            .json({ message: 'Register success, you can login now!' });
        });
      });
    });
  },

  reset_password: (req, res) => {
    const { email, password } = req.body;
    // const currentDate = new Date();
    // const dateFormat = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields!' });
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
          message: 'Please request reset password again!',
        });
      }

      AuthModel.getuser(email, (err, rows) => {
        if (err) return res.status(500).json({ message: err });

        const user = rows[0];

        if (!user) return res.status(400).json({ message: 'User not found!' });

        // console.log(user);

        AuthModel.change_pass(req.body, (err) => {
          if (err) return res.status(500).json({ message: err });

          return res.status(200).json({ message: 'Reset password success!' });
        });
      });
    });
  },

  // login process
  login: (req, res) => {
    // console.log(req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Find user by email
    AuthModel.getuser(email, (err, rows) => {
      if (err) return res.status(500).json({ message: err });

      const user = rows[0];
      // console.log(user.username);

      if (!user || !user.email) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Password check
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) return res.status(500).json({ message: err });

        if (result) {
          // create token
          const token = jwt.sign({ email }, process.env.SECRET_KEY, {
            expiresIn: '1h',
          });

          AuthModel.login(email, token, (err) => {
            if (err) return res.status(500).json({ message: err });

            // create session
            req.session.user = {
              name: user.name,
              email: email,
              education: user.education,
              phone_number: user.phone_number,
            };
            return res.status(200).json({ message: 'Login Success!', token });
            // res.redirect("/");
          });
        } else {
          // req.flash("failed", failedInvalid);
          return res.status(400).json({ message: 'Invalid email or password' });
        }
      });
    });
  },

  // logout process
  // Note :
  // In postman, logout just using GET method without parameter, because this controller will destroy session after login session is created
  // For JWT, this token isn't save in cookies or local storage in browser
  logout: (req, res) => {
    req.session.destroy(); // destroy session
    return res.status(200).json({ message: 'Logout Success!' });
  },
};

module.exports = AuthController; // export controller
