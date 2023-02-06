import { OrderStore, AddProductDTO } from '../../models/order';
import Client from '../../database';

const orderStore = new OrderStore();

describe('Order Model Tests', () => {
    beforeAll(() => {
        return Client.connect().then(conn => {
            const sql_one = "INSERT INTO products (id, name, price, category) VALUES (1, 'Dell Alienware Laptop', 1500000, 'TECHNOLOGY')";
            const sql_two = "INSERT INTO users (id, first_name, last_name, username, password) VALUES " + 
            "(1, 'John', 'Doe', 'john.doe@gmail.com', '$2b$10$ValaFNoiMPawmmWwxTGdy..MeYkBEKRvUXQFFYa0NF35z0dRyO8u2')";
            return conn.query(sql_one).then(() => {
                return conn.query(sql_two).then(() => {
                    conn.release();
                })
            });
        }).catch((error) => {
            throw new Error(`Cannot initialize product and user data for test: ${error}`);
        })
    })

    it('should return an active order to the user and creates one if none is available', () => {

        return orderStore.findMyActiveOrder(1).then(result => {
            expect(result.products).toEqual([]);
            expect(result.status).toEqual('ACTIVE');
            expect(result.user_id).toEqual(1);
        })
    })

    it('should get all completed orders on the database', () => {
        return orderStore.findMyCompletedOrders(1).then(result => {
            expect(result).toEqual([]);
        })
    })

    it('should add a product to an active order', () => {
        const dto: AddProductDTO= {
            quantity: 2,
            order_id: 1,
            product_id: 1
        }

        return orderStore.addProduct(1, dto).then(result => {
            expect(result.id).toEqual(1);
            expect(result.products).toEqual([{id: 1, quantity: 2}]);
            expect(result.status).toEqual('ACTIVE');
            expect(result.user_id).toEqual(1);
        });
    })

    afterAll(() => {
        return Client.connect().then(conn => {
            const sql_one = "DELETE FROM orders_products WHERE quantity = 2";
            const sql_two = "DELETE FROM orders WHERE status = 'ACTIVE'";
            const sql_three = "DELETE FROM products WHERE id = 1";
            const sql_four = "DELETE FROM users WHERE id = 1";
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