import express, { Router } from "express";
import { RoutesConfig } from "./routes.config";
export declare class AdminRoutes extends RoutesConfig {
    route: Router;
    constructor(app: express.Application);
    configureRoutes(): express.Application;
    distributorRoutes(): void;
    loanTakerRoutes(): void;
    loanRoutes(): void;
    loanTransactionRoutes(): void;
    distributorDebitRoutes(): void;
    distributorCreditRoutes(): void;
    dailyClosingRoutes(): void;
    dailyLedgerRoutes(): void;
    todayLoansTransactions(): void;
    bankAccountRoutes(): void;
    bankRoutes(): void;
    expenseRoutes(): void;
    ledgerRoutes(): void;
}
