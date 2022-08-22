const { Router } = require('express');
const router = Router();

const { protect } = require('../controllers/authController');
const notificationController = require('../controllers/notificationController');

router.use(protect);

//GET NOTIFICATION
router.get('/', notificationController.getNotification)

//POST NOTIFICATION
router.post('/', notificationController.postNotification)






module.exports = router;