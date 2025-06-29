"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const routes_config_1 = require("./routes.config");
const admin_auth_middleware_1 = require("../middlewares/admin-auth-middleware");
const controller_1 = require("../controllers/controller");
const bank_account_controller_1 = require("../controllers/bank-account.controller");
const bank_controller_1 = require("../controllers/bank.controller");
const expense_controller_1 = require("../controllers/expense.controller");
const expense_category_controller_1 = require("../controllers/expense-category.controller");
const LedgerController_1 = require("../controllers/LedgerController");
// import {uploadFiles} from "../helpers/helper"
class AdminRoutes extends routes_config_1.RoutesConfig {
    constructor(app) {
        super(app, "AdminRoutes");
    }
    configureRoutes() {
        this.route = express_1.default.Router();
        // this.app.use('/api/admin', )
        this.app.use("/api/admin", new admin_auth_middleware_1.AdminAuthMiddleware(this.app).handle, this.route);
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
        const route = express_1.default.Router();
        const controller = controller_1.DistributorController.init();
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
        const route = express_1.default.Router();
        const controller = controller_1.LoanTakerController.init();
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
        const route = express_1.default.Router();
        const controller = controller_1.LoanController.init();
        route.get("/list", controller.list);
        route.post("/detail", controller.detail);
        route.post("/add", controller.save);
        route.post("/update", controller.update);
        route.post("/update-status", controller.updateStatus);
        route.post("/delete", controller.del);
        this.route.use("/loan", route);
    }
    loanTransactionRoutes() {
        const route = express_1.default.Router();
        const controller = controller_1.LoanTransactionController.init();
        route.get("/list", controller.list);
        route.post("/detail", controller.detail);
        route.post("/add", controller.save);
        route.post("/update", controller.update);
        route.post("/update-status", controller.updateStatus);
        route.post("/delete", controller.del);
        this.route.use("/loan-transaction", route);
    }
    distributorDebitRoutes() {
        const route = express_1.default.Router();
        const controller = controller_1.DistributorDebitController.init();
        route.get("/list", controller.list);
        route.post("/detail", controller.detail);
        route.post("/add", controller.save);
        route.post("/update", controller.update);
        route.post("/update-status", controller.updateStatus);
        route.post("/delete", controller.del);
        this.route.use("/distributor-debit", route);
    }
    distributorCreditRoutes() {
        const route = express_1.default.Router();
        const controller = controller_1.DistributorCreditController.init();
        route.get("/list", controller.list);
        route.post("/detail", controller.detail);
        route.post("/add", controller.save);
        route.post("/update", controller.update);
        route.post("/update-status", controller.updateStatus);
        route.post("/delete", controller.del);
        this.route.use("/distributor-credit", route);
    }
    dailyClosingRoutes() {
        const route = express_1.default.Router();
        const controller = controller_1.DailyClosing.init();
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
        const route = express_1.default.Router();
        const controller = controller_1.DailyLedger.init();
        route.get("/list", controller.list);
        route.post("/detail", controller.detail);
        route.post("/add", controller.save);
        route.post("/update", controller.update);
        route.post("/update-status", controller.updateStatus);
        route.post("/delete", controller.del);
        this.route.use("/ledger", route);
    }
    todayLoansTransactions() {
        const route = express_1.default.Router();
        const controller = controller_1.TodayTransactions.init();
        route.get("/loan-transactions", controller.todayLoanTransactions);
        route.get("/distributors-transactions", controller.todayDistributorsTransactions);
        route.get("/list", controller.list);
        route.post("/detail", controller.detail);
        route.post("/add", controller.save);
        route.post("/update", controller.update);
        route.post("/update-status", controller.updateStatus);
        route.post("/delete", controller.del);
        this.route.use("/today", route);
    }
    bankAccountRoutes() {
        const route = express_1.default.Router();
        const controller = bank_account_controller_1.AccountController.init(); // Use init() instead of new
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
        const route = express_1.default.Router();
        const allBanks = express_1.default.Router();
        const controller = bank_controller_1.BankController.init();
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
        const expenseController = expense_controller_1.ExpenseController.init();
        const categoryController = expense_category_controller_1.ExpenseCategoryController.init();
        const route = express_1.default.Router();
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
        this.route.use('/expense', route);
    }
    ledgerRoutes() {
        const ledgerController = LedgerController_1.LedgerController.init();
        const route = express_1.default.Router();
        // Expense routes
        route.get("", ledgerController.getLedger.bind(ledgerController));
        route.get("/summary", ledgerController.getLedgerSummary);
        this.route.use('/ledger', route);
    }
}
exports.AdminRoutes = AdminRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4tcm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JvdXRlcy9hZG1pbi1yb3V0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsc0RBQTBEO0FBQzFELG1EQUErQztBQUMvQyxnRkFBMkU7QUFDM0UsMERBVW1DO0FBQ25DLG9GQUEyRTtBQUMzRSxvRUFBZ0U7QUFDaEUsMEVBQXNFO0FBQ3RFLDRGQUF1RjtBQUN2RixzRUFBbUU7QUFFbkUsZ0RBQWdEO0FBRWhELE1BQWEsV0FBWSxTQUFRLDRCQUFZO0lBRTNDLFlBQVksR0FBd0I7UUFDbEMsS0FBSyxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksQ0FBQyxLQUFLLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUU5QiwrQkFBK0I7UUFDL0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQ1YsWUFBWSxFQUNaLElBQUksMkNBQW1CLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFDeEMsSUFBSSxDQUFDLEtBQUssQ0FDWCxDQUFDO1FBQ0YsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsVUFB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