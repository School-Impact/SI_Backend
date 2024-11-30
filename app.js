const express = require("express");
require("dotenv").config();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");

// const nodemailer = require("nodemailer");

// Session library
const session = require("express-session");

// Router
const authRouter = require("./routes/auth_route");
const userRouter = require("./routes/user_route");

const app = express();

app.disable("x-powered-by");
// app.use(multerMid.single("file"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Session
app.use(
  session({
    secret: process.env.SESSION,
    saveUninitialized: false,
    resave: false,
  })
);

// Use Router
app.use("/auth", authRouter);
app.use("/user", userRouter);

// Root
app.get("/", (req, res) => {
  return res.status(200).json({ message: "Test CI / CD!" });
});

// Check if server is running
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
