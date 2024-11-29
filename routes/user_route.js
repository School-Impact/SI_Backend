const express = require("express");
const UserController = require("../controllers/user_controller"); // call controller

const router = express.Router(); // router

const authenticateToken = require("../middlewares/auth_middleware"); // call middleware

// ========================================================================================
// Not finished yet
// Upload Image
const multer = require("multer");
const uploadImage = require("../helpers/helpers");

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    // no larger than 2mb.
    fileSize: 2 * 1024 * 1024,
  },
});
// ========================================================================================

// Create routes for controllers
router.get("/home", authenticateToken, UserController.home);
router.get("/profile", authenticateToken, UserController.user);
router.patch("/update", UserController.update);
// router.post('/forgotPassword', AuthController.forgotPassword);
// router.post('/resetPassword', AuthController.reset_password);
// router.post('/login', AuthController.login);
// router.get('/logout', AuthController.logout);
// router.get('/verify_email', AuthController.verify_email);

module.exports = router; // export router
