import supertest from 'supertest';
import Client from '../../database';
import app from '../../server';

const request = supertest(app);

describe('Dashboard Endpoint Test', () => {
    beforeAll(() => {
        return Client.connect().then(conn => {
            const sql_one = "INSERT INTO products (id, name, price, category) VALUES (20, 'Dell Alienware Laptop', 1500000, 'TECHNOLOGY')";
            const sql_two = "INSERT INTO users (id, first_name, last_name, username, password) VALUES " + 
            "(20, 'John', 'Doe', 'john.doe@gmail.com', '$2b$10$ValaFNoiMPawmmWwxTGdy..MeYkBEKRvUXQFFYa0NF35z0dRyO8u2')";
            const sql_three = "INSERT INTO orders (id, status, user_id) VALUES (20, 'ACTIVE', 20)";
            const sql_four = "INSERT INTO orders_products (id, quantity, order_id, product_id) VALUES (20, 2, 20, 20)";
            return conn.query(sql_one).then(() => {
                return conn.query(sql_two).then(() => {
                   return conn.query(sql_three).then(() => {
                        return conn.query(sql_four).then(() => {
                            conn.release();
                        })
                   })
                })
            });
        }).catch((error) => {
            throw new Error(`Cannot initialize product, order and user data for test: ${error}`);
        })
    })

    it('should return a maximum of 5 most popular products on the app', () => {

        return request.get('/api/v1/products/most-popular').then(response => {
            expect(response.status).toBe(200);
            expect(response.body[0].id).toEqual(20);
        });
    })

    afterAll(() => {
        return Client.connect().then(conn => {
            const sql_one = "DELETE FROM orders_products WHERE id = 20";
            const sql_two = "DELETE FROM orders WHERE id = 20";
            const sql_three = "DELETE FROM products WHERE id = 20";
            const sql_four = "DELETE FROM users WHERE id = 20";
            return conn.query(sql_one).then(() => {
                return conn.query(sql_two).then(() => {
                    return conn.query(sql_three).then(() => {
                        return conn.query(sql_four).then(() => {
                            conn.release();
                        })
                    });
                })
            });
        }).catch((error) => {
            throw new Error(`Cannot delete test data: ${error}`);
        })
    })
})