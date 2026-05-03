const express = require('express');
const router = express.Router();
const cartService = require('../services/cartService');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const cart = await cartService.getCart(req.user.id);
        res.status(200).json(cart);
    } catch(err) {
        console.error(err);
        res.status(404).json({ error: 'Cart not found' });
    }
});

router.post('/items', authenticateToken, async (req, res) => {
    try {
        const { variantId, quantity } = req.body;
        const item = await cartService.addItemToCart(req.user.id, variantId, quantity);
        res.status(201).json(item);
    } catch(err) {
        console.error(err);
        if (err.message === 'Insufficient stock') {
            return res.status(400).json({ error: 'Insufficient stock' });
        }
        res.status(500).json({ error: 'Failed to add item' });
    }
});

router.put('/items/:itemId', authenticateToken, async (req, res) => {
    try {
        const { quantity } = req.body;
        const item = await cartService.updateItemQuantity(req.user.id, req.params.itemId, quantity);
        res.status(200).json(item);
    } catch(err) {
        console.error(err);
        if (err.message === 'Insufficient stock') {
            return res.status(400).json({ error: 'Insufficient stock' });
        }
        res.status(500).json({ error: 'Failed to update item' });
    }
});

router.delete('/items/:itemId', authenticateToken, async (req, res) => {
    try {
        await cartService.removeItemFromCart(req.user.id, req.params.itemId);
        res.status(204).send();
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to remove item' });
    }
});

module.exports = router;