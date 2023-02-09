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

## Author

- Chijioke Ibekwe (https://github.com/chijioke-ibekwe)