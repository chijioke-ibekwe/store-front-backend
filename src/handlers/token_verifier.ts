import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const {TOKEN_SECRET} = process.env;
const tokenSecret = String(TOKEN_SECRET);


const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = String(req.headers.authorization);
        const token = authorizationHeader.split(' ')[1]
        jwt.verify(token, tokenSecret)

        next()
    } catch (error) {
        res.status(401)
        res.json({message: "You are not authorised to perform this operation"})
    }
}

export default verifyAuthToken;