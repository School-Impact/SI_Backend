const express = require("express");
require("dotenv").config();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const { PubSub } = require("@google-cloud/pubsub");
const logRequests = require("../middleware/logging");

// const nodemailer = require("nodemailer");

// Session library
const session = require("express-session");

// Router
const authRouter = require("./routes/auth_route");
const userRouter = require("./routes/user_route");
const pubSubClient = new PubSub();
const app = express();

app.disable("x-powered-by");
// app.use(multerMid.single("file"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Subscriber Pub/Sub
const listenForMessages = () => {
  const subscriptionName = process.env.SUBSCRIPTION_NAME;
  const subscription = pubSubClient.subscription(subscriptionName);

  subscription.on("message", (message) => {
    console.log(`Received message: ${message.id}`);
    console.log(`Data: ${message.data.toString()}`);
    console.log(`Attributes: ${JSON.stringify(message.attributes)}`);
    message.ack();
  });

  subscription.on("error", (error) => {
    console.error("Subscriber error:", error.message);
  });

  console.log(`Listening for messages on subscription: ${subscriptionName}`);
};

// Mulai mendengarkan pesan
listenForMessages();

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
  return res.status(200).json({ message: "Hallo" });
});

// Middleware global untuk logging
app.use(logRequests);

// Check if server is running
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
