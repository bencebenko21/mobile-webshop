CREATE TYPE user_role AS ENUM ('customer', 'admin');

CREATE TABLE users (
id serial PRIMARY KEY,
first_name varchar (255) NOT NULL,
last_name varchar (255) NOT NULL,
email varchar (255) NOT NULL UNIQUE,
user_password varchar(255) NOT NULL,
phone_number varchar(255),
zip_code INTEGER,
city varchar(255),
street_name varchar(255),
floor_flat varchar(255),
assigned_role user_role NOT NULL DEFAULT 'customer',
created_at TIMESTAMP NOT NULL DEFAULT now()
);