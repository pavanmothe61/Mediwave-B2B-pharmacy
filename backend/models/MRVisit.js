const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const MRVisit = sequelize.define('MRVisit', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  owner_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  doctor_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pharmacy_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending Follow-up'
  }
});

User.hasMany(MRVisit, { foreignKey: 'owner_id' });
MRVisit.belongsTo(User, { foreignKey: 'owner_id' });

module.exports = MRVisit;
