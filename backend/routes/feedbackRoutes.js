const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Route for Pharmacies to submit feedback
router.post('/', verifyToken, feedbackController.submitFeedback);

// Route for Admin to get all feedback
router.get('/', verifyToken, isAdmin, feedbackController.getAllFeedback);

module.exports = router;
