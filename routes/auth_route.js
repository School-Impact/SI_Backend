const express = require("express");
const AuthController = require("../controllers/auth_controller"); // call controller

const router = express.Router(); // router

const authenticateToken = require("../middlewares/auth_middleware"); // call middleware
const multerMid = require("../middlewares/multer_middleware");

// Create routes for controllers
router.post("/register", multerMid.none(), AuthController.register);
router.post(
  "/dataRegister",
  multerMid.single("image"),
  AuthController.data_register
);
router.post("/forgotPassword", multerMid.none(), AuthController.forgotPassword);
router.patch("/resetPassword", multerMid.none(), AuthController.reset_password);
router.post("/login", multerMid.none(), AuthController.login);
router.patch("/logout", authenticateToken, AuthController.logout);
router.get("/verify_email", AuthController.verify_email);

module.exports = router; // export router
