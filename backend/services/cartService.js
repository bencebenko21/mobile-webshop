const cartRepository = require('../repositories/cartRepository');
const pool = require('../db');

async function getCart(userId) {
    try {
        const cart = await cartRepository.getCartByUserId(userId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        return cart;
    } catch(err) {
        console.error('Error getting cart:', err);
        throw err;
    }
}

async function addItemToCart(userId, variantId, quantity) {
    try {
        const cart = await cartRepository.getCartByUserId(userId);
        if (!cart) {
            throw new Error('Cart not found');
        }

        const existingItem = await cartRepository.getCartItemByVariantId(cart.id, variantId);

        const stockResult = await pool.query(
            'SELECT stock FROM inventory_stocks WHERE product_variant_id = $1',
            [variantId]
        );
        const stockRow = stockResult.rows[0];
        const existingQuantity = existingItem ? existingItem.quantity : 0;
        if (!stockRow || stockRow.stock < existingQuantity + quantity) {
            throw new Error('Insufficient stock');
        }

        if (existingItem) {
            return await cartRepository.updateCartItemQuantity(existingItem.id, existingItem.quantity + quantity);
        }

        return await cartRepository.addCartItem(cart.id, variantId, quantity);
    } catch(err) {
        console.error('Error adding item to cart:', err);
        throw err;
    }
}

async function updateItemQuantity(userId, cartItemId, quantity) {
    try {
        const cart = await cartRepository.getCartByUserId(userId);
        if (!cart) {
            throw new Error('Cart not found');
        }

        const stockResult = await pool.query(
            `SELECT inventory_stocks.stock FROM inventory_stocks
             JOIN cart_items ON cart_items.product_variant_id = inventory_stocks.product_variant_id
             WHERE cart_items.id = $1`,
            [cartItemId]
        );
        const stockRow = stockResult.rows[0];
        if (!stockRow || stockRow.stock < quantity) {
            throw new Error('Insufficient stock');
        }

        return await cartRepository.updateCartItemQuantity(cartItemId, quantity);
    } catch(err) {
        console.error('Error updating cart item:', err);
        throw err;
    }
}

async function removeItemFromCart(userId, cartItemId) {
    try {
        const cart = await cartRepository.getCartByUserId(userId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        await cartRepository.removeCartItem(cartItemId);
    } catch(err) {
        console.error('Error removing cart item:', err);
        throw err;
    }
}

module.exports = { getCart, addItemToCart, updateItemQuantity, removeItemFromCart };