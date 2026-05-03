const orderRepository = require('../repositories/orderRepository');
const cartRepository = require('../repositories/cartRepository');
const pool = require('../db');

async function placeOrder(userId, deliveryZipCode, deliveryCity, deliveryStreetName, deliveryFloorFlat) {
    try {
        const cart = await cartRepository.getCartByUserId(userId);
        if (!cart || !cart.items || cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        await pool.query('BEGIN');

        const order = await orderRepository.createOrder(userId, deliveryZipCode, deliveryCity, deliveryStreetName, deliveryFloorFlat);

        for (const item of cart.items) {
            await orderRepository.createOrderItem(order.id, item.variant_id, item.quantity, item.price);
            await orderRepository.decreaseStock(item.variant_id, item.quantity);
        }

        await orderRepository.clearCart(cart.id);
        await pool.query('COMMIT');

        return order;
    } catch(err) {
        await pool.query('ROLLBACK');
        console.error('Error placing order:', err);
        throw err;
    }
}

async function getOrders(userId) {
    try {
        const orders = await orderRepository.getOrdersByUserId(userId);
        return orders;
    } catch(err) {
        console.error('Error fetching orders:', err);
        throw err;
    }
}

module.exports = { placeOrder, getOrders };