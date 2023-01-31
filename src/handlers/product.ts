import express, { Request, Response } from 'express';
import { Product, ProductStore } from "../models/product";
import verifyAuthToken from './token_verifier';

const productStore = new ProductStore();

const index = async (_req: Request, res: Response) => {
    const products : Product[] = await productStore.findAll();
    res.json(products);
}

const create = async (req: Request, res: Response) => {
    try{
        const product: Product = {
            name: req.body.name,
            price: req.body.price
        }

        const savedProduct : Product = await productStore.save(product);
        res.json(savedProduct);
    } catch (error){
        res.status(500);
        res.json(error);
    }

}

const findMostExpensiveProducts = async (req: Request, res: Response) => {
    try {
        const products: Product[] = await productStore.findMostExpensiveProducts();
        res.json(products);
    } catch (error) {
        res.status(500);
        res.json(error);
    }
}


const product_routes = (app: express.Application) => {
    app.get('/products', verifyAuthToken, index);
    app.post('/products', verifyAuthToken, create);
    app.get('/products/most-expensive', verifyAuthToken, findMostExpensiveProducts);
}

export default product_routes;