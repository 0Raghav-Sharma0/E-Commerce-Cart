const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
// In your order routes file
router.post('/', auth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { 
      shippingAddress, 
      paymentMethod, 
      items, 
      itemsPrice, 
      taxPrice, 
      shippingPrice, 
      totalPrice 
    } = req.body;

    // Validate required fields
    if (!shippingAddress || !paymentMethod || !items || items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Missing required order fields'
      });
    }

    // Verify items with cart
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product')
      .session(session);

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'No items in cart'
      });
    }

    // Validate items and quantities
    const validatedItems = [];
    for (const item of items) {
      const cartItem = cart.items.find(ci => 
        ci.product._id.toString() === item.product
      );
      
      if (!cartItem) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Product ${item.product} not in cart`
        });
      }

      if (cartItem.product.stock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${cartItem.product.name}`,
          available: cartItem.product.stock
        });
      }

      validatedItems.push({
        product: item.product,
        name: cartItem.product.name,
        quantity: item.quantity,
        price: item.price,
        image: cartItem.product.image || ''
      });
    }

    // Create order
    const order = new Order({
      user: req.user.id,
      items: validatedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: false,
      paidAt: null,
      isDelivered: false,
      deliveredAt: null,
    });

    // Save order and update product stock
    await order.save({ session });
    
    const bulkOps = validatedItems.map(item => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: -item.quantity } }
      }
    }));
    await Product.bulkWrite(bulkOps, { session });

    // Clear cart
    await Cart.findByIdAndDelete(cart._id, { session });

    await session.commitTransaction();
    
    res.status(201).json({
      success: true,
      order: await Order.findById(order._id)
        .populate('user', 'name email')
        .populate('items.product', 'name image')
    });
  } catch (err) {
    await session.abortTransaction();
    console.error('Order creation error:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: err.message
    });
  } finally {
    session.endSession();
  }
});
// @route   GET /api/orders
// @desc    Get logged in user orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name image'
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name price image'
      })
      .populate({
        path: 'user',
        model: 'User',
        select: 'name email'
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify order belongs to user
    if (order.user._id.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @route   PUT /api/orders/:id/pay
// @desc    Update order to paid
// @access  Private
router.put('/:id/pay', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address
    };

    const updatedOrder = await order.save();

    res.json({
      success: true,
      order: updatedOrder
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

module.exports = router;
