const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');


// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name price image stock'
      });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: 'Cart is empty',
        items: []
      });
    }

    // Filter out items with null products
    const validItems = cart.items.filter(item => item.product !== null);

    // Optional: Clean up invalid items in the database
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    res.json({
      success: true,
      items: validItems
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate input
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product or quantity'
      });
    }

    // Check product exists and is available
    const product = await Product.findOne({
      _id: productId,
      stock: { $gt: 0 } // Only allow adding available products
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not available'
      });
    }
    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available'
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: []
      });
    }

    // Check if product already in cart
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex >= 0) {
      // Update quantity if already in cart
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity
      });
    }

    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Product added to cart',
      cart
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});
// In your cartRoutes.js
router.delete('/item/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Basic validation
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid product ID' 
      });
    }

    // Find and update cart in one operation
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { items: { product: productId } } },
      { new: true }
    ).populate('items.product', 'name price image');

    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: 'Cart not found' 
      });
    }

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart
    });

  } catch (err) {
    console.error('DELETE cart item error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error removing item from cart'
    });
  }
});
// Add this as a separate route or scheduled task
router.post('/cleanup', auth, async (req, res) => {
  try {
    const carts = await Cart.find({});
    
    for (const cart of carts) {
      // Get all product IDs in cart
      const productIds = cart.items.map(item => item.product);
      
      // Find which products still exist
      const existingProducts = await Product.find({
        _id: { $in: productIds }
      });
      
      const existingProductIds = existingProducts.map(p => p._id.toString());
      
      // Filter out items with deleted products
      cart.items = cart.items.filter(item => 
        existingProductIds.includes(item.product.toString())
      );
      
      await cart.save();
    }
    
    res.json({ success: true, message: 'Cart cleanup completed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Cleanup failed' });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    res.json({
      success: true,
      message: 'Cart cleared successfully'
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
