const express = require("express");
const AuthController = require("../controllers/auth_controller"); // call controller

const router = express.Router(); // router

const authenticateToken = require("../middlewares/auth_middleware"); // call middleware

// Create routes for controllers
router.post("/register", AuthController.register);
router.post("/dataRegister", AuthController.data_register);
router.post("/forgotPassword", AuthController.forgotPassword);
router.patch("/resetPassword", AuthController.reset_password);
router.post("/login", AuthController.login);
router.patch("/logout", authenticateToken, AuthController.logout);
router.get("/verify_email", AuthController.verify_email);

module.exports = router; // export router
