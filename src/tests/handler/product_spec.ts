import supertest from 'supertest';
import Client from '../../database';
import app from '../../server';

const request = supertest(app);

describe('Product Endpoint Tests', () => {

    beforeAll(() => {
        return Client.connect().then(conn => {
            const sql = "INSERT INTO products (id, name, price, category) VALUES (7, 'Gucci T-Shirt', 80000, 'CLOTHING')";
            return conn.query(sql).then(() => {
                conn.release();
            });
        }).catch((error) => {
            throw new Error(`Cannot add product test data: ${error}`);
        })
    })

    it('should return all products in json', () => {
        return request.get('/products').then(response => {
            expect(response.status).toBe(200);
            expect(response.body.length).toEqual(1);
            expect(response.headers['content-type']).toEqual('application/json; charset=utf-8');
        });
    });

    it('should return a single product in json', () => {
        return request.get('/products/7').then(response => {
            expect(response.status).toBe(200);
            expect(response.body.name).toEqual('Gucci T-Shirt');
            expect(response.headers['content-type']).toEqual('application/json; charset=utf-8');
        });
    });

    it('should return a 401 response since /products post endpoint requires an access token', () => {
        return request.post('/products')
        .send({name: 'Airpods', price: 120000, category: 'TECHNOLOGY'}).then(response => {
            expect(response.status).toBe(401);
            expect(response.body.message).toEqual(
                'You are not authorised to perform this operation'
            );
        });

    });

    afterAll(() => {
        return Client.connect().then(conn => {
            const sql = "DELETE FROM products WHERE id = 7";
            return conn.query(sql).then(() => {
                conn.release();
            });
        }).catch((error) => {
            throw new Error(`Cannot delete product test data: ${error}`);
        })
    })
})