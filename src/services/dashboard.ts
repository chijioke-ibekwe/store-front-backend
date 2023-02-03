import Client from '../database';
import { Product } from '../models/product';

export class DashboardQueries {

    async topFiveMostPopularProducts(): Promise<Product[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT p.id, p.name, p.price, p.category, COUNT(o.id) as number_of_orders FROM products p JOIN orders_products op ON ' + 
            'op.product_id = p.id JOIN orders o ON op.order_id = o.id GROUP BY p.id ORDER BY number_of_orders DESC LIMIT 5';

            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Cannot fetch most popular products: ${error}`);
        }
    }
}