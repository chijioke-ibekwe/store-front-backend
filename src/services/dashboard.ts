import Client from '../database';

export class DashboardQueries {

    async getAllUsersWithOrders(): Promise<{id: number, first_name: string, last_name: string, username: string}[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT DISTINCT u.id, u.first_name, u.last_name, u.username FROM users u JOIN orders o ON u.id = o.user_id';

            const result = await conn.query(sql);
            const users = result.rows;
            conn.release();
            return users;
        } catch (error) {
            throw new Error(`Cannot fetch users with orders: ${error}`);
        }
    }
}