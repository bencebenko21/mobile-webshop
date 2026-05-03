const express = require('express');
const router = express.Router();
const adminService = require('../services/adminService');
const { authenticateToken, requireAdmin } = require('../middlewares/authMiddleware');

router.get('/orders', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const orders = await adminService.getAllOrders();
        res.status(200).json(orders);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

router.put('/orders/:id/status', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await adminService.updateOrderStatus(req.params.id, status);
        res.status(200).json(order);
    } catch(err) {
        console.error(err);
        if (err.message === 'Invalid status') {
            return res.status(400).json({ error: 'Invalid status' });
        }
        if (err.message === 'Order not found') {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

router.post('/products', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { productName, productDescription, lineId } = req.body;
        const product = await adminService.createProduct(productName, productDescription, lineId);
        res.status(201).json(product);
    } catch(err) {
        console.error(err);
        if (err.message === 'Product name and line are required') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: 'Failed to create product' });
    }
});

router.put('/products/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { productName, productDescription, lineId } = req.body;
        const product = await adminService.updateProduct(req.params.id, productName, productDescription, lineId);
        res.status(200).json(product);
    } catch(err) {
        console.error(err);
        if (err.message === 'Product not found') {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(500).json({ error: 'Failed to update product' });
    }
});

router.delete('/products/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await adminService.deleteProduct(req.params.id);
        res.status(204).send();
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

router.put('/stock/:variantId', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { stock } = req.body;
        const result = await adminService.updateStock(req.params.variantId, stock);
        res.status(200).json(result);
    } catch(err) {
        console.error(err);
        if (err.message === 'Stock cannot be negative') {
            return res.status(400).json({ error: err.message });
        }
        if (err.message === 'Variant not found') {
            return res.status(404).json({ error: 'Variant not found' });
        }
        res.status(500).json({ error: 'Failed to update stock' });
    }
});

module.exports = router;