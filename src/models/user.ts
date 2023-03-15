import Client from '../database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Role } from './role';

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
    phone_number: string;
    role_id: number;
    verified?: boolean;
}

export type Count = {
    count: number;
}

export interface UserDTO {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    phone_number: string;
    role?: Role;
    verified: boolean;
}

export class UserStore {
    async findAll(limit: number, offset: number): Promise<UserDTO[]> {
        try {
            const conn = await Client.connect();
            const sql_one = 'SELECT * FROM users ORDER BY id LIMIT ($1) OFFSET ($2)';
            const result_one = await conn.query(sql_one, [limit, offset]);

            let users = result_one.rows;
            let userDTOs: UserDTO[] = [];

            for(let i = 0; i < users.length ; i++){
                const sql_two = 'SELECT * FROM roles WHERE id = ($1)';
                const result_two = await conn.query(sql_two, [users[i].role_id]);
                const role = result_two.rows[0];

                const userDTO = this.mapUserToUserDTO(users[i], role);

                userDTOs.push(userDTO);
            }

            conn.release();
            return userDTOs;
        } catch (error) {
            throw new Error(`Cannot get users: ${error}`);
        }
    }

    async findById(id: number): Promise<UserDTO> {
        try {
            const conn = await Client.connect();
            const sql_one = 'SELECT * FROM users WHERE id = ($1)';
            const result_one = await conn.query(sql_one, [id]);
            const user = result_one.rows[0];

            const sql_two = 'SELECT * FROM roles WHERE id = ($1)';
            const result_two = await conn.query(sql_two, [user.role_id]);
            const role = result_two.rows[0];

            const userDTO = this.mapUserToUserDTO(user, role);

            conn.release();
            return userDTO;
        } catch (error) {
            throw new Error(`Cannot get user with id ${id}: ${error}`);
        }
    }

    async save(user: User): Promise<UserDTO> {
        try {
            const conn = await Client.connect();
            const sql_one = 'INSERT INTO users (first_name, last_name, username, password, phone_number, role_id) VALUES ($1, $2, $3, $4, $5, $6) ' + 
            'RETURNING *';

            const hash = bcrypt.hashSync(
                user.password + pepper, 
                parseInt(saltRounds)
             );

            const result_one = await conn.query(sql_one, [user.first_name, user.last_name, user.username, hash, user.phone_number, user.role_id]);
            const savedUser = result_one.rows[0];

            const sql_two = 'SELECT * FROM roles WHERE id = ($1)';
            const result_two = await conn.query(sql_two, [savedUser.role_id]);
            const role = result_two.rows[0];

            const userDTO = this.mapUserToUserDTO(savedUser, role);

            conn.release();

            return userDTO;
        } catch (error) {
            throw new Error(`Cannot create user: ${error}`);
        }
    }

    async authenticate(username: string, password: string): Promise<string | null> {
        try {
            const conn = await Client.connect();
            const sql_one = 'SELECT * FROM users WHERE username = ($1)';
    
            const result_one = await conn.query(sql_one, [username]);
    
            if(result_one.rows.length) {
                const user: User = result_one.rows[0];

                const sql_two = 'SELECT * FROM roles WHERE id = ($1)';
                const result_two = await conn.query(sql_two, [user.role_id]);
                const role = result_two.rows[0];
    
                if(bcrypt.compareSync(password + pepper, user.password)){
                    return jwt.sign({id: user.id, username: user.username, verified: user.verified, role: role}, tokenSecret, 
                        { expiresIn: '5m' });
                }
            }
    
            return null;
        } catch (error) {
            throw new Error(`Authentication failed: ${error}`);
        }
    }

    async usersCount(): Promise<Count> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT COUNT(*) FROM users';
    
            const result = await conn.query(sql);
    
            conn.release();
    
            return result.rows[0];

        } catch (error) {
            throw new Error(`Users count failed: ${error}`);
        }
    }

    private mapUserToUserDTO(user: User, role: Role): UserDTO {

        return {
            id: user.id as number,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            phone_number: user.phone_number,
            verified: user.verified as boolean,
            role: role
        }

    }
}