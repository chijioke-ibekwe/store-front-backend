import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import verifyAuthToken from './token_verifier';

const userStore = new UserStore();

const index = async (_req: Request, res: Response) => {
    try {
        const users = await userStore.findAll();
        res.json(users);
    } catch (error) {
        res.status(500);
        res.json(error);
    }
}

const show = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);
        const user = await userStore.findById(userId);
        console.log(user)
        res.json(user);
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
            password: req.body.password
        }
        const savedUser : User = await userStore.save(user);
        res.json(savedUser);
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
    app.get('/users', verifyAuthToken, index);
    app.get('/users/:userId', verifyAuthToken, show);
    app.post('/users', create);
    app.post('/users/authenticate', authenticate);
}

export default user_routes;