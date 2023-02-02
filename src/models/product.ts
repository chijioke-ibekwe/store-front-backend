import Client from '../database';

enum ProductCategory {
    TECHNOLOGY, CLOTHING, STATIONARY, FOOD_ITEM
}

export type Product = {
    id?: number;
    name: string;
    price: number;
    category: ProductCategory;
}

export class ProductStore {
    async findAll(): Promise<Product[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Cannot get products: ${error}`);
        }
    }

    async save(product: Product): Promise<Product> {
        try {
            const conn = await Client.connect();
            const sql = 'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *';

            const result = await conn.query(sql, [product.name, product.price]);
            const savedProduct = result.rows[0];
            conn.release();
            console.log(savedProduct);
            return savedProduct;
        } catch (error) {
            throw new Error(`Cannot add product: ${error}`);
        }
    }

    async findMostExpensiveProducts(): Promise<Product[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM products ORDER BY price DESC LIMIT 5';

            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Cannot fetch most expensive products: ${error}`);
        }
    }
}