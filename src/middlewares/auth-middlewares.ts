import express, { NextFunction } from 'express';
import { Middleware, callback } from './middleware';
import jwt, { JwtPayload }  from 'jsonwebtoken';
import { User } from '../models/user';

export class AuthMiddleware extends Middleware {

    constructor(app: express.Application) {
        super(app);
    }
    
    async handle(req: express.Request, res: express.Response, next: callback) {
        console.log("hii auth middleware")
        const token = req.cookies.token || (typeof req.headers['authorization'] === 'string' ? req.headers['authorization'].replace('Bearer ', '') : '');
        if(!token) {
            return res.Error("You are not a valid user");
        }
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
            const user = await User.findByPk(decode.id,{
                attributes: ['id','firstName','email', 'role']
            });
            if(!user) return res.Error("You are not a valid user");
            req.user = user;
            // console.log(user)
            next();
        }catch(err){
            console.log("Error in authentication")
            return res.Error("Error in authentication");
        }
    }
}