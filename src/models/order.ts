import Client from '../database';

export enum OrderStatus {
    ACTIVE, COMPLETED
}

export type OrderProduct = {
    id: number;
    quantity: number;
}

export type Order = {
    id: number;
    products: OrderProduct[];
    user_id: number | null;
    status: OrderStatus;
}

export interface AddProductDTO {
    quantity: number;
    order_id: number;
    product_id: number;
}

export class OrderStore {
    async findMyActiveOrder(userId: number): Promise<{id: number, products: OrderProduct[], user_id: number, status: string}> {
        try {
            const conn = await Client.connect();

            const sql_one = 'SELECT * FROM orders WHERE status = ($1) AND user_id = ($2)';
            const result_one = await conn.query(sql_one, ['ACTIVE', userId]);

            if(result_one.rowCount === 0){
                const newOrder = await this.save(userId);
                const sql_two = 'SELECT p.id, op.quantity FROM products p JOIN orders_products op ON p.id = op.product_id WHERE op.order_id = ($1)';
                const result_two = await conn.query(sql_two, [newOrder.id]);
                newOrder.products = result_two.rows;
                conn.release();
                return newOrder;
            }

            let order = result_one.rows[0] as {id: number, products: OrderProduct[], user_id: number, status: string};
            const sql_two = 'SELECT p.id, op.quantity FROM products p JOIN orders_products op ON p.id = op.product_id WHERE op.order_id = ($1)';
            const result_two = await conn.query(sql_two, [order.id]);
            order.products = result_two.rows;

            conn.release();
            return order;
        } catch (error) {
            throw new Error(`Cannot find your active order: ${error}`);
        }
    }

    async addProduct(userId: number, dto: AddProductDTO): Promise<{id: number, products: OrderProduct[], user_id: number, status: string}> {
        try {
            const conn = await Client.connect();

            const sql = 'SELECT * FROM orders WHERE id = ($1) AND user_id = ($2)';
            const result = await conn.query(sql, [dto.order_id, userId]);

            if (result.rowCount === 0){
                throw new Error(`Order not found`);
            }

            const order = (result.rows[0] as unknown) as {id: number, products: OrderProduct[], user_id: number, status: string};

            if (order.status != 'ACTIVE'){
                throw new Error(`Order with id ${dto.order_id} is not active`);
            }

            conn.release();  
        } catch (error) {
            throw error;
        }

        try {
            const conn = await Client.connect();

            const sql_one = 'INSERT INTO orders_products (quantity, order_id, product_id) VALUES ($1, $2, $3)';
            await conn.query(sql_one, [dto.quantity, dto.order_id, dto.product_id]);

            const sql_two = 'SELECT * FROM orders WHERE id = ($1)';
            const result_two = await conn.query(sql_two, [dto.order_id]);
            let order = result_two.rows[0] as {id: number, products: OrderProduct[], user_id: number, status: string};

            const sql_three = 'SELECT p.id, op.quantity FROM products p JOIN orders_products op ON p.id = op.product_id WHERE op.order_id = ($1)';
            const result_three = await conn.query(sql_three, [order.id]);

            order.products = result_three.rows;

            conn.release();
            return order;
        } catch (error) {
            throw new Error(`Cannot add product with id ${dto.product_id} to order with id ${dto.order_id}: ${error}`);
        }
    }

    async findMyCompletedOrders(userId: number): Promise<{id: number, products: OrderProduct[], user_id: number, status: string}[]> {
        try {
            const conn = await Client.connect();

            const sql_one = 'SELECT * FROM orders WHERE status = ($1) AND user_id = ($2)';

            const result_one = await conn.query(sql_one, ['COMPLETED', userId]);

            let orders = result_one.rows;

            for(let i = 0; i < orders.length ; i++){
                const sql_two = 'SELECT p.id, op.quantity FROM products p JOIN orders_products op ON p.id = op.product_id WHERE op.order_id = ($1)';
                const result_two = await conn.query(sql_two, [orders[i].id]);

                orders[i].products = result_two.rows;
            }

            conn.release();
            return orders;
        } catch (error) {
            throw new Error(`Cannot fetch your completed orders: ${error}`);
        }
    }

    private async save(userId: number): Promise<{id: number, products: OrderProduct[], user_id: number, status: string}> {
        try {
            const conn = await Client.connect();

            const sql = 'INSERT INTO orders (status, user_id) VALUES ($1, $2) RETURNING *';

            const result = await conn.query(sql, ['ACTIVE', userId]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Cannot add order: ${error}`);
        }
    }
}