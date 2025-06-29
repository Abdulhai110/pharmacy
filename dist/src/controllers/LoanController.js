"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanController = void 0;
const date_fns_1 = require("date-fns");
const loan_1 = require("../models/loan");
const joi_1 = __importDefault(require("joi"));
const { Op } = require("sequelize");
const helper_1 = require("../helpers/helper");
const loanTaker_1 = require("../models/loanTaker");
const respHandler_1 = require("../utils/respHandler");
const logger_1 = __importDefault(require("../utils/logger"));
const enum_1 = require("../constants/enum");
const connection_1 = require("../config/connection");
const BankAccounts_1 = require("../models/BankAccounts");
const BankTransactions_1 = require("../models/BankTransactions");
class LoanController {
    constructor() { }
    static init() {
        if (this.instance == null) {
            this.instance = new LoanController();
        }
        return this.instance;
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { limit, offset, orderBy, id, order, billNo, status, loanType, date } = req.query;
                let orderQuery = [];
                if (orderBy && order) {
                    orderQuery.push([orderBy, order]);
                }
                let where = {};
                if (id)
                    where["loanTakerId"] = id;
                if (billNo)
                    where["billNo"] = { [Op.like]: billNo };
                if (status)
                    where["status"] = { [Op.eq]: status };
                if (loanType)
                    where["loanType"] = { [Op.eq]: loanType };
                if (date) {
                    const parsedDate = new Date(date);
                    where["date"] = {
                        [Op.between]: [
                            (0, date_fns_1.startOfDay)(parsedDate),
                            (0, date_fns_1.endOfDay)(parsedDate)
                        ]
                    };
                }
                let data = yield loan_1.Loan.findAndCountAll({ where, order: orderQuery, distinct: true, limit: Number(limit), offset: Number(offset) });
                return respHandler_1.ResponseHandler.success(res, "List retrieved successfully", (0, helper_1.paging)(data, Number(offset), Number(limit)), 200);
            }
            catch (err) {
                logger_1.default.error("Error fetching loans", { error: err });
                return respHandler_1.ResponseHandler.error(res, "Internal Server Error", 500, err);
            }
        });
    }
    save(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                id: joi_1.default.optional(),
                loanTakerId: joi_1.default.number().required(),
                loanType: joi_1.default.string().valid(...(0, helper_1.enumKeys)(enum_1.LoanTypeEnum)).required(),
                amount: joi_1.default.number().integer().min(1).required(),
                billNo: joi_1.default.number().integer().optional(),
                description: joi_1.default.allow(null, '').optional(),
                paymentSourceId: joi_1.default.alternatives().conditional('loanType', {
                    is: enum_1.LoanTypeEnum.money,
                    then: joi_1.default.number().greater(0).required(),
                    otherwise: joi_1.default.any().forbidden(),
                }),
                date: joi_1.default.string().required(),
                status: joi_1.default.optional(),
            });
            const { error, value } = schema.validate(req.body);
            if (error) {
                logger_1.default.warn("Validation error", { error: error.details[0].message });
                return respHandler_1.ResponseHandler.error(res, error.details[0].message, 400);
            }
            const t = yield connection_1.sequelize.transaction();
            try {
                // Step 1: Handle account balance check if payment source is provided
                if (value.paymentSourceId && value.paymentSourceId > 0) {
                    const account = yield BankAccounts_1.Account.findByPk(Number(value.paymentSourceId), { transaction: t });
                    if (!account) {
                        yield t.rollback();
                        return respHandler_1.ResponseHandler.error(res, "Invalid account/payment source", 404);
                    }
                    if (Number(account.balance) < Number(value.amount)) {
                        yield t.rollback();
                        return respHandler_1.ResponseHandler.error(res, "Insufficient account balance", 400);
                    }
                    // Deduct the amount
                    account.balance = Number(account.balance) - Number(value.amount);
                    yield account.save({ transaction: t });
                    // await this.createTransaction({
                    //   transactionType: TransactionTypeEnum.Withdrawal,
                    //   amount: value.amount,
                    //   description: value.description || `Loan issued`,
                    //   accountId: value.paymentSourceId,
                    //   refrenceNumber: `LOAN-${Date.now()}`,
                    //   paymentMethod: PaymentMethodEnum.BankTransfer,
                    //   transaction: t
                    // });
                }
                // Step 2: Save loan
                const loan = yield loan_1.Loan.create(value, { transaction: t });
                // Step 3: Update LoanTaker
                const loanTaker = yield loanTaker_1.LoanTaker.findByPk(value.loanTakerId, { transaction: t });
                if (!loanTaker) {
                    yield t.rollback();
                    return respHandler_1.ResponseHandler.error(res, "Invalid Loan Taker ID", 404);
                }
                loanTaker.loanAmount += value.amount;
                loanTaker.remainingAmount += value.amount;
                yield loanTaker.save({ transaction: t });
                yield t.commit();
                return respHandler_1.ResponseHandler.success(res, "Loan added successfully", loan, 201);
            }
            catch (err) {
                yield t.rollback();
                logger_1.default.error("Error saving loan", { error: err });
                return respHandler_1.ResponseHandler.error(res, "Error in adding record", 500, err);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                id: joi_1.default.number().required(),
                loanTakerId: joi_1.default.number().required(),
                loanType: joi_1.default.string().valid(...(0, helper_1.enumKeys)(enum_1.LoanTypeEnum)).optional(),
                amount: joi_1.default.number().integer().min(1).optional(),
                billNo: joi_1.default.number().integer().optional(),
                description: joi_1.default.string().optional(),
                status: joi_1.default.optional(),
                returnDate: joi_1.default.optional(),
                installmentCount: joi_1.default.optional(),
                installmentAmount: joi_1.default.optional(),
            });
            const { error, value } = schema.validate(req.body);
            if (error) {
                logger_1.default.warn("Validation error", { error: error.details[0].message });
                return respHandler_1.ResponseHandler.error(res, error.details[0].message, 400);
            }
            try {
                const updated = yield loan_1.Loan.update(value, { where: { id: value.id } });
                if (!updated[0])
                    return respHandler_1.ResponseHandler.error(res, "No record found or no change made", 404);
                const updatedLoan = yield loan_1.Loan.findByPk(value.id);
                return respHandler_1.ResponseHandler.success(res, "Updated successfully", updatedLoan, 200);
            }
            catch (err) {
                logger_1.default.error("Error updating loan", { error: err });
                return respHandler_1.ResponseHandler.error(res, "Error updating record", 500, err);
            }
        });
    }
    createTransaction({ transactionType, amount, description, accountId, refrenceNumber = '', paymentMethod, transaction }) {
        return __awaiter(this, void 0, void 0, function* () {
            const txn = yield BankTransactions_1.Transaction.create({
                transactionType,
                amount,
                description,
                accountId,
                refrenceNumber,
                paymentMethod,
                status: enum_1.TransactionStatusEnum.Completed
            }, { transaction });
            return txn;
        });
    }
    detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({ id: joi_1.default.number().required() });
            const { error, value } = schema.validate(req.body);
            if (error)
                return respHandler_1.ResponseHandler.error(res, error.details[0].message, 400);
            try {
                const result = yield loan_1.Loan.findByPk(value.id);
                if (!result)
                    return respHandler_1.ResponseHandler.error(res, "Data not found", 404);
                return respHandler_1.ResponseHandler.success(res, "Detail retrieved successfully", result, 200);
            }
            catch (err) {
                logger_1.default.error("Error fetching loan detail", { error: err });
                return respHandler_1.ResponseHandler.error(res, "Internal Server Error", 500, err);
            }
        });
    }
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({ id: joi_1.default.number().required(), status: joi_1.default.string().required() });
            const { error, value } = schema.validate(req.body);
            if (error)
                return respHandler_1.ResponseHandler.error(res, error.details[0].message, 400);
            try {
                const updated = yield loan_1.Loan.update({ status: value.status }, { where: { id: value.id } });
                if (!updated[0])
                    return respHandler_1.ResponseHandler.error(res, "Record not found or no change made", 404);
                return respHandler_1.ResponseHandler.success(res, "Status updated successfully", null, 200);
            }
            catch (err) {
                logger_1.default.error("Error updating loan status", { error: err });
                return respHandler_1.ResponseHandler.error(res, "Internal Server Error", 500, err);
            }
        });
    }
    del(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({ id: joi_1.default.number().required() });
            const { error, value } = schema.validate(req.body);
            if (error)
                return respHandler_1.ResponseHandler.error(res, error.details[0].message, 400);
            try {
                const deleted = yield loan_1.Loan.destroy({ where: { id: value.id } });
                if (!deleted)
                    return respHandler_1.ResponseHandler.error(res, "Record not found", 404);
                return respHandler_1.ResponseHandler.success(res, "Successfully deleted", null, 200);
            }
            catch (err) {
                logger_1.default.error("Error deleting loan", { error: err });
                return respHandler_1.ResponseHandler.error(res, "Internal Server Error", 500, err);
            }
        });
    }
}
LoanController.instance = null;
exports.LoanController = LoanController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9hbkNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29udHJvbGxlcnMvTG9hbkNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQWdEO0FBRWhELHlDQUFzQztBQUN0Qyw4Q0FBc0I7QUFFdEIsTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNwQyw4Q0FBcUQ7QUFDckQsbURBQWdEO0FBQ2hELHNEQUF1RDtBQUN2RCw2REFBcUM7QUFDckMsNENBQXFJO0FBQ3JJLHFEQUFpRDtBQUNqRCx5REFBaUQ7QUFDakQsaUVBQXlEO0FBRXpELE1BQWEsY0FBYztJQUd6QixnQkFBd0IsQ0FBQztJQUV6QixNQUFNLENBQUMsSUFBSTtRQUNULElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLEVBQUU7WUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1NBQ3RDO1FBQ0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFSyxJQUFJLENBQUMsR0FBb0IsRUFBRSxHQUFxQjs7WUFDcEQsSUFBSTtnQkFDRixJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO2dCQUV0RixJQUFJLFVBQVUsR0FBK0IsRUFBRSxDQUFDO2dCQUNoRCxJQUFJLE9BQU8sSUFBSSxLQUFLLEVBQUU7b0JBQ3BCLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFpQixFQUFFLEtBQXVCLENBQUMsQ0FBQyxDQUFDO2lCQUMvRDtnQkFBQyxJQUFJLEtBQUssR0FBUSxFQUFFLENBQUM7Z0JBRXRCLElBQUksRUFBRTtvQkFB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