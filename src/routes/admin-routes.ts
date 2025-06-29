import express, { RequestHandler, Router } from "express";
import { RoutesConfig } from "./routes.config";
import { AdminAuthMiddleware } from "../middlewares/admin-auth-middleware";
import {
  DailyLedger,
  DailyClosing,
  LoanController,
  LoanTakerController,
  TodayTransactions,
  DistributorController,
  LoanTransactionController,
  DistributorDebitController,
  DistributorCreditController,
} from "../controllers/controller";
import { AccountController } from "../controllers/bank-account.controller";
import { BankController } from "../controllers/bank.controller";
import { ExpenseController } from "../controllers/expense.controller";
import { ExpenseCategoryController } from "../controllers/expense-category.controller";
import { LedgerController } from "../controllers/LedgerController";

// import {uploadFiles} from "../helpers/helper"

export class AdminRoutes extends RoutesConfig {
  route: Router;
  constructor(app: express.Application) {
    super(app, "AdminRoutes");
  }

  configureRoutes() {
    this.route = express.Router();

    // this.app.use('/api/admin', )
    this.app.use(
      "/api/admin",
      new AdminAuthMiddleware(this.app).handle,
      this.route
    );
    this.loanRoutes();
    this.loanTakerRoutes();
    this.dailyLedgerRoutes();
    this.distributorRoutes();
    this.dailyClosingRoutes();
    this.loanTransactionRoutes();
    this.distributorDebitRoutes();
    this.distributorCreditRoutes();
    this.todayLoansTransactions();
    this.bankAccountRoutes();
    this.bankRoutes();
    this.expenseRoutes();
    this.ledgerRoutes();
    return this.app;
  }

  distributorRoutes() {
    const route = express.Router();
    const controller = DistributorController.init();
    // route.post("/create", controller.storeCategory);
    route.get("", controller.distributors);
    route.get("/list", controller.list);
    route.post("/add", controller.save);
    route.post("/update", controller.update);
    route.post("/update-status", controller.updateStatus);
    route.post("/delete", controller.del);
    route.post("/transaction", controller.transaction);
    this.route.use("/distributor", route);
  }

  loanTakerRoutes() {
    const route = express.Router();
    const controller = LoanTakerController.init();
    route.get("", controller.loanTakers);
    route.get("/list", controller.list);
    route.post("/add", controller.save);
    route.post("/update", controller.update);
    route.post("/detail", controller.detail);
    route.post("/update-status", controller.updateStatus);
    route.post("/delete", controller.del);
    route.get("/loan/loans-list", controller.loanList);
    route.get("/transaction/transactions-list", controller.transactionList);
    route.post("/loan/loan-detail", controller.loanDetail);
    this.route.use("/loan-taker", route);
  }

  loanRoutes() {
    const route = express.Router();
    const controller = LoanController.init();
    route.get("/list", controller.list);
    route.post("/detail", controller.detail);
    route.post("/add", controller.save);
    route.post("/update", controller.update);
    route.post("/update-status", controller.updateStatus);
    route.post("/delete", controller.del);
    this.route.use("/loan", route);
  }

  loanTransactionRoutes() {
    const route = express.Router();
    const controller = LoanTransactionController.init();
    route.get("/list", controller.list);
    route.post("/detail", controller.detail);
    route.post("/add", controller.save);
    route.post("/update", controller.update);
    route.post("/update-status", controller.updateStatus);
    route.post("/delete", controller.del);
    this.route.use("/loan-transaction", route);
  }

  distributorDebitRoutes() {
    const route = express.Router();
    const controller = DistributorDebitController.init();
    route.get("/list", controller.list);
    route.post("/detail", controller.detail);
    route.post("/add", controller.save);
    route.post("/update", controller.update);
    route.post("/update-status", controller.updateStatus);
    route.post("/delete", controller.del);
    this.route.use("/distributor-debit", route);
  }

  distributorCreditRoutes() {
    const route = express.Router();
    const controller = DistributorCreditController.init();
    route.get("/list", controller.list);
    route.post("/detail", controller.detail);
    route.post("/add", controller.save);
    route.post("/update", controller.update);
    route.post("/update-status", controller.updateStatus);
    route.post("/delete", controller.del);
    this.route.use("/distributor-credit", route);
  }

  dailyClosingRoutes() {
    const route = express.Router();
    const controller = DailyClosing.init();
    route.get("/list", controller.list);
    route.get("/detail", controller.detail);
    route.post("/download-pdf", controller.downloadPdf);
    route.post("/add", controller.save);
    route.post("/update", controller.update);
    route.post("/update-status", controller.updateStatus);
    route.post("/delete", controller.del);
    route.get("/today-transactions", controller.todayTransaction);
    this.route.use("/closing", route);
  }

  dailyLedgerRoutes() {
    const route = express.Router();
    const controller = DailyLedger.init();
    route.get("/list", controller.list);
    route.post("/detail", controller.detail);
    route.post("/add", controller.save);
    route.post("/update", controller.update);
    route.post("/update-status", controller.updateStatus);
    route.post("/delete", controller.del);
    this.route.use("/ledger", route);
  }

  todayLoansTransactions() {
    const route = express.Router();
    const controller = TodayTransactions.init();
    route.get("/loan-transactions", controller.todayLoanTransactions);
    route.get(
      "/distributors-transactions",
      controller.todayDistributorsTransactions
    );
    route.get("/list", controller.list);
    route.post("/detail", controller.detail);
    route.post("/add", controller.save);
    route.post("/update", controller.update);
    route.post("/update-status", controller.updateStatus);
    route.post("/delete", controller.del);
    this.route.use("/today", route);
  }

  bankAccountRoutes() {
    const route = express.Router();
    const controller = AccountController.init(); // Use init() instead of new

    route.get("", controller.accounts);
    route.get("/list", controller.list);
    route.post("/add", controller.create);
    route.post("/update", controller.update);
    route.post("/transaction", controller.processTransaction);
    route.get("/transactions", controller.getTransactions);
    route.post("/transfer", controller.transfer);

    this.route.use("/account", route);
  }

  bankRoutes() {
    const route = express.Router();
    const allBanks = express.Router();
    const controller = BankController.init();

    // Get list of banks with pagination
    route.get("/list", controller.list);

    // Create new bank
    route.post("/add", controller.create);

    // Update bank details
    route.post("/update", controller.update);

    // Get bank details
    route.get("/detail", controller.detail);

    // Update bank status
    route.post("/update-status", controller.updateStatus);

    // Delete bank (soft delete)
    route.post("/delete", controller.delete);

    // Get all banks with specified format
    allBanks.get("/", controller.getAllBanks);

    this.route.use("/bank", route);
    this.route.use("/banks", allBanks);
  }

  expenseRoutes() {
    const expenseController = ExpenseController.init();
    const categoryController = ExpenseCategoryController.init();
    const route = express.Router();

    // Expense routes
    route.get("/expenses/list", expenseController.list);
    route.get("/expenses/:id", expenseController.get);
    route.post("/add", (req, res) => expenseController.create(req, res));
    route.put("/update", (req, res) => expenseController.update(req, res));
    route.delete("/:id", (req, res) => expenseController.delete(req, res));
    // route.post("/expenses/process-recurring", expenseController.processRecurring);
    route.get("/expenses/stats", expenseController.stats);

    // Category routes
    route.get("/categories", categoryController.expenseCategories);
    route.get("/categories/list", categoryController.list);
    route.post("/categories", categoryController.create);
    route.put("/categories", categoryController.update);
    route.delete("/categories/:id", categoryController.delete);

    this.route.use('/expense', route)
  }

  ledgerRoutes() {
    const ledgerController = LedgerController.init();
    const route = express.Router();

    // Expense routes
    route.get("", ledgerController.getLedger.bind(ledgerController));
    route.get("/summary", ledgerController.getLedgerSummary);

    this.route.use('/ledger', route)
  }
}
