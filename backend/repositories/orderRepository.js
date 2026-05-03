const pool = require('../db');

async function createOrder(userId, deliveryZipCode, deliveryCity, deliveryStreetName, deliveryFloorFlat) {
    const query = `
        INSERT INTO orders (order_number, user_id, delivery_zip_code, delivery_city, delivery_street_name, delivery_floor_flat, order_date)
        VALUES ((SELECT COALESCE(MAX(order_number), 0) + 1 FROM orders), $1, $2, $3, $4, $5, now())
        RETURNING *
    `;
    try {
        const result = await pool.query(query, [userId, deliveryZipCode, deliveryCity, deliveryStreetName, deliveryFloorFlat]);
        return result.rows[0];
    } catch(err) {
        console.error('Error creating order:', err.stack);
        throw err;
    }
}

async function createOrderItem(orderId, variantId, quantity, priceAtPurchase) {
    const query = `
        INSERT INTO order_items (order_id, product_variant_id, quantity, price_at_purchase)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    try {
        const result = await pool.query(query, [orderId, variantId, quantity, priceAtPurchase]);
        return result.rows[0];
    } catch(err) {
        console.error('Error creating order item:', err.stack);
        throw err;
    }
}

async function decreaseStock(variantId, quantity) {
    const query = `
        UPDATE inventory_stocks 
        SET stock = stock - $1
        WHERE product_variant_id = $2
        RETURNING *
    `;
    try {
        const result = await pool.query(query, [quantity, variantId]);
        return result.rows[0];
    } catch(err) {
        console.error('Error decreasing stock:', err.stack);
        throw err;
    }
}

async function clearCart(cartId) {
    const query = `DELETE FROM cart_items WHERE cart_id = $1`;
    try {
        await pool.query(query, [cartId]);
    } catch(err) {
        console.error('Error clearing cart:', err.stack);
        throw err;
    }
}

async function getOrdersByUserId(userId) {
    const query = `
        SELECT 
            orders.id,
            orders.order_number,
            orders.current_status,
            orders.order_date,
            orders.delivery_zip_code,
            orders.delivery_city,
            orders.delivery_street_name,
            orders.delivery_floor_flat,
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'order_item_id', order_items.id,
                    'product_name', products.product_name,
                    'variant_id', order_items.product_variant_id,
                    'quantity', order_items.quantity,
                    'price_at_purchase', order_items.price_at_purchase
                )
            ) AS items
        FROM orders
        JOIN order_items ON order_items.order_id = orders.id
        JOIN product_variants ON order_items.product_variant_id = product_variants.id
        JOIN products ON product_variants.product_id = products.id
        WHERE orders.user_id = $1
        GROUP BY orders.id
    `;
    try {
        const result = await pool.query(query, [userId]);
        return result.rows;
    } catch(err) {
        console.error('Error fetching orders:', err.stack);
        throw err;
    }
}

module.exports = { createOrder, createOrderItem, decreaseStock, clearCart, getOrdersByUserId };