"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleTypeEnum = exports.LoanTypeEnum = exports.PaymentStatusEnum = exports.OrderStatusEnum = exports.RecurringIntervalEnum = exports.PaymentMethodEnum = exports.TransactionStatusEnum = exports.LoanTransactionEnum = exports.TransactionTypeEnum = exports.AccountTypeEnum = exports.PaymentSourceEnum = exports.StatusEnum = exports.UserTypeEnum = void 0;
var UserTypeEnum;
(function (UserTypeEnum) {
    UserTypeEnum["Admin"] = "admin";
    UserTypeEnum["Customer"] = "customer";
})(UserTypeEnum = exports.UserTypeEnum || (exports.UserTypeEnum = {}));
var StatusEnum;
(function (StatusEnum) {
    StatusEnum["Active"] = "Active";
    StatusEnum["Inactive"] = "Inactive";
    StatusEnum["Deleted"] = "Deleted";
})(StatusEnum = exports.StatusEnum || (exports.StatusEnum = {}));
var PaymentSourceEnum;
(function (PaymentSourceEnum) {
    PaymentSourceEnum["CASH"] = "CASH";
    PaymentSourceEnum["JAZZCASH"] = "JAZZCASH";
    PaymentSourceEnum["EASYPASA"] = "EASYPASA";
    PaymentSourceEnum["BANK"] = "BANK";
})(PaymentSourceEnum = exports.PaymentSourceEnum || (exports.PaymentSourceEnum = {}));
var AccountTypeEnum;
(function (AccountTypeEnum) {
    AccountTypeEnum["Savings"] = "Savings";
    AccountTypeEnum["Current"] = "Current";
    AccountTypeEnum["FixedDeposit"] = "FixedDeposit";
    AccountTypeEnum["Loan"] = "Loan";
})(AccountTypeEnum = exports.AccountTypeEnum || (exports.AccountTypeEnum = {}));
var TransactionTypeEnum;
(function (TransactionTypeEnum) {
    TransactionTypeEnum["Deposit"] = "Deposit";
    TransactionTypeEnum["Withdrawal"] = "Withdrawal";
    TransactionTypeEnum["Transfer"] = "Transfer";
    TransactionTypeEnum["Payment"] = "Payment";
    TransactionTypeEnum["Expense"] = "Expense";
})(TransactionTypeEnum = exports.TransactionTypeEnum || (exports.TransactionTypeEnum = {}));
var LoanTransactionEnum;
(function (LoanTransactionEnum) {
    LoanTransactionEnum["DEBIT"] = "Debit";
    LoanTransactionEnum["CREDIT"] = "Credit";
})(LoanTransactionEnum = exports.LoanTransactionEnum || (exports.LoanTransactionEnum = {}));
var TransactionStatusEnum;
(function (TransactionStatusEnum) {
    TransactionStatusEnum["Pending"] = "Pending";
    TransactionStatusEnum["Completed"] = "Completed";
    TransactionStatusEnum["Reversed"] = "Reversed";
    TransactionStatusEnum["Failed"] = "Failed";
})(TransactionStatusEnum = exports.TransactionStatusEnum || (exports.TransactionStatusEnum = {}));
var PaymentMethodEnum;
(function (PaymentMethodEnum) {
    PaymentMethodEnum["Cash"] = "Cash";
    PaymentMethodEnum["Cheque"] = "Cheque";
    PaymentMethodEnum["BankTransfer"] = "BankTransfer";
    PaymentMethodEnum["Card"] = "Card";
    PaymentMethodEnum["Online"] = "Online";
})(PaymentMethodEnum = exports.PaymentMethodEnum || (exports.PaymentMethodEnum = {}));
var RecurringIntervalEnum;
(function (RecurringIntervalEnum) {
    RecurringIntervalEnum["Daily"] = "Daily";
    RecurringIntervalEnum["Weekly"] = "Weekly";
    RecurringIntervalEnum["Monthly"] = "Monthly";
    RecurringIntervalEnum["Yearly"] = "Yearly";
})(RecurringIntervalEnum = exports.RecurringIntervalEnum || (exports.RecurringIntervalEnum = {}));
var OrderStatusEnum;
(function (OrderStatusEnum) {
    OrderStatusEnum["pending"] = "pending";
    OrderStatusEnum["complete"] = "complete";
    OrderStatusEnum["rejected"] = "rejected";
})(OrderStatusEnum = exports.OrderStatusEnum || (exports.OrderStatusEnum = {}));
var PaymentStatusEnum;
(function (PaymentStatusEnum) {
    PaymentStatusEnum["pending"] = "pending";
    PaymentStatusEnum["complete"] = "complete";
    PaymentStatusEnum["rejected"] = "rejected";
})(PaymentStatusEnum = exports.PaymentStatusEnum || (exports.PaymentStatusEnum = {}));
var LoanTypeEnum;
(function (LoanTypeEnum) {
    LoanTypeEnum["money"] = "MONEY";
    LoanTypeEnum["items"] = "ITEMS";
})(LoanTypeEnum = exports.LoanTypeEnum || (exports.LoanTypeEnum = {}));
var ModuleTypeEnum;
(function (ModuleTypeEnum) {
    ModuleTypeEnum["loanTakers"] = "loanTakers";
    ModuleTypeEnum["distributors"] = "distributors";
    ModuleTypeEnum["expenses"] = "expenses";
})(ModuleTypeEnum = exports.ModuleTypeEnum || (exports.ModuleTypeEnum = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW51bS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb25zdGFudHMvZW51bS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxJQUFZLFlBR1g7QUFIRCxXQUFZLFlBQVk7SUFDdEIsK0JBQWUsQ0FBQTtJQUNmLHFDQUFxQixDQUFBO0FBQ3ZCLENBQUMsRUFIVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUd2QjtBQUNELElBQVksVUFJWDtBQUpELFdBQVksVUFBVTtJQUNwQiwrQkFBaUIsQ0FBQTtJQUNqQixtQ0FBcUIsQ0FBQTtJQUNyQixpQ0FBbUIsQ0FBQTtBQUNyQixDQUFDLEVBSlcsVUFBVSxHQUFWLGtCQUFVLEtBQVYsa0JBQVUsUUFJckI7QUFFRCxJQUFZLGlCQUtYO0FBTEQsV0FBWSxpQkFBaUI7SUFDM0Isa0NBQWEsQ0FBQTtJQUNiLDBDQUFxQixDQUFBO0lBQ3JCLDBDQUFxQixDQUFBO0lBQ3JCLGtDQUFhLENBQUE7QUFDZixDQUFDLEVBTFcsaUJBQWlCLEdBQWpCLHlCQUFpQixLQUFqQix5QkFBaUIsUUFLNUI7QUFFRCxJQUFZLGVBS1g7QUFMRCxXQUFZLGVBQWU7SUFDekIsc0NBQW1CLENBQUE7SUFDbkIsc0NBQW1CLENBQUE7SUFDbkIsZ0RBQTZCLENBQUE7SUFDN0IsZ0NBQWEsQ0FBQTtBQUNmLENBQUMsRUFMVyxlQUFlLEdBQWYsdUJBQWUsS0FBZix1QkFBZSxRQUsxQjtBQUVELElBQVksbUJBTVg7QUFORCxXQUFZLG1CQUFtQjtJQUM3QiwwQ0FBbUIsQ0FBQTtJQUNuQixnREFBeUIsQ0FBQTtJQUN6Qiw0Q0FBcUIsQ0FBQTtJQUNyQiwwQ0FBbUIsQ0FBQTtJQUNuQiwwQ0FBbUIsQ0FBQTtBQUNyQixDQUFDLEVBTlcsbUJBQW1CLEdBQW5CLDJCQUFtQixLQUFuQiwyQkFBbUIsUUFNOUI7QUFFRCxJQUFZLG1CQUdYO0FBSEQsV0FBWSxtQkFBbUI7SUFDN0Isc0NBQWUsQ0FBQTtJQUNmLHdDQUFpQixDQUFBO0FBQ25CLENBQUMsRUFIVyxtQkFBbUIsR0FBbkIsMkJBQW1CLEtBQW5CLDJCQUFtQixRQUc5QjtBQUVELElBQVkscUJBS1g7QUFMRCxXQUFZLHFCQUFxQjtJQUMvQiw0Q0FBbUIsQ0FBQTtJQUNuQixnREFBdUIsQ0FBQTtJQUN2Qiw4Q0FBcUIsQ0FBQTtJQUNyQiwwQ0FBaUIsQ0FBQTtBQUNuQixDQUFDLEVBTFcscUJBQXFCLEdBQXJCLDZCQUFxQixLQUFyQiw2QkFBcUIsUUFLaEM7QUFFRCxJQUFZLGlCQU1YO0FBTkQsV0FBWSxpQkFBaUI7SUFDM0Isa0NBQWEsQ0FBQTtJQUNiLHNDQUFpQixDQUFBO0lBQ2pCLGtEQUE2QixDQUFBO0lBQzdCLGtDQUFhLENBQUE7SUFDYixzQ0FBaUIsQ0FBQTtBQUNuQixDQUFDLEVBTlcsaUJBQWlCLEdBQWpCLHlCQUFpQixLQUFqQix5QkFBaUIsUUFNNUI7QUFFRCxJQUFZLHFCQUtYO0FBTEQsV0FBWSxxQkFBcUI7SUFDL0Isd0NBQWUsQ0FBQTtJQUNmLDBDQUFpQixDQUFBO0lBQ2pCLDRDQUFtQixDQUFBO0lBQ25CLDBDQUFpQixDQUFBO0FBQ25CLENBQUMsRUFMVyxxQkFBcUIsR0FBckIsNkJBQXFCLEtBQXJCLDZCQUFxQixRQUtoQztBQUVELElBQVksZUFJWDtBQUpELFdBQVksZUFBZTtJQUN6QixzQ0FBbUIsQ0FBQTtJQUNuQix3Q0FBcUIsQ0FBQTtJQUNyQix3Q0FBcUIsQ0FBQTtBQUN2QixDQUFDLEVBSlcsZUFBZSxHQUFmLHVCQUFlLEtBQWYsdUJBQWUsUUFJMUI7QUFFRCxJQUFZLGlCQUlYO0FBSkQsV0FBWSxpQkFBaUI7SUFDM0Isd0NBQW1CLENBQUE7SUFDbkIsMENBQXFCLENBQUE7SUFDckIsMENBQXFCLENBQUE7QUFDdkIsQ0FBQyxFQUpXLGlCQUFpQixHQUFqQix5QkFBaUIsS0FBakIseUJBQWlCLFFBSTVCO0FBRUQsSUFBWSxZQUdYO0FBSEQsV0FBWSxZQUFZO0lBQ3RCLCtCQUFlLENBQUE7SUFDZiwrQkFBZSxDQUFBO0FBQ2pCLENBQUMsRUFIVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUd2QjtBQUdELElBQVksY0FJWDtBQUpELFdBQVksY0FBYztJQUN4QiwyQ0FBeUIsQ0FBQTtJQUN6QiwrQ0FBNkIsQ0FBQTtJQUM3Qix1Q0FBcUIsQ0FBQTtBQUN2QixDQUFDLEVBSlcsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFJekIifQ==