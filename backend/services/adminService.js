const adminRepository = require('../repositories/adminRepository');

async function getAllOrders() {
    try {
        return await adminRepository.getAllOrders();
    } catch(err) {
        console.error('Error in admin service - getAllOrders:', err);
        throw err;
    }
}

async function updateOrderStatus(orderId, status) {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
    }
    try {
        const order = await adminRepository.updateOrderStatus(orderId, status);
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    } catch(err) {
        console.error('Error in admin service - updateOrderStatus:', err);
        throw err;
    }
}

async function createProduct(productName, productDescription, lineId) {
    if (!productName || !lineId) {
        throw new Error('Product name and line are required');
    }
    try {
        return await adminRepository.createProduct(productName, productDescription, lineId);
    } catch(err) {
        console.error('Error in admin service - createProduct:', err);
        throw err;
    }
}

async function updateProduct(productId, productName, productDescription, lineId) {
    if (!productName || !lineId) {
        throw new Error('Product name and line are required');
    }
    try {
        const product = await adminRepository.updateProduct(productId, productName, productDescription, lineId);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    } catch(err) {
        console.error('Error in admin service - updateProduct:', err);
        throw err;
    }
}

async function deleteProduct(productId) {
    try {
        await adminRepository.deleteProduct(productId);
    } catch(err) {
        console.error('Error in admin service - deleteProduct:', err);
        throw err;
    }
}

async function updateStock(variantId, stock) {
    if (stock < 0) {
        throw new Error('Stock cannot be negative');
    }
    try {
        const result = await adminRepository.updateStock(variantId, stock);
        if (!result) {
            throw new Error('Variant not found');
        }
        return result;
    } catch(err) {
        console.error('Error in admin service - updateStock:', err);
        throw err;
    }
}

async function updateVariantPrice(variantId, price) {
    if (price < 0) {
        throw new Error('Price cannot be negative');
    }
    try {
        const result = await adminRepository.updateVariantPrice(variantId, price);
        if (!result) throw new Error('Variant not found');
        return result;
    } catch(err) {
        console.error('Error in admin service - updateVariantPrice:', err);
        throw err;
    }
}

module.exports = { getAllOrders, updateOrderStatus, createProduct, updateProduct, deleteProduct, updateStock, updateVariantPrice };