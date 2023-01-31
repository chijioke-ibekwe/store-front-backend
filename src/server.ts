import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import book_routes from './handlers/book';
import user_routes from './handlers/user';
import order_routes from './handlers/order';
import product_routes from './handlers/product';

const app: express.Application = express()
const address: string = "0.0.0.0:3000"

app.use(bodyParser.json());

app.get('/', function (_req: Request, res: Response) {
    res.send('Hello World!')
})

book_routes(app);
user_routes(app);
order_routes(app);
product_routes(app);

app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})
