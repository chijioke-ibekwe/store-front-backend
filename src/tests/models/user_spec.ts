import { UserStore } from '../../models/user';
import Client from '../../database';

const userStore = new UserStore();

describe('User Model Tests', () => {

    beforeAll(() => {
        return Client.connect().then(conn => {
            const sql = "INSERT INTO users (id, first_name, last_name, username, password, phone_number, role_id) VALUES " + 
            "(5, 'John', 'Doe', 'john.doe@gmail.com', '$2b$10$ValaFNoiMPawmmWwxTGdy..MeYkBEKRvUXQFFYa0NF35z0dRyO8u2', '+2348011112222', 1)";
            return conn.query(sql).then(() => {
                conn.release();
            });
        }).catch((error) => {
            throw new Error(`Cannot add user test data: ${error}`);
        })
    })

    it('should add a new user to the database', () => {
        const user = {
            first_name: 'Jane', 
            last_name: 'Doe', 
            username: 'jane.doe@gmail.com',
            password: 'password',
            phone_number: '+2348022223333',
            role_id: 1
        }

        return userStore.save(user).then(result => {
            expect(result.first_name).toEqual('Jane');
            expect(result.last_name).toEqual('Doe');
            expect(result.username).toEqual('jane.doe@gmail.com');
            expect(result.phone_number).toEqual('+2348022223333');
            expect(result.role).toEqual({id: 1, name: 'role_admin', description: 'Role for admin users'});
            expect(result.verified).toEqual(false);
        })
    })

    it('should get all users from the database', () => {
        return userStore.findAll(10, 0).then(result => {
            expect(result.length).toEqual(2);
        })
    })

    it('should get a single user from the database', () => {

        return userStore.findById(5).then(result => {
            expect(result.id).toEqual(5);
            expect(result.first_name).toEqual('John');
            expect(result.last_name).toEqual('Doe');
            expect(result.username).toEqual('john.doe@gmail.com');
            expect(result.role).toEqual({id: 1, name: 'role_admin', description: 'Role for admin users'});
            expect(result.verified).toEqual(false);
        });
    })

    it('should authenticate a user', () => {

        return userStore.authenticate('john.doe@gmail.com', 'password').then(result => {
            expect(result).not.toBeNull;
        });
    })

    afterAll(() => {
        return Client.connect().then(conn => {
            const sql = "DELETE FROM users WHERE username = 'john.doe@gmail.com' OR username = 'jane.doe@gmail.com'";
            return conn.query(sql).then(() => {
                conn.release();
            });
        }).catch((error) => {
            throw new Error(`Cannot delete user test data: ${error}`);
        })
    })

})