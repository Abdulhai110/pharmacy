"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistributorCreditController = exports.DistributorDebitController = exports.LoanTransactionController = exports.TodayTransactions = exports.DistributorController = exports.LoanTakerController = exports.LoanController = exports.DailyClosing = exports.DailyLedger = exports.Controller = void 0;
const DailyLedger_1 = require("./DailyLedger");
Object.defineProperty(exports, "DailyLedger", { enumerable: true, get: function () { return DailyLedger_1.DailyLedger; } });
const DailyClosing_1 = require("./DailyClosing");
Object.defineProperty(exports, "DailyClosing", { enumerable: true, get: function () { return DailyClosing_1.DailyClosing; } });
const LoanController_1 = require("./LoanController");
Object.defineProperty(exports, "LoanController", { enumerable: true, get: function () { return LoanController_1.LoanController; } });
const LoanTakerController_1 = require("./LoanTakerController");
Object.defineProperty(exports, "LoanTakerController", { enumerable: true, get: function () { return LoanTakerController_1.LoanTakerController; } });
const TodayLoanTransactions_1 = require("./TodayLoanTransactions");
Object.defineProperty(exports, "TodayTransactions", { enumerable: true, get: function () { return TodayLoanTransactions_1.TodayTransactions; } });
const DistributorController_1 = require("./DistributorController");
Object.defineProperty(exports, "DistributorController", { enumerable: true, get: function () { return DistributorController_1.DistributorController; } });
const LoanTransactionController_1 = require("./LoanTransactionController");
Object.defineProperty(exports, "LoanTransactionController", { enumerable: true, get: function () { return LoanTransactionController_1.LoanTransactionController; } });
const DistributorDebitController_1 = require("./DistributorDebitController");
Object.defineProperty(exports, "DistributorDebitController", { enumerable: true, get: function () { return DistributorDebitController_1.DistributorDebitController; } });
const DistributorCreditController_1 = require("./DistributorCreditController");
Object.defineProperty(exports, "DistributorCreditController", { enumerable: true, get: function () { return DistributorCreditController_1.DistributorCreditController; } });
class Controller {
}
exports.Controller = Controller;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb250cm9sbGVycy9jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtDQUE0QztBQVkxQyw0RkFaTyx5QkFBVyxPQVlQO0FBWGIsaURBQThDO0FBWTVDLDZGQVpPLDJCQUFZLE9BWVA7QUFYZCxxREFBa0Q7QUFZaEQsK0ZBWk8sK0JBQWMsT0FZUDtBQVhoQiwrREFBNEQ7QUFZMUQsb0dBWk8seUNBQW1CLE9BWVA7QUFYckIsbUVBQTREO0FBYTFELGtHQWJPLHlDQUFpQixPQWFQO0FBWm5CLG1FQUFnRTtBQVc5RCxzR0FYTyw2Q0FBcUIsT0FXUDtBQVZ2QiwyRUFBd0U7QUFZdEUsMEdBWk8scURBQXlCLE9BWVA7QUFYM0IsNkVBQTBFO0FBWXhFLDJHQVpPLHVEQUEwQixPQVlQO0FBWDVCLCtFQUE0RTtBQVkxRSw0R0FaTyx5REFBMkIsT0FZUDtBQVY3QixNQUFhLFVBQVU7Q0FBRztBQUExQixnQ0FBMEIifQ==