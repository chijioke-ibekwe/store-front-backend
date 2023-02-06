import { UserStore } from '../../models/user';
import Client from '../../database';

const userStore = new UserStore();

describe('User Model Tests', () => {

    beforeAll(() => {
        return Client.connect().then(conn => {
            const sql = "INSERT INTO users (id, first_name, last_name, username, password) VALUES " + 
            "(2, 'John', 'Doe', 'john.doe@gmail.com', '$2b$10$ValaFNoiMPawmmWwxTGdy..MeYkBEKRvUXQFFYa0NF35z0dRyO8u2')";
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
            password: 'password'
        }

        return userStore.save(user).then(result => {
            expect(result.first_name).toEqual('Jane');
            expect(result.last_name).toEqual('Doe');
            expect(result.username).toEqual('jane.doe@gmail.com');
            expect(result.password).not.toEqual('password');
        })
    })

    it('should get all users from the database', () => {
        return userStore.findAll().then(result => {
            expect(result.length).toEqual(2);
        })
    })

    it('should get a single user from the database', () => {

        return userStore.findById(2).then(result => {
            expect(result.id).toEqual(2);
            expect(result.first_name).toEqual('John');
            expect(result.last_name).toEqual('Doe');
            expect(result.username).toEqual('john.doe@gmail.com');
            expect(result.password).not.toEqual('password');
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