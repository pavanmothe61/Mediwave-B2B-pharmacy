const { sequelize } = require('./config/database');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');

async function clearOrders() {
  try {
    await sequelize.sync();
    
    // We destroy items first to respect foreign key constraints
    const itemsDeleted = await OrderItem.destroy({ where: {} });
    const ordersDeleted = await Order.destroy({ where: {} });
    
    console.log(`Successfully cleared ${ordersDeleted} orders and ${itemsDeleted} items.`);
    console.log('Your Admin Dashboard is now completely fresh!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to clear orders:', error);
    process.exit(1);
  }
}

clearOrders();
