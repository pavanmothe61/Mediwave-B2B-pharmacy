const MRVisit = require('../models/MRVisit');
const User = require('../models/User');

exports.createVisit = async (req, res) => {
  try {
    const { doctor_name, pharmacy_name, notes, status } = req.body;
    const visit = await MRVisit.create({
      owner_id: req.user.id,
      doctor_name,
      pharmacy_name,
      notes,
      status
    });
    res.status(201).json({ message: 'Visit logged successfully', visit });
  } catch (error) {
    res.status(500).json({ message: 'Error creating visit', error: error.message });
  }
};

exports.getVisits = async (req, res) => {
  try {
    const role = req.user.role;
    let visits;
    if (role === 'admin') {
      visits = await MRVisit.findAll({ include: [{ model: User, attributes: ['name', 'email'] }], order: [['createdAt', 'DESC']] });
    } else {
      visits = await MRVisit.findAll({ where: { owner_id: req.user.id }, order: [['createdAt', 'DESC']] });
    }
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching visits', error: error.message });
  }
};
