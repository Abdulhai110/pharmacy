import express from "express";
import { PaymentMethodEnum } from '../constants/enum';
import { Transaction } from '../models/BankTransactions';
export declare class LoanController {
    private static instance;
    private constructor();
    static init(): LoanController;
    list(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    save(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    update(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    createTransaction({ transactionType, amount, description, accountId, refrenceNumber, paymentMethod, transaction }: {
        transactionType: any;
        amount: number;
        description: string;
        accountId: number;
        refrenceNumber?: string;
        paymentMethod: PaymentMethodEnum;
        transaction?: any;
    }): Promise<Transaction>;
    detail(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    updateStatus(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    del(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
}
