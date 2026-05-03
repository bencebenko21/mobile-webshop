const pool = require('../db');

async function getAllProducts() {
    const query = `
        SELECT 
    products.id,
    products.product_name,
    lines.line_name,
    makes.brand,
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'variant_id', product_variants.id,
            'price', product_variants.price,
            'color', colors.color_name,
            'size', sizes.screen_sizes,
            'storage', storages.storage_options,
            'stock', inventory_stocks.stock
        )
    ) AS variants
FROM products
JOIN lines ON products.line_id = lines.id
JOIN makes ON lines.make_id = makes.id
JOIN product_variants ON product_variants.product_id = products.id
JOIN colors ON product_variants.color_id = colors.id
JOIN sizes ON product_variants.size_id = sizes.id
JOIN storages ON product_variants.storage_id = storages.id
JOIN inventory_stocks ON inventory_stocks.product_variant_id = product_variants.id
GROUP BY products.id, lines.line_name, makes.brand
    `;
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch(err) {
        console.error('Error fetching products:', err.stack);
        throw err;
    }
}

async function getProductById(id) {
    const query = `
        SELECT 
            products.id,
            products.product_name,
            products.product_description,
            lines.line_name,
            makes.brand,
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'variant_id', product_variants.id,
                    'price', product_variants.price,
                    'color', colors.color_name,
                    'size', sizes.screen_sizes,
                    'storage', storages.storage_options,
                    'stock', inventory_stocks.stock
                )
            ) AS variants
        FROM products
        JOIN lines ON products.line_id = lines.id
        JOIN makes ON lines.make_id = makes.id
        JOIN product_variants ON product_variants.product_id = products.id
        JOIN colors ON product_variants.color_id = colors.id
        JOIN sizes ON product_variants.size_id = sizes.id
        JOIN storages ON product_variants.storage_id = storages.id
        JOIN inventory_stocks ON inventory_stocks.product_variant_id = product_variants.id
        WHERE products.id = $1
        GROUP BY products.id, lines.line_name, makes.brand
    `;
    try {
        const result = await pool.query(query, [id]);
        return result.rows[0];
    } catch(err) {
        console.error('Error fetching product:', err.stack);
        throw err;
    }
}

module.exports = { getAllProducts, getProductById };