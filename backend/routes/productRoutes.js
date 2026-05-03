const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

router.get('/', async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).json(product);
    } catch(err) {
        console.error(err);
        res.status(404).json({ error: 'Product not found' });
    }
});

module.exports = router;