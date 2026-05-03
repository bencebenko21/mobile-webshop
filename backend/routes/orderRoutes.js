const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { deliveryZipCode, deliveryCity, deliveryStreetName, deliveryFloorFlat } = req.body;
        const order = await orderService.placeOrder(
            req.user.id,
            deliveryZipCode,
            deliveryCity,
            deliveryStreetName,
            deliveryFloorFlat
        );
        res.status(201).json(order);
    } catch(err) {
        console.error(err);
        if (err.message === 'Cart is empty') {
            return res.status(400).json({ error: 'Cart is empty' });
        }
        res.status(500).json({ error: 'Failed to place order' });
    }
});

router.get('/', authenticateToken, async (req, res) => {
    try {
        const orders = await orderService.getOrders(req.user.id);
        res.status(200).json(orders);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

module.exports = router;