const express = require('express');
const AuthController = require('../controllers/auth_controller'); // call controller

const router = express.Router(); // router

// Create routes for controllers
router.post('/register', AuthController.register);
router.post('/dataRegister', AuthController.data_register);
router.post('/forgotPassword', AuthController.forgotPassword);
router.post('/resetPassword', AuthController.reset_password);
router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);
router.get('/verify_email', AuthController.verify_email);

module.exports = router; // export router
