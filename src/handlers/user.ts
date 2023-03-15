import express, { NextFunction, Request, Response } from 'express';
import { RequestStatus, ResponseObject } from '../models/response_object';
import { Count, User, UserStore } from '../models/user';
import verifyToken from './middleware/token_verifier';
import paginate, { PageDetails } from './middleware/paginator';

const userStore = new UserStore();

const index = async (req: Request, res: Response) => {
    try {
        const noOfUsers: Count = await userStore.usersCount();
        const page: PageDetails = paginate(req, noOfUsers);
        
        const users = await userStore.findAll(page.limit, page.offset);
        res.json(new ResponseObject(RequestStatus.SUCCESSFUL, null, users, page.page));
    } catch (error) {
        res.status(500);
        res.json(error);
    }
}

const show = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);
        const user = await userStore.findById(userId);

        res.json(new ResponseObject(RequestStatus.SUCCESSFUL, null, user));
    } catch (error) {
        res.status(500);
        res.json(error);
    }
}

const create = async (req: Request, res: Response) => {
    try{
        const user: User = {
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            username: req.body.username,
            password: req.body.password,
            phone_number: req.body.phoneNumber,
            role_id: req.body.roleId
        }
        const savedUser = await userStore.save(user);
        res.json(new ResponseObject(RequestStatus.SUCCESSFUL, 'Sign Up Successful', savedUser));
    } catch (error){
        res.status(500);
        res.json(error);
    }

}

const authenticate = async (req: Request, res: Response) => {
    try {
        const accessToken: string | null = await userStore.authenticate(req.body.username, req.body.password);

        if(accessToken === null){
            res.status(400);
            res.json({message: "Invalid username or password"});
        }

        res.json({access_token: accessToken});
    } catch (error) {
        res.status(500);
        res.json(error);
    }
}


const user_routes = (app: express.Application) => {
    app.get('/api/v1/users', verifyToken('role_admin'), index);
    app.get('/api/v1/users/:userId', verifyToken('role_admin'), show);
    app.post('/api/v1/users', create);
    app.post('/api/v1/users/authenticate', authenticate);
}

export default user_routes;