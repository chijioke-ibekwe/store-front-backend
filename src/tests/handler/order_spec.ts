// import supertest from 'supertest';
// import Client from '../../database';
// import app from '../../server';

// const request = supertest(app);
// const {TEST_TOKEN} = process.env;
// const token = String(TEST_TOKEN);

// describe('Order Endpoint Tests', () => {
//     let active_order_id: number;

//     beforeAll(() => {
//         return Client.connect().then(conn => {
//             const sql_one = "INSERT INTO products (id, name, price, category) VALUES (15, 'Dell Alienware Laptop', 1500000, 'TECHNOLOGY')";
//             const sql_two = "INSERT INTO users (id, first_name, last_name, username, password) VALUES " + 
//             "(15, 'John', 'Doe', 'john.doe@gmail.com', '$2b$10$ValaFNoiMPawmmWwxTGdy..MeYkBEKRvUXQFFYa0NF35z0dRyO8u2')";
//             return conn.query(sql_one).then(() => {
//                 return conn.query(sql_two).then(() => {
//                     conn.release();
//                 })
//             });
//         }).catch((error) => {
//             throw new Error(`Cannot initialize product and user data for test: ${error}`);
//         })
//     })

//     it('should return an active order to the user', () => {
//         return request.get('/orders/active').set('authorization', token).then(response => {
//             expect(response.status).toBe(200);
//             expect(response.body.user_id).toEqual(15);

//             active_order_id = response.body.id;
//         });
//     });

//     it('should return all completed orders', () => {
//         return request.get('/orders/completed').set('authorization', token).then(response => {
//             expect(response.status).toBe(200);
//             expect(response.body).toEqual([]);
//         });
//     });

//     it('should return a 401 response since /orders/:orderId/products endpoint requires an access token', () => {
//         return request.post(' /orders/:orderId/products')
//         .send({quantity: 2, order_id: active_order_id, product_id: 15}).set('authorization', token).then(response => {
//             expect(response.status).toBe(401);
//             expect(response.body.message).toEqual(
//                 'You are not authorised to perform this operation'
//             );
//         });

//     });

//     afterAll(() => {
//         return Client.connect().then(conn => {
//             const sql_one = "DELETE FROM orders_products WHERE quantity = 2";
//             const sql_two = "DELETE FROM orders WHERE status = 'ACTIVE'";
//             const sql_three = "DELETE FROM products WHERE id = 1";
//             const sql_four = "DELETE FROM users WHERE id = 1";
//             return conn.query(sql_one).then(() => {
//                 return conn.query(sql_two).then(() => {
//                     return conn.query(sql_three).then(() => {
//                         return conn.query(sql_four).then(() => {
//                             conn.release();
//                         })
//                     });
//                 })
//             });
//         }).catch((error) => {
//             throw new Error(`Cannot delete test data: ${error}`);
//         })
//     })
// })