CREATE TABLE product_variants (
    id serial PRIMARY KEY,
    product_id integer NOT NULL references products(id),
    color_id integer NOT NULL references colors(id),
    size_id integer NOT NULL references sizes(id),
    storage_id integer NOT NULL references storages(id),
    price decimal NOT NULL
)