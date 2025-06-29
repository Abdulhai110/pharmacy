// import express, { NextFunction } from 'express';
// import { Middleware, callback } from './middleware';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import { User } from '../models/user';

// export class AuthMiddleware extends Middleware {

//     constructor(app: express.Application) {
//         super(app);
//     }

//     async handle(req: express.Request, res: express.Response, next: callback) {
//         console.log("hii auth middleware")
//         const token = req.cookies.token || (typeof req.headers['authorization'] === 'string' ? req.headers['authorization'].replace('Bearer ', '') : '');
//         if (!token) {
//             return res.Error("You are not a valid user");
//         }
//         try {
//             const decode = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
//             const user = await User.findByPk(decode.id, {
//                 attributes: ['id', 'firstName', 'email', 'role']
//             });
//             if (!user) return res.Error("You are not a valid user");
//             req.user = user;
//             // console.log(user)
//             next();
//         } catch (err) {
//             console.log("Error in authentication")
//             return res.Error("Error in authentication");
//         }
//     }
// }

import express, { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/user';

export class AuthMiddleware extends Middleware {
    constructor(app: express.Application) {
        super(app);
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        console.log("hii auth middleware");

        const token = req.cookies?.token || (typeof req.headers['authorization'] === 'string' ? req.headers['authorization'].replace('Bearer ', '') : '');

        if (!token) {
            return res.status(401).json({ message: "You are not a valid user" });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
            const user = await User.findByPk(decode.id, {
                attributes: ['id', 'firstName', 'email', 'role']
            });

            if (!user) {
                return res.status(401).json({ message: "You are not a valid user" });
            }

            req.user = user; // Ensure req.user exists in your type definition
            next(); // Proceed to the next middleware
        } catch (err) {
            console.error("Error in authentication:", err);
            return res.status(401).json({ message: "Error in authentication" });
        }
    }
}
