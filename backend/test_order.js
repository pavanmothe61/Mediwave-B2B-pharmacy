const { sequelize } = require('./config/database');
const Order = require('./models/Order');
const Notification = require('./models/Notification');
const User = require('./models/User');

async function test() {
  try {
    await sequelize.authenticate();
    console.log('Connected to db');
    const user = await User.findOne();
    if (!user) {
      console.log('No user found');
      return;
    }

    console.log('User ID:', user.id);

    const order = await Order.create({
      user_id: user.id,
      total_amount: 50.00,
      delivery_address: '123 Test',
      customer_name: 'Test Customer',
      action_history: [{
        action: 'Order Placed',
        user: 'Pharmacy',
        timestamp: new Date().toISOString()
      }]
    });
    console.log('Order created:', order.id);

    await Notification.create({
      user_id: user.id,
      message: 'Test notification',
      type: 'Confirmation'
    });
    console.log('Notification 1 created');

    await Notification.create({
      user_id: null,
      message: 'Admin notification',
      type: 'Reminder'
    });
    console.log('Notification 2 created');

  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    process.exit(0);
  }
}

test();
