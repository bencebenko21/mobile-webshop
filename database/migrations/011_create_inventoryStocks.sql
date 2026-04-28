CREATE TABLE inventory_stocks(
    id serial PRIMARY KEY,
    product_variant_id integer NOT NULL references product_variants(id),
    stock integer NOT NULL CHECK (stock >= 0),
    shipment_date TIMESTAMP
)