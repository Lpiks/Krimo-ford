const express = require('express');
const { createMessage, getMessages, deleteMessage, markAsRead } = require('../controllers/messageController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(createMessage).get(protect, admin, getMessages);
router.route('/:id').delete(protect, admin, deleteMessage);
router.route('/:id/read').put(protect, admin, markAsRead);

module.exports = router;
