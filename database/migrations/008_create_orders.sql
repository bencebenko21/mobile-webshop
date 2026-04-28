CREATE TYPE order_status AS ENUM ('pending','processing','shipped','delivered','cancelled');

CREATE TABLE orders (
    id serial PRIMARY KEY,
    order_number integer NOT NULL,
    user_id integer NOT NULL references users(id),
    current_status order_status NOT NULL DEFAULT 'pending',
    delivery_zip_code INTEGER NOT NULL,
    delivery_city varchar(255) NOT NULL,
    delivery_street_name varchar(255) NOT NULL,
    delivery_floor_flat varchar(255),
    order_date TIMESTAMP NOT NULL
)