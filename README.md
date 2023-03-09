# Store Front Backend
RESTful APIs for an e-commerce platform built using Node.js, Express and TypeScript.

## Getting Started
### Prerequisites
You need the following installed on your machine to run the application.  
NB: The outlined versions are the tested ones. Other versions could also work.
1. Node v18.12.1
2. Docker

### Key Dependencies
1. Express
2. BCrpyt
3. Body Parser
4. PG (Postgres)
5. DB Migrate
6. JSON Web Token
7. Dot Env

## How to Run
To build and run the application locally:
- Clone the repository using the following command:
```bash
git clone https://github.com/<your-git-username>/store-front-backend.git
```

- Install the dependencies using:
```bash
npm install
```

- Run the docker compose file to setup a postgres database in a container using. Database is set up to run on port 5430:
```bash
docker-compose up
```

- Connect to the default postgres database within the container environment using the command:
```bash
docker exec -it node-postgres psql -U postgres
```

- Within the postgres database, create the store-front and store-front-test databases for the application using;
```bash
CREATE DATABASE store-front;
CREATE DATABASE store-front-test;
```

- Run the `\q` to quit the postgres terminal and `CTRL D` to exit the container environment;

- Run the tests using the commands;  
(if on a windows)
```bash
npm run test
```
(if on a linux)
```bash
npm run test2
```

- Run the migration files using;
```bash
db-migrate up
```

- Transpile the typescript code and start up the server using the command. Application is set up to run on port 3000;
```bash
npm run watch
```
## API Documentation

The application contains the following endpoints:

1. `POST '/api/v1/users'`

- Registers a new user on the application.
- Body: A JSON containing the details of the user as shown below:

```json
{
    "firstName": "John",
    "lastName": "Doe",
    "username": "john.doe@gmail.com",
    "password": "password"
}
```
- Returns: A JSON of the registered user's details. 

```json
{
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "username": "john.doe@gmail.com",
    "password": "encrypted_password"
}
```

2. `POST '/api/v1/users/authenticate'`

- Authenticates a user on the application
- Body: A JSON of the user's username and password

```json
{
    "username": "john.doe@gmail.com",
    "password": "password"
}
```
- Returns: A JSON of the access token details. 

```json
{
    "access_token": "access_token",
}
```

3. `GET '/api/v1/users'`

- Fetches all the users on the app. This API is protected, and requires a valid bearer token in the authorization header of the request. 

```json
[
    {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "username": "john.doe@gmail.com",
        "password": "encrypted_password"
    }
]
```

4. `GET '/api/v1/users/<userId>'`

- Fetches a single user on the app using the user's id. This API is protected, and requires a valid bearer token in the authorization header of the request. 

```json
{
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "username": "john.doe@gmail.com",
    "password": "encrypted_password"
}
```

5. `POST '/api/v1/products'`

- Creates a product on the app. This API is protected, and requires a valid bearer token in the authorization header of the request.
- Body: A JSON of the product's details

```json
{
    "name": "IPhone 13 Pro Max",
    "price": 520000,
    "category": "TECHNOLOGY"
}
```
- Returns: A JSON of the created product. 

```json
{
    "id": 1,
    "name": "IPhone 13 Pro Max",
    "price": "520000.00",
    "category": "TECHNOLOGY"
}
```


6. `GET '/api/v1/products'`

- Fetches all the products on the app.

```json
[
    {
        "id": 1,
        "name": "IPhone 13 Pro Max",
        "price": "520000.00",
        "category": "TECHNOLOGY"
    }
]
```

7. `GET '/api/v1/products/<productId>'`

- Fetches a single product on the app by the id.

```json
{
    "id": 1,
    "name": "IPhone 13 Pro Max",
    "price": "520000.00",
    "category": "TECHNOLOGY"
}
```

8. `GET '/api/v1/orders/active'`

- Fetches a user's active order. This API is protected, and requires a valid bearer token in the authorization header of the request.

```json
{
    "id": 1,
    "status": "ACTIVE",
    "user_id": 1,
    "products": [
        {
            "id": 1,
            "quantity": 3
        }
    ]
}
```

9. `GET '/api/v1/orders/completed'`

- Fetches a user's completed orders. This API is protected, and requires a valid bearer token in the authorization header of the request.

```json
[
    {
        "id": 1,
        "status": "COMPLETED",
        "user_id": 1,
        "products": [
            {
                "id": 1,
                "quantity": 2
            }
        ]
    }
]
```

10. `POST '/api/v1/orders/<orderId>/products'`

- Adds a product to a user's active order. It takes the active order's id as a path variable. This API is protected, and requires a valid bearer token in the authorization header of the request.
- Body: A JSON of the product id and quantity.

```json
{
    "quantity": 3,
    "productId": 1
}
```
- Returns: A JSON of the active order. 

```json
{
    "id": 1,
    "status": "ACTIVE",
    "user_id": 1,
    "products": [
        {
            "id": 1,
            "quantity": 3
        }
    ]
}
```

## Author

- Chijioke Ibekwe (https://github.com/chijioke-ibekwe)