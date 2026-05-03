const productRepository = require('../repositories/productRepository');

async function getAllProducts() {
    try {
        const products = await productRepository.getAllProducts();
        return products;
    } catch(err) {
        console.error('Error in product service:', err);
        throw err;
    }
}

async function getProductById(id) {
    try {
        const product = await productRepository.getProductById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    } catch(err) {
        console.error('Error in product service:', err);
        throw err;
    }
}

module.exports = { getAllProducts, getProductById};