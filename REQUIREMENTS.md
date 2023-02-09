# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index `/products` [GET]
- Show `/products/<productId>` [GET]
- Create [token required] `/products` [POST]
```json
{
    "name": "IPhone 14",
    "price": 500000,
    "category": "TECHNOLOGY"
}
```
- [OPTIONAL] Top 5 most popular products `/products/most-popular` [GET]
- [OPTIONAL] Products by category (args: product category) `/products?category=<categoryName>` [GET] (category name can be 'TECHNOLOGY', 'CLOTHING', STATIONARY, FOOD_ITEM)

#### Users
- Index [token required] `/users` [GET]
- Show [token required] `/users/<userId>` [GET]
- Create N[token required] `/users` [POST]
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "username": "john.doe",
    "password": "password"
}
```
- Authenticate `/users/authenticate` [POST]
```json
{
    "username": "john.doe",
    "password": "password"
}
```

#### Orders
- Current Order by user (args: user id)[token required] `/orders/active` [GET]
- [OPTIONAL] Completed Orders by user (args: user id)[token required] `/orders/completed` [GET]

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

#### User
- id
- firstName
- lastName
- password

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

## Database Tables
- users (id:serial, first_name:varchar, last_name:varchar, username:varchar, password:varchar)
- orders (id:serial, status:varchar, user_id:integer[foreign key - references users table id])
- products (id:serial, name:varchar, price:numeric, category:varchar)
- orders_products (id:serial, quantity:integer, order_id:integer[foreign key - references orders table id], product_id:integer[foreign key - references products table id])