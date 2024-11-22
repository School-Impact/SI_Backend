const AuthModel = require('../models/auth_model'); // call model
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendVerification } = require('../config/emailService');
const { format } = require('date-fns');

const currentDate = new Date();

// counting expiredAt
// currentDate.getTime() + (minutes) * (seconds) * (miliseconds)
const expiredAt = new Date(currentDate.getTime() + 5 * 60 * 1000); // an hour from now

const expiredAtFormat = format(expiredAt, 'yyyy-MM-dd HH:mm:ss');

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
      if (err) return res.json({ message: err });
      const user = rows[0];
      // console.log(user);

      if (user) {
        // console.log('Email sama');
        return res.status(400).json({ message: 'Email already exists' });
      } else {
        const token = jwt.sign({ email }, process.env.SECRET_KEY, {
          expiresIn: expiresIn,
        });

        AuthModel.email_verif(email, token, expiredAtFormat, (err, rows) => {
          if (err) return res.json({ message: err });

          sendVerification(email, token);

          return res
            .status(200)
            .json({ message: 'Please check your email for verify!' });
        });

        // sendVerification(email, token);

        // return res
        //   .status(200)
        //   .json({ message: 'Please check your email for verify!' });
      }
    });
  },

  verify_email: (req, res) => {
    const { email, token } = req.query;
    // const currentDate = new Date();

    // console.log(email);
    // console.log(token);
    AuthModel.getemail(email, (err, rows) => {
      if (err) return res.json({ message: err });

      const user = rows[0];

      if (user.status === 0) {
        return res.status(400).json({ message: 'Invalid' });
      }

      if (currentDate > user.expired_at) {
        return res.status(400).json({ message: 'Token Expired' });
      } else {
        jwt.verify(token, process.env.SECRET_KEY, (err) => {
          if (err) return res.json({ message: err });

          AuthModel.email_verified(email, (err) => {
            if (err) return res.json({ message: err });

            return res.status(200).json({ message: 'Email Verified!' });
          });
        });
      }

      // console.log(user);
    });
  },

  data_register: (req, res) => {
    const { name, email, education, phone_number, password } = req.body;
    // const currentDate = new Date();
    const dateFormat = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

    if (!name || !email || !education || !phone_number || !password) {
      return res.status(400).json({ message: 'Please fill in all fields!' });
    }

    AuthModel.getemail(email, (err, rows) => {
      if (err) return res.json({ message: err });

      const user = rows[0];

      if (!user)
        return res.status(400).json({ message: "You haven't registered yet" });

      // console.log(user);

      if (user.status === 1) {
        return res.status(400).json({ message: 'Please verify email first!' });
      }

      AuthModel.register(req.body, dateFormat, (err) => {
        if (err) return res.json({ message: err });

        req.session.user = {
          name: name,
          email: email,
          education: education,
          phone_number: phone_number,
        };
        return res.status(200).json({ message: 'Register Success!' });
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
      const user = rows[0];
      // console.log(user.username);

      if (!user || !user.email) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Password check
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          // create token
          const token = jwt.sign({ email }, process.env.SECRET_KEY, {
            expiresIn: '1h',
          });

          // create session
          req.session.user = {
            fullname: user.fullname,
            email: user.email,
          };
          return res.status(200).json({ message: 'Login Success!', token });
          // res.redirect("/");
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
