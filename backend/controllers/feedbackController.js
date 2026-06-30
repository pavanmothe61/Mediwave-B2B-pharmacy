const Feedback = require('../models/Feedback');
const User = require('../models/User');

exports.submitFeedback = async (req, res) => {
  try {
    const { rating, message } = req.body;
    
    // Ensure rating is valid
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Valid rating (1-5) is required' });
    }

    const feedback = await Feedback.create({
      user_id: req.user.id,
      rating,
      message
    });

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error while submitting feedback' });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      include: [{ model: User, attributes: ['name', 'email', 'location'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(feedbacks);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ message: 'Server error while fetching feedback' });
  }
};
