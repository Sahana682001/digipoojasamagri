// routes/orderRoutes.js
const express = require('express')
const { addOrderItems, getOrderById, getMyOrders } = require('../controller/order.controller')
const { verifyUser } = require('../middleware/middleware')
const router = express.Router()

// router.route('/').post([verifyUser], addOrderItems)
// router.route('/:id').get([verifyUser], getOrderById)
router.route('/').post([verifyUser], addOrderItems); // Handles POST /api/orders
router.route('/:id').get([verifyUser], getOrderById); // Handles GET /api/orders/:id
router.route('/').get([verifyUser], getMyOrders);
module.exports = router