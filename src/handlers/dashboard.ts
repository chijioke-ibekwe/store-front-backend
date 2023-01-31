import express, { Request, Response } from 'express';
import { DashboardQueries } from '../services/dashboard';
import verifyAuthToken from './token_verifier';

const dashboard = new DashboardQueries();

const findUsersWithOrders = async (_req: Request, res: Response) => {
    try{
        const users = await dashboard.getAllUsersWithOrders();
        res.json(users);
    } catch (error){
        res.status(500);
        res.json(error);
    }

}

const dashboard_routes = (app: express.Application) => {
    app.get('/orders/users', verifyAuthToken, findUsersWithOrders);
}

export default dashboard_routes;