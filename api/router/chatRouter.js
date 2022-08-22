const { Router } = require('express');

const router = Router();


const { protect } = require('../controllers/authController');
const chatController = require('../controllers/chatController');


router.use(protect);


// GET ALL CHATS
router.get('/', chatController.getAllChats)

//Get User Info
router.get('/user/:userToFindId', chatController.getUserInfo)

//Delete a chat
router.get('/:messagesWith', chatController.deleteAChat)







module.exports = router;