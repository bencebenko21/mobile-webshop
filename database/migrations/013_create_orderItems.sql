CREATE TABLE order_items(
    id serial PRIMARY KEY,
    order_id integer NOT NULL references orders(id),
    product_variant_id integer NOT NULL references product_variants(id),
    quantity integer NOT NULL CHECK (quantity > 0),
    price_at_purchase decimal NOT NULL
)