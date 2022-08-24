const { Router } = require('express');


const authController = require('../controllers/authController');
// const userController = require('../controllers/userController');

const router = Router();

router.get('/:username', authController.username);
router.post('/signup', authController.signup);
router.post('/login', authController.login);


//Forgot Password
router.post('/settings/forgotPassword', authController.forgotPassword);

//Reset Password
router.patch('/settings/resetPassword/:token', authController.resetPassword);



router.use(authController.protect);

router.get('/', authController.getUserData);

//UPDATE PROFILE DATA
router.patch('/update', authController.updateProfile);

//Update Password
router.patch('/settings/updatePassword', authController.updatePassword);

//UPDATE MESSAGE POPUP SETTINGS
router.post('/settings/messagePopup', authController.messagePopup);

module.exports = router;

