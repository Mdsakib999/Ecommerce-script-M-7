const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');

// POST /api/orders
exports.createOrder = async (req, res) => {
  const { orderItems, shippingAddress = null, paymentMethod = 'None' } = req.body;
  const userEmail = req.user?.email || req.body.userEmail;

  // Basic validation
  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items provided' });
  }
  if (!userEmail) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  // Start MongoDB session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let totalPrice = 0;
    const processedItems = [];

    for (const item of orderItems) {
      // Fetch product with session
      const prod = await Product.findById(item.productId).session(session);
      if (!prod) {
        throw { status: 400, message: `Product not found: ${item.productId}` };
      }

      const qty = Number(item.qty) || 0;
      if (qty <= 0) throw { status: 400, message: `Invalid quantity for ${prod.name}` };
      if (prod.countInStock < qty) throw { status: 400, message: `Insufficient stock for ${prod.name}` };

      // Compute line total using server-side price
      totalPrice += prod.price * qty;

      // Prepare processed item for order
      processedItems.push({
        productId: prod._id,
        name: prod.name,
        qty,
        price: prod.price,
        imageUrl: prod.imageUrl,
      });

      // Decrement stock and Increment purchase count
      prod.countInStock -= qty;
      const oldPurchaseCount = prod.purchaseCount || 0;
      prod.purchaseCount = oldPurchaseCount + qty;
      await prod.save({ session });
    }

    // Create order
    const order = new Order({
      userEmail,
      orderItems: processedItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(createdOrder);
  } catch (error) {
    // Rollback transaction on error
    await session.abortTransaction();
    session.endSession();

    console.error('Order creation error:', error);

    return res.status(error.status || 500).json({
      message: error.message || 'Failed to create order',
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // ensure user can see only their own order (if not admin)
    if (req.user.email !== order.userEmail) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET /api/orders/my-orders - Get orders for logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const orders = await Order.find({ userEmail }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      if (order.isDelivered && status === 'Cancelled') {
        return res.status(400).json({ message: 'Cannot cancel a delivered order' });
      }

      order.status = status;
      if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      } else {
        order.isDelivered = false;
        order.deliveredAt = null;
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
//   try {
//     const order = await Order.findById(req.params.id);

//     if (order) {
//       order.isDelivered = true;
//       order.status = 'Delivered';
//       order.deliveredAt = Date.now();

//       const updatedOrder = await order.save();
//       res.json(updatedOrder);
//     } else {
//       res.status(404).json({ message: 'Order not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error' });
//   }
// };


