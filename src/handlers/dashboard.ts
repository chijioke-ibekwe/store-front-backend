import express, { Request, Response } from 'express';
import { DashboardQueries } from '../services/dashboard';

const dashboard = new DashboardQueries();

const topFiveMostPopularProducts = async (_req: Request, res: Response) => {
    try{
        console.log("started");
        const products = await dashboard.topFiveMostPopularProducts();
        res.json(products);
    } catch (error){
        res.status(500);
        res.json(error);
    }

}

const dashboard_routes = (app: express.Application) => {
    app.get('/products/most-popular', topFiveMostPopularProducts);
}

export default dashboard_routes;