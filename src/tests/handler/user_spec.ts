import supertest from 'supertest';
import Client from '../../database';
import app from '../../server';

const request = supertest(app);

describe('User Endpoint Tests', () => {

  it('should return a 401 response since /api/v1/users endpoint requires an access token', () => {
    return request.get('/api/v1/users').then(response => {
        expect(response.status).toBe(401);
        expect(response.body.message).toEqual(
          'You are not authorised to perform this operation'
        );
    });
  });

  it('should return a 401 response since /api/v1/users/:userId endpoint requires an access token', () => {
    return request.get('/api/v1/users').then(response => {
        expect(response.status).toBe(401);
        expect(response.body.message).toEqual(
          'You are not authorised to perform this operation'
        );
    })
  });

  it('should successfully create a user', () => {
    return request.post('/api/v1/users')
    .send({firstName: 'Tony', lastName: 'Daniel', username: 't.dane@gmail.com', password: 'password', phoneNumber: '+2348033334444', roleId: 1})
    .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.first_name).toEqual('Tony');
    });

  });

  it('should successfully authenticate a user', () => {
    return request.post('/api/v1/users/authenticate')
    .send({username: 't.dane@gmail.com', password: 'password'}).then(response => {
        expect(response.status).toBe(200);
        expect(response.body.access_token).not.toBeNull();
    });

  });

  afterAll(() => {
    return Client.connect().then(conn => {
        const sql = "DELETE FROM users WHERE username = 't.dane@gmail.com'";
        return conn.query(sql).then(() => {
            conn.release();
        });
    }).catch((error) => {
        throw new Error(`Cannot delete user test data: ${error}`);
    })
})
})