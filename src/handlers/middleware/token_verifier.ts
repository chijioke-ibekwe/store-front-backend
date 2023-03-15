import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { Role } from '../../models/role';
import { InvalidAuthorizationError } from '../../errors/custom_errors';

const {TOKEN_SECRET} = process.env;
const tokenSecret = String(TOKEN_SECRET);

export type Payload = {
    id: number;
    username: string;
    verified: boolean;
    role: Role;
    iat: number;
    exp: number;
}

const verifyToken = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const authorizationHeader = String(req.headers.authorization);
            const token = authorizationHeader.split(' ')[1];
            const payload: string | JwtPayload = jwt.verify(token, tokenSecret);
    
            if((payload as Payload).role.name !== role)
                throw new InvalidAuthorizationError('Invalid role');
            
            next()
        } catch (error) {
            res.status(401)
            if(error instanceof TokenExpiredError){
                res.json({message: 'Token expired'})
            } else if (error instanceof InvalidAuthorizationError){
                res.json({message: 'You are not authorized to access this API'})
            } else {
                res.json({message: 'Invalid token'})
            }
        }
    }
}

export default verifyToken;