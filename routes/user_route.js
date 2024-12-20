const express = require("express");
const UserController = require("../controllers/user_controller"); // call controller
const PredictController = require("../controllers/predict_controller");
const router = express.Router(); // router

const authenticateToken = require("../middlewares/auth_middleware"); // call middleware
const multerMid = require("../middlewares/multer_middleware");

// Create routes for controllers
router.get("/home", authenticateToken, UserController.home);
router.get("/profile", authenticateToken, UserController.user);
router.post(
  "/update",
  authenticateToken,
  multerMid.single("image"),
  UserController.update
);
router.get("/majors", authenticateToken, UserController.majorsList);
router.get("/majorsDetail/:id", authenticateToken, UserController.majorsDetail);

router.post("/predict", authenticateToken, PredictController.predict);

module.exports = router; // export router
