const AuthModel = require('../models/auth_model'); // call model

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

    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      // req.flash("failed", failedFill);
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Find user by email
    AuthModel.getuser(email, (err, rows) => {
      const user = rows[0];
      // console.log(user);

      if (user) {
        // console.log('Email sama');
        return res.status(400).json({ message: 'Email already exists' });
        // req.flash("failed", failedInvalid);
      } else {
        AuthModel.register(req.body, (err) => {
          req.session.user = {
            fullname: fullname,
            email: email,
          };
          return res.status(200).json({ message: 'Register Success!' });
        });
      }
    });
  },

  // login process
  login: (req, res) => {
    // console.log(req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      // req.flash("failed", failedFill);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Find user by email
    AuthModel.getuser(email, (err, rows) => {
      const user = rows[0];
      // console.log(user.username);

      if (!user || !user.email) {
        // req.flash("failed", failedInvalid);
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // console.log(password);
      // console.log(user.password);
      // const result = ;
      // console.log(result);

      if (password === user.password) {
        // create session
        req.session.user = {
          fullname: user.fullname,
          email: user.email,
        };
        return res.status(200).json({ message: 'Login Success!' });
        // res.redirect("/");
      } else {
        // req.flash("failed", failedInvalid);
        return res.status(400).json({ message: 'Invalid email or password' });
      }
    });
  },

  // logout process
  // Note :
  // In postman, logout just using GET method without parameter, because this controller will destroy session after login session is created
  logout: (req, res) => {
    req.session.destroy(); // destroy session
    return res.status(200).json({ message: 'Logout Success!' });
  },
};

module.exports = AuthController; // export controller
