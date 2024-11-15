const express = require("express");
const AuthController = require("../controllers/auth_controller"); // call controller

const router = express.Router(); // router

// Create routes for controllers
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/logout", AuthController.logout);

module.exports = router; // export router
