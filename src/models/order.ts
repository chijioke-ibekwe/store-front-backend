import Client from '../database';

enum OrderStatus {
    ACTIVE, CLOSED
}

export type Order = {
    id?: number;
    status: OrderStatus;
    user_id: number | null;
}

export interface AddProductDTO {
    quantity: number;
    order_id: number;
    product_id: number;
}

export class OrderStore {
    async findAll(): Promise<Order[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM orders';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Cannot get orders: ${error}`);
        }
    }

    async save(order: Order): Promise<Order> {
        try {
            const conn = await Client.connect();
            const sql = 'INSERT INTO orders (status, user_id) VALUES ($1, $2) RETURNING *';

            const result = await conn.query(sql, [order.status, order.user_id]);
            const savedOrder = result.rows[0];
            conn.release();
            console.log(savedOrder);
            return savedOrder;
        } catch (error) {
            throw new Error(`Cannot add order: ${error}`);
        }
    }

    async addProduct(dto: AddProductDTO): Promise<Order> {
        try {
            const conn = await Client.connect();

            const _sql = 'SELECT * FROM orders WHERE id = ($1)';
            const result = await conn.query(_sql, [dto.order_id]);
            const order = result.rows[0];

            if (String((order as Order).status) != 'ACTIVE'){
                throw new Error(`Order with id ${dto.order_id} is not active`);
            }

            conn.release();  
        } catch (error) {
            throw error;
        }


        try {
            const conn = await Client.connect();

            const sql = 'INSERT INTO orders_products (quantity, order_id, product_id) VALUES ($1, $2, $3)';
            await conn.query(sql, [dto.quantity, dto.order_id, dto.product_id]);

            const _sql = 'SELECT * FROM orders WHERE id = ($1)';
            const result = await conn.query(_sql, [dto.order_id]);
            const order = result.rows[0];

            conn.release();
            return order;
        } catch (error) {
            throw new Error(`Cannot add product with id ${dto.product_id} to order with id ${dto.order_id}: ${error}`);
        }
    }
}