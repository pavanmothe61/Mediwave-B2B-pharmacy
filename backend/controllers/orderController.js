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

    const order = await Order.create({ user_id, total_amount, delivery_address, customer_name });

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
    const { status, distributor_location } = req.body;
    
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    if (distributor_location) order.distributor_location = distributor_location;
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
