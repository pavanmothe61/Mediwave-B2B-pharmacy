const Medicine = require('../models/Medicine');
const { Op } = require('sequelize');

exports.getMedicines = async (req, res) => {
  try {
    const { search } = req.query;
    let whereClause = {};
    
    if (search) {
      whereClause = {
        name: {
          [Op.like]: `%${search}%`
        }
      };
    }

    const medicines = await Medicine.findAll({ where: whereClause });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medicines', error: error.message });
  }
};

exports.createMedicine = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const medicine = await Medicine.create({ name, description, price, stock, category });
    res.status(201).json({ message: 'Medicine added successfully', medicine });
  } catch (error) {
    res.status(500).json({ message: 'Error adding medicine', error: error.message });
  }
};

exports.updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;
    
    const medicine = await Medicine.findByPk(id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    if (name) medicine.name = name;
    if (description) medicine.description = description;
    if (price !== undefined && price !== null) medicine.price = price;
    if (stock !== undefined && stock !== null) medicine.stock = stock;
    if (category) medicine.category = category;
    
    await medicine.save();
    res.json({ message: 'Medicine updated successfully', medicine });
  } catch (error) {
    res.status(500).json({ message: 'Error updating medicine', error: error.message });
  }
};
