import { User, UserStore } from '../user';

const userStore = new UserStore();

describe('User Model Tests', () => {

    it('should get all users from the database', async () => {
        const result = await userStore.findAll;

        expect(result.length).toEqual(0);
    })

    it('should get a single user from the database', async () => {
        const result = await userStore.findById(1);
        expect(result).not.toBeDefined;
    })

    it('should add a new user to the database', async () => {
        const user = {
            first_name: 'John', 
            last_name: 'Doe', 
            username: 'john.doe@gmail.com',
            password: 'password'
        }

        const result = await userStore.save(user);

        expect(result.id).toEqual(1);
        expect(result.first_name).toEqual("John");
        expect(result.last_name).toEqual("Doe");
        expect(result.password).not.toEqual('password');
    })

})