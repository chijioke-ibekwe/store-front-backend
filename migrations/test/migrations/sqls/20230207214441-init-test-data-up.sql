/* Replace with your SQL commands */
INSERT INTO users (first_name, last_name, username, password) VALUES ('John', 'Doe', 'john.doe@gmail.com', 
'$2b$10$ValaFNoiMPawmmWwxTGdy..MeYkBEKRvUXQFFYa0NF35z0dRyO8u2');

INSERT INTO orders (status, user_id) VALUES ('ACTIVE', 1);

INSERT INTO orders (status, user_id) VALUES ('COMPLETED', 1);

INSERT INTO products (name, price, category) VALUES ('Iphone 13', 400000.00, 'TECHNOLOGY');

INSERT INTO products (name, price, category) VALUES ('Gucci T-Shirt', 80000.00, 'CLOTHING');

INSERT INTO orders_products (quantity, order_id, product_id) VALUES (1, 1, 1);

INSERT INTO orders_products (quantity, order_id, product_id) VALUES (1, 1, 2);

INSERT INTO orders_products (quantity, order_id, product_id) VALUES (1, 2, 1);

INSERT INTO orders_products (quantity, order_id, product_id) VALUES (1, 2, 2);