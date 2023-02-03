import Client from '../database';

export enum ProductCategory {
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

    async findById(id: number): Promise<Product> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM products WHERE id = ($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Cannot get product with id ${id}: ${error}`);
        }
    }

    async save(product: Product): Promise<Product> {
        try {
            const conn = await Client.connect();
            const sql = 'INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *';

            const result = await conn.query(sql, [product.name, product.price, product.category]);
            conn.release();
            return result.rows[0];;
        } catch (error) {
            throw new Error(`Cannot add product: ${error}`);
        }
    }

    async findByCategory(category: ProductCategory): Promise<Product[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM products WHERE category = ($1)';

            const result = await conn.query(sql, [category]);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Cannot fetch products by category ${category}: ${error}`);
        }
    }
}