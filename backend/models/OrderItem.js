const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Order = require('./Order');
const Medicine = require('./Medicine');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price_at_time: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
});

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Medicine.hasMany(OrderItem, { foreignKey: 'medicine_id' });
OrderItem.belongsTo(Medicine, { foreignKey: 'medicine_id' });

module.exports = OrderItem;
