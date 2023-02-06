import express, { Request, Response } from 'express';
import { ProductCategory, Product, ProductStore } from "../models/product";
import verifyAuthToken from './token_verifier';

const productStore = new ProductStore();

const index = async (req: Request, res: Response) => {
    try {
        let category = req.query.category;
        console.log(category);
        let products: {id: number, name: string, price: string, category: string}[];

        if(category === undefined || category === null){
            products = await productStore.findAll();
        } else {
            products = await productStore.findByCategory((category as unknown) as ProductCategory)
        }

        res.json(products);
    } catch (error) {
        res.status(500);
        res.json(error);
    }
}

const show = async (req: Request, res: Response) => {
    try {
        const productId = Number(req.params.productId);
        const product = await productStore.findById(productId);
        res.json(product);
    } catch (error) {
        res.status(500);
        res.json(error);
    }
}

const create = async (req: Request, res: Response) => {
    try{
        const product: Product = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category as ProductCategory
        }

        const savedProduct = await productStore.save(product);
        res.json(savedProduct);
    } catch (error){
        res.status(500);
        res.json(error);
    }

}


const product_routes = (app: express.Application) => {
    app.get('/products', index);
    app.get('/products/:productId', show);
    app.post('/products', verifyAuthToken, create);
}

export default product_routes;