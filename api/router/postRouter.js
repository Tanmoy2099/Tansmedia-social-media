const { Router } = require('express');

const authController = require('../controllers/authController');
const postController = require('../controllers/postController');

const router = Router();


router.use(authController.protect)

// CREATE A POST
router.post('/', postController.createPost);

// GET ALL POSTS
router.get('/', postController.getAllPost);

// GET POST BY ID
router.get('/:postId', postController.getPostById);

// DELETE POST BY ID
router.delete('/:postId', postController.deletePostById);

//LIKE A POST
router.post('/like/:postId', postController.likeAPost);

//UNLIKE A POST
router.put('/unlike/:postId', postController.unLikeAPost);

//GET ALL LIKES
router.get('/like/:postId', postController.getAllLikesOfAPost);

// CREATE A COMMENT
router.post('/comment/:postId', postController.createComment);

// DELETE A COMMENT
router.delete('/:postId/:commentId', postController.deleteComment);




module.exports = router;