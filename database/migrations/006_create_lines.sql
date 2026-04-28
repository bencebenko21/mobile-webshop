CREATE TABLE lines (
    id serial PRIMARY KEY,
    line_name varchar(255) NOT NULL UNIQUE,
    make_id integer NOT NULL references makes(id)
)