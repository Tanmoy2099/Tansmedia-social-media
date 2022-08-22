const express = require('express');

const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');


const router = express.Router();


router.use(authController.protect);

//GET PROFILE INFO
router.get('/:username', profileController.getProfileData);

//GET POSTS OF A PROFILE
router.get('/posts/:username', profileController.getProfileDataForAPost);

//GET FOLLOWERS
router.get('/followers/:userId', profileController.getFollowers);

//GET FOLLOWING
router.get('/following/:userId', profileController.getFollowing);

//FOLLOW A USER
router.post('/follow/:userToFollowId', profileController.followAUser);

//UNFOLLOW A USER
router.put('/unfollow/:userToUnfollowId', profileController.unFollowAUser);








module.exports = router;