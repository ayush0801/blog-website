const { Router } = require('express');
const authController = require('../controllers/authController');


const userModel = require('../models/UserModel');

const router = Router();


router.post('/signup',authController.signup_post); 
router.post('/login', authController.login_post);
router.post('/verify-otp', authController.verify_otp);
router.get('/logout', authController.logout_get);
router.post('/forgot-password', authController.forgot_password);
router.get('/reset-password', authController.reset_password);

module.exports = router;   