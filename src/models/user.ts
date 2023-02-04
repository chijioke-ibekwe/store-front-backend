import Client from '../database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const {SALT_ROUNDS, BCRYPT_PASSWORD, TOKEN_SECRET} = process.env;
const pepper = String(BCRYPT_PASSWORD);
const saltRounds = String(SALT_ROUNDS);
const tokenSecret = String(TOKEN_SECRET);

export type User = {
    id?: number;
    first_name: string;
    last_name: string;
    username: string;
    password: string;
}

export class UserStore {
    async findAll(): Promise<User[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Cannot get users: ${error}`);
        }
    }

    async findById(id: number): Promise<User> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM users WHERE id = ($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Cannot get user with id ${id}: ${error}`);
        }
    }

    async save(user: User): Promise<User> {
        try {
            const conn = await Client.connect();
            const sql = 'INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4) RETURNING *';

            const hash = bcrypt.hashSync(
                user.password + pepper, 
                parseInt(saltRounds)
             );

            const result = await conn.query(sql, [user.first_name, user.last_name, user.username, hash]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Cannot create user: ${error}`);
        }
    }

    async authenticate(username: string, password: string): Promise<string | null> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM users WHERE username = ($1)';
    
            const result = await conn.query(sql, [username]);
    
            if(result.rows.length) {
                const user: User = result.rows[0];
    
                if(bcrypt.compareSync(password + pepper, user.password)){
                    return jwt.sign({id: user.id, username: user.username}, tokenSecret);
                }
            }
    
            return null;
        } catch (error) {
            throw new Error(`Authentication failed: ${error}`);
        }
    }
}