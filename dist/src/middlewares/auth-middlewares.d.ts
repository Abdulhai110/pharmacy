import express, { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware';
export declare class AuthMiddleware extends Middleware {
    constructor(app: express.Application);
    handle(req: Request, res: Response, next: NextFunction): Promise<express.Response<any, Record<string, any>>>;
}
