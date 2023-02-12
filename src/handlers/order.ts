import express, { Request, Response } from 'express';
import { OrderStore, AddProductDTO } from '../models/order';
import jwt from 'jsonwebtoken';
import verifyAuthToken from './token_verifier';

const orderStore = new OrderStore();
const {TOKEN_SECRET} = process.env;
const tokenSecret = String(TOKEN_SECRET);

type TokenDecodeResult = {
    id: number;
    username: string;
    lat: number;
}

const getUserId = (req: Request): number => {
    try {
        const authorizationHeader = String(req.headers.authorization);
        const token = authorizationHeader.split(' ')[1]
        const decoded = jwt.verify(token, tokenSecret) as TokenDecodeResult;
    
        return decoded.id;
    } catch (error) {
        throw error;
    }
}

const findMyActiveOrder = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);

        const order = await orderStore.findMyActiveOrder(userId);
        res.json(order);
    } catch (error) {
        res.status(500);
        res.json(error);
    }
}

const findMyCompletedOrders = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);

        const orders = await orderStore.findMyCompletedOrders(userId);
        res.json(orders);
    } catch (error) {
        res.status(500);
        res.json(error);
    }
}

const addProduct = async (req: Request, res: Response) => {
    try{
        const userId = getUserId(req);

        const dto: AddProductDTO = {
            quantity: req.body.quantity,
            order_id: Number(req.params.orderId),
            product_id: req.body.productId
        }

        const order = await orderStore.addProduct(userId, dto);
        res.json(order);
    } catch (error){
        res.status(500);
        res.json({message: `${error}`});
    }

}

const order_routes = (app: express.Application) => {
    app.get('/api/v1/orders/active', verifyAuthToken, findMyActiveOrder);
    app.get('/api/v1/orders/completed', verifyAuthToken, findMyCompletedOrders);
    app.post('/api/v1/orders/:orderId/products', verifyAuthToken, addProduct);
}

export default order_routes;