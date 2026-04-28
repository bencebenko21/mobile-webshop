CREATE TABLE cart_items(
    id serial PRIMARY KEY,
    cart_id integer NOT NULL references carts(id),
    product_variant_id integer NOT NULL references product_variants(id),
    quantity integer NOT NULL CHECK (quantity > 0)
)