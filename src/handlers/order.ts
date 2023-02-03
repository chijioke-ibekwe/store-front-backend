import express, { Request, Response } from 'express';
import { Order, OrderStore, AddProductDTO } from '../models/order';
import { DashboardQueries } from '../services/dashboard';
import jwt from 'jsonwebtoken';
import verifyAuthToken from './token_verifier';

const orderStore = new OrderStore();
const {TOKEN_SECRET} = process.env;
const tokenSecret = String(TOKEN_SECRET);
const dashboard = new DashboardQueries();

const index = async (_req: Request, res: Response) => {
    const orders : Order[] = await orderStore.findAll();
    res.json(orders);
}

const create = async (req: Request, res: Response) => {
    let userId = null;

    type TokenDecodeResult = {
        id: number;
        username: string;
        lat: number;
    }

    try {
        const authorizationHeader = String(req.headers.authorization);
        const token = authorizationHeader.split(' ')[1]
        const decoded = jwt.verify(token, tokenSecret) as TokenDecodeResult;

        userId = decoded.id;
    } catch (error) {
        res.status(401);
        res.json(error);
    }

    try{
        const order: Order = {
            status: req.body.status,
            user_id: userId
        }

        const savedOrder : Order = await orderStore.save(order);
        res.json(savedOrder);
    } catch (error){
        res.status(500);
        res.json(error);
    }

}

const addProduct = async (req: Request, res: Response) => {
    try{
        const dto: AddProductDTO = {
            quantity: req.body.quantity,
            order_id: Number(req.params.orderId),
            product_id: req.body.productId
        }

        const order : Order = await orderStore.addProduct(dto);
        res.json(order);
    } catch (error){
        res.status(500);
        res.json({message: `${error}`});
    }

}

const order_routes = (app: express.Application) => {
    app.get('/orders', verifyAuthToken, index);
    app.post('/orders', verifyAuthToken, create);
    app.post('/orders/:orderId/products', verifyAuthToken, addProduct);
}

export default order_routes;