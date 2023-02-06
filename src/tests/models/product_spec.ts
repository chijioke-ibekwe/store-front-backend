import { Product, ProductCategory, ProductStore } from '../../models/product';
import Client from '../../database';

const productStore = new ProductStore();

describe('Product Model Tests', () => {

    beforeAll(() => {
        return Client.connect().then(conn => {
            const sql = "INSERT INTO products (id, name, price, category) VALUES (2, 'Gucci T-Shirt', 80000, 'CLOTHING')";
            return conn.query(sql).then(() => {
                conn.release();
            });
        }).catch((error) => {
            throw new Error(`Cannot add product test data: ${error}`);
        })
    })

    it('should add a new product to the database', () => {
        const product: Product = {
            name: 'Dell Alienware Laptop', 
            price: 1500000, 
            category: 'TECHNOLOGY' as unknown as ProductCategory
        }

        return productStore.save(product).then(result => {
            expect(result.name).toEqual('Dell Alienware Laptop');
            expect(result.price).toEqual('1500000.00');
            expect(result.category).toEqual('TECHNOLOGY');
        })
    })

    it('should get all products from the database', () => {
        return productStore.findAll().then(result => {
            expect(result.length).toEqual(2);
        })
    })

    it('should get a single product from the database', () => {

        return productStore.findById(2).then(result => {
            expect(result.id).toEqual(2);
            expect(result.name).toEqual('Gucci T-Shirt');
            expect(result.price).toEqual('80000.00');
            expect(result.category).toEqual('CLOTHING');
        });
    })

    it('should get all products by category from the database', () => {

        return productStore.findByCategory('TECHNOLOGY' as unknown as ProductCategory).then(result => {
            expect(result.length).toEqual(1);
        });
    })

    afterAll(() => {
        return Client.connect().then(conn => {
            const sql = "DELETE FROM products WHERE id = 2 OR name = 'Dell Alienware Laptop'";
            return conn.query(sql).then(() => {
                conn.release();
            })
        }).catch((error) => {
            throw new Error(`Cannot delete product test data: ${error}`);
        })
    })

})