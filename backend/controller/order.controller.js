const Order = require("../models/order.model");
const asyncHandler = require("express-async-handler");

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // Validate request body
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  if (
    !shippingAddress ||
    !paymentMethod ||
    itemsPrice === undefined ||
    taxPrice === undefined ||
    shippingPrice === undefined ||
    totalPrice === undefined
  ) {
    res.status(400);
    throw new Error("Missing required order fields");
  }

  // Validate order items structure
const invalidItems = orderItems.filter(
  (item) => !item.product || !item.qty || !item.price
);
  if (invalidItems.length > 0) {
    res.status(400);
    throw new Error("Invalid order items structure");
  }

  try {
    const order = new Order({
      orderItems: orderItems.map((item) => ({
        ...item,
        product: item.product, // Ensure proper ObjectID conversion if needed
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice: Number(itemsPrice),
      taxPrice: Number(taxPrice),
      shippingPrice: Number(shippingPrice),
      totalPrice: Number(totalPrice),
    });

    const createdOrder = await order.save();
    
    // Populate product details if needed
    await createdOrder.populate('orderItems.product', 'name price image');
    
    res.status(201).json({
      success: true,
      order: createdOrder,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500);
    throw new Error("Order creation failed. Please try again.");
  }
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name price image");

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // Verify order ownership (user can only access their own orders)
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error("Not authorized to access this order");
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Order retrieval error:', error);
    res.status(500);
    throw new Error("Failed to retrieve order");
  }
});

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
};