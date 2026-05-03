const pool = require('../db');

async function getCartByUserId(userId) {
    const query = `
        SELECT carts.id, 
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'cart_item_id', cart_items.id,
                    'variant_id', cart_items.product_variant_id,
                    'quantity', cart_items.quantity,
                    'price', product_variants.price,
                    'product_name', products.product_name,
                    'color', colors.color_name,
                    'size', sizes.screen_sizes,
                    'storage', storages.storage_options
                )
            ) FILTER (WHERE cart_items.id IS NOT NULL) AS items
        FROM carts
        LEFT JOIN cart_items ON cart_items.cart_id = carts.id
        LEFT JOIN product_variants ON cart_items.product_variant_id = product_variants.id
        LEFT JOIN products ON product_variants.product_id = products.id
        LEFT JOIN colors ON product_variants.color_id = colors.id
        LEFT JOIN sizes ON product_variants.size_id = sizes.id
        LEFT JOIN storages ON product_variants.storage_id = storages.id
        WHERE carts.user_id = $1
        GROUP BY carts.id
    `;
    try {
        const result = await pool.query(query, [userId]);
        return result.rows[0];
    } catch(err) {
        console.error('Error fetching cart:', err.stack);
        throw err;
    }
}

async function getCartItemByVariantId(cartId, variantId) {
    const query = `
        SELECT * FROM cart_items 
        WHERE cart_id = $1 AND product_variant_id = $2
    `;
    try {
        const result = await pool.query(query, [cartId, variantId]);
        return result.rows[0];
    } catch(err) {
        console.error('Error fetching cart item:', err.stack);
        throw err;
    }
}

async function addCartItem(cartId, variantId, quantity) {
    const query = `
        INSERT INTO cart_items (cart_id, product_variant_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    try {
        const result = await pool.query(query, [cartId, variantId, quantity]);
        return result.rows[0];
    } catch(err) {
        console.error('Error adding cart item:', err.stack);
        throw err;
    }
}

async function updateCartItemQuantity(cartItemId, quantity) {
    const query = `
        UPDATE cart_items SET quantity = $1
        WHERE id = $2
        RETURNING *
    `;
    try {
        const result = await pool.query(query, [quantity, cartItemId]);
        return result.rows[0];
    } catch(err) {
        console.error('Error updating cart item:', err.stack);
        throw err;
    }
}

async function removeCartItem(cartItemId) {
    const query = `DELETE FROM cart_items WHERE id = $1`;
    try {
        await pool.query(query, [cartItemId]);
    } catch(err) {
        console.error('Error removing cart item:', err.stack);
        throw err;
    }
}

async function createCart(userId) {
    const query = `
        INSERT INTO carts (user_id)
        VALUES ($1)
        RETURNING *
    `;
    try {
        const result = await pool.query(query, [userId]);
        return result.rows[0];
    } catch(err) {
        console.error('Error creating cart:', err.stack);
        throw err;
    }
}

module.exports = { 
    getCartByUserId, 
    getCartItemByVariantId, 
    addCartItem, 
    updateCartItemQuantity, 
    removeCartItem,
    createCart 
};