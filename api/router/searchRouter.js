const { Router } = require('express');

const catchAsync = require('../../utilsServer/catchAsync');
const UserModel = require('../../models/UserModel');

const authController = require('../controllers/authController');

const router = Router();

const searchName = catchAsync(async (req, res, next) => {
  const { searchText } = req.params;
  const { userId } = req;


  let results = [];

  const regex = new RegExp(`^${searchText}`, 'i');

  if (searchText.length !== 0) {
    results = await UserModel.find({
      $or: [
        { name: regex },
        { username: regex },
        { email: regex }
      ]
    });
  }

  if (results.length > 0) {
    results = results.filter(user => user._id.toString() !== userId);
  }


  res.status(200).json({
    status: 'ok',
    data: results
  });
});



router.get('/:searchText', authController.protect, searchName)


module.exports = router;
