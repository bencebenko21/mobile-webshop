CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    product_name varchar(255) NOT NULL UNIQUE,
    product_description TEXT,
    line_id integer NOT NULL references lines(id)
)