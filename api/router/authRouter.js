const { Router } = require('express');


const authController = require('../controllers/authController');
// const userController = require('../controllers/userController');

const router = Router();

router.get('/:username', authController.username);
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use(authController.protect);

router.get('/', authController.getUserData);

//UPDATE PROFILE DATA
router.patch('/update', authController.updateProfile);

//RESET PROFILE
router.patch('/settings/password', authController.resetPassword);


router.patch('/settings/dark', authController.darkModeToggle);

//UPDATE MESSAGE POPUP SETTINGS
router.post('/settings/messagePopup', authController.messagePopup);

module.exports = router;

