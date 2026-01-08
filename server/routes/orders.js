const express = require('express');
const { createOrder, getOrderById, getAllOrders, updateToDelivered, updateOrderStatus } = require('../controllers/orderController');
const router = express.Router();
const verifyFirebaseToken = require('../middleware/AuthMiddleware');
const isAdmin = require('../middleware/isAdmin');

router.post('/', verifyFirebaseToken, createOrder); //protected
router.get('/', verifyFirebaseToken, isAdmin, getAllOrders); // Admin only

router.put('/:id/status',verifyFirebaseToken, isAdmin, updateOrderStatus); // Admin only
// router.put('/:id/deliver', verifyFirebaseToken, isAdmin, updateToDelivered); // Admin only
router.get('/:id', verifyFirebaseToken, getOrderById);
module.exports = router;