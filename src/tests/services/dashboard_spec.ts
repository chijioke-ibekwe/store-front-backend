import { DashboardQueries } from '../../services/dashboard';
import Client from '../../database';

const dashboard = new DashboardQueries();

describe('Dashboard Services Test', () => {
    beforeAll(() => {
        return Client.connect().then(conn => {
            const sql_one = "INSERT INTO products (id, name, price, category) VALUES (3, 'Dell Alienware Laptop', 1500000, 'TECHNOLOGY')";
            const sql_two = "INSERT INTO users (id, first_name, last_name, username, password) VALUES " + 
            "(3, 'John', 'Doe', 'john.doe@gmail.com', '$2b$10$ValaFNoiMPawmmWwxTGdy..MeYkBEKRvUXQFFYa0NF35z0dRyO8u2')";
            const sql_three = "INSERT INTO orders (id, status, user_id) VALUES (3, 'ACTIVE', 3)";
            const sql_four = "INSERT INTO orders_products (id, quantity, order_id, product_id) VALUES (3, 2, 3, 3)";
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

        return dashboard.topFiveMostPopularProducts().then(result => {
            expect(result.length).toEqual(1);
            expect(result[0].name).toEqual('Dell Alienware Laptop');
        })
    })

    afterAll(() => {
        return Client.connect().then(conn => {
            const sql_one = "DELETE FROM orders_products WHERE id = 3";
            const sql_two = "DELETE FROM orders WHERE id = 3";
            const sql_three = "DELETE FROM products WHERE id = 3";
            const sql_four = "DELETE FROM users WHERE id = 3";
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