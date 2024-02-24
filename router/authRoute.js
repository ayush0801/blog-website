const { Router } = require('express');
const authController = require('../controllers/authController');


const userModel = require('../models/UserModel');

const router = Router();

// router.get('/signup', authController.signup_get); //not required for Backend
// router.get('/login', authController.login_get); //not required for backend
router.post('/signup',authController.signup_post); 
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

module.exports = router;   