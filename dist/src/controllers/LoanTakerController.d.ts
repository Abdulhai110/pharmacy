import express from "express";
export declare class LoanTakerController {
    private static instance;
    private constructor();
    static init(): LoanTakerController;
    list(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    loanTakers(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    loanList(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    transactionList(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    save(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    update(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    updateStatus(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    detail(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    loanDetail(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    del(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
}
