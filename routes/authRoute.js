const express = require('express');
const router = express();
const passport = require('passport'); 
require('../passport');

router.use(passport.initialize()); 
router.use(passport.session());

const userController = require('../controller/authController');

router.get('/', userController.loadAuth);

// Auth 
router.get('/auth/google' , passport.authenticate('google', { scope: 
	[ 'email', 'profile' ] 
})); 

// Auth Callback 
router.get( '/__/auth/handler', 
	passport.authenticate( 'google', { 
		successRedirect: '/success', 
		failureRedirect: '/failure'
}));

// Success 
router.get('/success' , userController.successGoogleLogin); 

// failure 
router.get('/failure' , userController.failureGoogleLogin);

module.exports = router;