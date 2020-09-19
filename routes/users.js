const express = require('express');
const { getUser, getUsers, createUser, updateUser, deleteUser } = require('../controllers/users');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

const { protect, authotize } = require('../middleware/auth');

const User = require('../models/User');

router.use(protect);
router.use(authotize('admin'));

router.route('/').get(advancedResults(User), getUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
