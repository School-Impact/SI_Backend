const express = require("express");
const UserController = require("../controllers/user_controller"); // call controller
const PredictController = require("../controllers/predict_controller");
const router = express.Router(); // router

const authenticateToken = require("../middlewares/auth_middleware"); // call middleware
const multerMid = require("../middlewares/multer_middleware");

// Create routes for controllers
router.get("/home", authenticateToken, UserController.home);
router.get("/profile", authenticateToken, UserController.user);
router.patch("/update", multerMid.single("image"), UserController.update);

router.post("/predict", authenticateToken, PredictController.predict);

module.exports = router; // export router
