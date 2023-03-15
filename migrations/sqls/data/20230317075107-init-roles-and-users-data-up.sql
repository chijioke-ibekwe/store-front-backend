INSERT INTO roles (id, name, description) 
VALUES (1, 'role_admin', 'Role for admin users'), (2, 'role_customer', 'Role for customer users');

INSERT INTO users (id, first_name, last_name, username, password, phone_number, role_id, verified) 
VALUES (1, 'Chijioke', 'Ibekwe', 'ibekwekingsley18@gmail.com', '$2b$10$GFFD0rfflBGspQsBDAY4peMoVxkjvoUjhhfwZ1Z4xI7KrIEzz42Cy', 
'+2348011112222', 1, true);