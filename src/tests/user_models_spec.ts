import { UserStore } from '../models/user';

const userStore = new UserStore();

describe('User Model Tests', () => {

    it('should add a new user to the database', () => {
        const user = {
            first_name: 'John', 
            last_name: 'Doe', 
            username: 'john.doe@gmail.com',
            password: 'password'
        }

        return userStore.save(user).then(result => {
            expect(result.id).toEqual(1);
            expect(result.first_name).toEqual("John");
            expect(result.last_name).toEqual("Doe");
            expect(result.password).not.toEqual('password');
        })
    })

    it('should get all users from the database', () => {
        return userStore.findAll().then(result => {
            expect(result.length).toEqual(1);
        })
    })

    it('should get a single user from the database', () => {

        return userStore.findById(1).then(result => {
            expect(result.id).toEqual(1);
            expect(result.first_name).toEqual("John");
            expect(result.last_name).toEqual("Doe");
            expect(result.password).not.toEqual('password');
        });
    })

    it('should authenticate a user', () => {

        return userStore.authenticate('john.doe@gmail.com', 'password').then(result => {
            expect(result).not.toBeNull;
        });
    })

})