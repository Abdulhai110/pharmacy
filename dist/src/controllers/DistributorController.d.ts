import express from "express";
export declare class DistributorController {
    private static instance;
    private constructor();
    static init(): DistributorController;
    list(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    distributors(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    save(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    update(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    transaction(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    updateStatus(req: express.Request, res: express.Response): Promise<void>;
    del(req: express.Request, res: express.Response): Promise<void>;
}
