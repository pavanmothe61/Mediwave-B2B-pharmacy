const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Medicine = require('../models/Medicine');
const Notification = require('../models/Notification');

exports.createOrder = async (req, res) => {
  try {
    const { items, delivery_address, customer_name } = req.body;
    const user_id = req.user.id;

    let total_amount = 0;
    const orderItems = [];

    // Verify stock and calculate total
    for (const item of items) {
      const medicine = await Medicine.findByPk(item.medicine_id);
      if (!medicine) return res.status(404).json({ message: `Medicine ${item.medicine_id} not found` });
      
      if (medicine.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${medicine.name}` });
      }

      total_amount += medicine.price * item.quantity;
      orderItems.push({
        medicine_id: item.medicine_id,
        quantity: item.quantity,
        price_at_time: medicine.price
      });
    }

    const order = await Order.create({ 
      user_id: req.user.id, 
      total_amount: total_amount, 
      delivery_address, 
      customer_name,
      action_history: [{
        action: 'Order Placed',
        user: 'Pharmacy',
        timestamp: new Date().toISOString()
      }]
    });

    for (const item of orderItems) {
      await OrderItem.create({ ...item, order_id: order.id });
      // update stock
      await Medicine.decrement('stock', { by: item.quantity, where: { id: item.medicine_id } });
    }

    // Generate Automated Confirmation for Pharmacy
    await Notification.create({
      user_id: req.user.id,
      message: `Confirmation: Your order #${order.id} for ${items.length} items has been successfully placed.`,
      type: 'Confirmation'
    });

    // Generate Automated Reminder for Admins
    await Notification.create({
      user_id: null,
      message: `New Order Reminder: Order #${order.id} received from ${customer_name}.`,
      type: 'Reminder'
    });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const role = req.user.role;
    let orders;
    
    if (role === 'admin') {
      orders = await Order.findAll({ include: [OrderItem], order: [['createdAt', 'DESC']] });
    } else {
      orders = await Order.findAll({ where: { user_id: req.user.id }, include: [OrderItem], order: [['createdAt', 'DESC']] });
    }
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, distributor_location, priority } = req.body;
    
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    let history = order.action_history || [];

    if (status && status !== order.status) {
      history.push({ action: `Status updated to ${status}`, user: 'Internal Team', timestamp: new Date().toISOString() });
      order.status = status;
    }

    if (priority && priority !== order.priority) {
      history.push({ action: `Priority updated to ${priority}`, user: 'Internal Team', timestamp: new Date().toISOString() });
      order.priority = priority;
    }

    if (distributor_location) {
      if (distributor_location !== order.distributor_location) {
        history.push({ action: `Location updated to ${distributor_location}`, user: 'Internal Team', timestamp: new Date().toISOString() });
      }
      order.distributor_location = distributor_location;
    }

    order.action_history = history;
    order.changed('action_history', true); // Ensure JSON updates are saved
    await order.save();

    // Generate Automated Follow-up for Pharmacy
    await Notification.create({
      user_id: order.user_id,
      message: `Follow-up: The status of your order #${order.id} has been updated to "${status}".`,
      type: 'Follow-up'
    });
    
    res.json({ message: 'Order updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};
