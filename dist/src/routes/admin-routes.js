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
        return this.app;
    }
    distributorRoutes() {
        const route = express_1.default.Router();
        const controller = controller_1.DistributorController.init();
        // route.post("/create", controller.storeCategory);
        route.get("/list", controller.list);
        route.post("/add", controller.save);
        route.post("/update", controller.update);
        route.post("/update-status", controller.updateStatus);
        route.post("/delete", controller.del);
        this.route.use("/distributor", route);
    }
    loanTakerRoutes() {
        const route = express_1.default.Router();
        const controller = controller_1.LoanTakerController.init();
        route.get("/list", controller.list);
        route.post("/add", controller.save);
        route.post("/update", controller.update);
        route.post("/detail", controller.detail);
        route.post("/update-status", controller.updateStatus);
        route.post("/delete", controller.del);
        route.post("/loan/loans-list", controller.loanList);
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
        route.post("/detail", controller.detail);
        route.post("/downloadPdf", controller.downloadPdf);
        route.post("/add", controller.save);
        route.post("/update", controller.update);
        route.post("/update-status", controller.updateStatus);
        route.post("/delete", controller.del);
        this.route.use("/daily-closing", route);
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
}
exports.AdminRoutes = AdminRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRtaW4tcm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JvdXRlcy9hZG1pbi1yb3V0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsc0RBQTBEO0FBQzFELG1EQUErQztBQUMvQyxnRkFBMkU7QUFDM0UsMERBVW1DO0FBRW5DLGdEQUFnRDtBQUVoRCxNQUFhLFdBQVksU0FBUSw0QkFBWTtJQUUzQyxZQUFZLEdBQXdCO1FBQ2xDLEtBQUssQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsS0FBSyxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFOUIsK0JBQStCO1FBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUNWLFlBQVksRUFDWixJQUFJLDJDQUFtQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQ3hDLElBQUksQ0FBQyxLQUFLLENBQ1gsQ0FBQztRQUNGLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDOUIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ2xCLENBQUM7SUFFRCxpQkFBaUI7UUFDZixNQUFNLEtBQUssR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQy9CLE1BQU0sVUFBVSxH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LENBQUM7UUFDcEQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pDLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3RELEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsc0JBQXNCO1FBQ3BCLE1BQU0sS0FBSyxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDL0IsTUFBTSxVQUFVLEdBQUcsdUNBQTBCLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDckQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pDLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3RELEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVB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