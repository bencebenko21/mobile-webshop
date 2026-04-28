CREATE TABLE storages (
    id serial PRIMARY KEY,
    storage_options varchar(255) NOT NULL UNIQUE
)