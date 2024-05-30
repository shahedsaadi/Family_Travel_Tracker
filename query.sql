-- 1:M cause one user who can visit many countries

CREATE TABLE users(
id SERIAL PRIMARY KEY,
name VARCHAR(15) UNIQUE NOT NULL,
color VARCHAR(15)
);

CREATE TABLE visited_countries(
id SERIAL PRIMARY KEY,
country_code CHAR(2) NOT NULL,
user_id INTEGER REFERENCES users(id)
);

INSERT INTO users (name, color)
VALUES ('Angela', 'teal'), ('Jack', 'powderblue');

INSERT INTO visited_countries (country_code, user_id)
VALUES ('FR', 1), ('GB', 1), ('CA', 2), ('FR', 2 );

SELECT *
FROM visited_countries
JOIN users
ON users.id = user_id;

-----------------------

CREATE TABLE countries(
id SERIAL PRIMARY KEY,
country_code CHAR(2),
country_name VARCHAR(100)
);

-- after creating "countries" table, to insert data to it =>import the data from "countries.csv"file that contains countries (name,code)