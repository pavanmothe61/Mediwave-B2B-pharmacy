const Notification = require('../models/Notification');
const { Op } = require('sequelize');

exports.getNotifications = async (req, res) => {
  try {
    let whereClause = { user_id: req.user.id };
    
    // Admins also see notifications where user_id is null
    if (req.user.role === 'admin') {
      whereClause = {
        [Op.or]: [
          { user_id: req.user.id },
          { user_id: null }
        ]
      };
    }

    const notifications = await Notification.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    let whereClause = { user_id: req.user.id, is_read: false };
    
    if (req.user.role === 'admin') {
      whereClause = {
        [Op.or]: [
          { user_id: req.user.id },
          { user_id: null }
        ],
        is_read: false
      };
    }

    await Notification.update({ is_read: true }, { where: whereClause });
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notifications as read', error: error.message });
  }
};
