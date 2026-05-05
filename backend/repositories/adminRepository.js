const pool = require('../db');

async function getAllOrders() {
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
            users.first_name,
            users.last_name,
            users.email,
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'order_item_id', order_items.id,
                    'product_name', products.product_name,
                    'quantity', order_items.quantity,
                    'price_at_purchase', order_items.price_at_purchase
                )
            ) AS items
        FROM orders
        JOIN users ON orders.user_id = users.id
        JOIN order_items ON order_items.order_id = orders.id
        JOIN product_variants ON order_items.product_variant_id = product_variants.id
        JOIN products ON product_variants.product_id = products.id
        GROUP BY orders.id, users.first_name, users.last_name, users.email
    `;
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch(err) {
        console.error('Error fetching all orders:', err.stack);
        throw err;
    }
}

async function updateOrderStatus(orderId, status) {
    const query = `
        UPDATE orders SET current_status = $1
        WHERE id = $2
        RETURNING *
    `;
    try {
        const result = await pool.query(query, [status, orderId]);
        return result.rows[0];
    } catch(err) {
        console.error('Error updating order status:', err.stack);
        throw err;
    }
}

async function createProduct(productName, productDescription, lineId) {
    const query = `
        INSERT INTO products (product_name, product_description, line_id)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    try {
        const result = await pool.query(query, [productName, productDescription, lineId]);
        return result.rows[0];
    } catch(err) {
        console.error('Error creating product:', err.stack);
        throw err;
    }
}

async function updateProduct(productId, productName, productDescription, lineId) {
    const query = `
        UPDATE products 
        SET product_name = $1, product_description = $2, line_id = $3
        WHERE id = $4
        RETURNING *
    `;
    try {
        const result = await pool.query(query, [productName, productDescription, lineId, productId]);
        return result.rows[0];
    } catch(err) {
        console.error('Error updating product:', err.stack);
        throw err;
    }
}

async function deleteProduct(productId) {
    const query = `DELETE FROM products WHERE id = $1`;
    try {
        await pool.query(query, [productId]);
    } catch(err) {
        console.error('Error deleting product:', err.stack);
        throw err;
    }
}

async function updateStock(variantId, stock) {
    const query = `
        UPDATE inventory_stocks SET stock = $1
        WHERE product_variant_id = $2
        RETURNING *
    `;
    try {
        const result = await pool.query(query, [stock, variantId]);
        return result.rows[0];
    } catch(err) {
        console.error('Error updating stock:', err.stack);
        throw err;
    }
}

async function updateVariantPrice(variantId, price) {
    const query = `
        UPDATE product_variants SET price = $1
        WHERE id = $2
        RETURNING *
    `;
    try {
        const result = await pool.query(query, [price, variantId]);
        return result.rows[0];
    } catch(err) {
        console.error('Error updating variant price:', err.stack);
        throw err;
    }
}

module.exports = { getAllOrders, updateOrderStatus, createProduct, updateProduct, deleteProduct, updateStock, updateVariantPrice };