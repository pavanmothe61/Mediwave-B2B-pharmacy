const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, notificationController.getNotifications);
router.put('/mark-read', verifyToken, notificationController.markAsRead);
router.delete('/clear', verifyToken, notificationController.clearAll);
router.delete('/:id', verifyToken, notificationController.deleteNotification);

module.exports = router;
