CREATE TABLE carts (
    id serial PRIMARY KEY,
    user_id integer NOT NULL references users(id),
    last_changed TIMESTAMP
)