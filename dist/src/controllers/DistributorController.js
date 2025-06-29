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
exports.DistributorController = void 0;
const distributor_1 = require("../models/distributor");
const joi_1 = __importDefault(require("joi"));
const sequelize_1 = require("sequelize");
const { Op } = require("sequelize");
const helper_1 = require("../helpers/helper");
const respHandler_1 = require("../utils/respHandler");
const logger_1 = __importDefault(require("../utils/logger"));
const DistributorDebit_1 = require("../models/DistributorDebit");
const connection_1 = require("../config/connection");
const DistributorCredit_1 = require("../models/DistributorCredit");
const BankAccounts_1 = require("../models/BankAccounts");
const cloudinary = require("cloudinary").v2;
class DistributorController {
    constructor() { }
    static init() {
        if (this.instance == null) {
            this.instance = new DistributorController();
        }
        return this.instance;
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let qp = req.query;
                let perPage = Number(qp.perPage) > 0 ? Number(qp.perPage) : 10;
                let pageNo = qp.page ? (Number(qp.page) > 0 ? Number(qp.page) - 1 : 0) : 0;
                let order = [];
                if (qp.orderBy && qp.order) {
                    order.push([qp.orderBy, qp.order]);
                }
                const where = {};
                if (qp.keyword) {
                    where["name"] = { [Op.like]: `%${qp.keyword}%` };
                }
                if (qp.cname) {
                    where["companyName"] = { [Op.like]: `%${qp.cname}%` };
                }
                if (qp.status) {
                    where["status"] = { [Op.eq]: qp.status };
                }
                let pagination = qp.page ? { offset: perPage * pageNo, limit: perPage } : {};
                const data = yield distributor_1.Distributor.findAndCountAll(Object.assign({ where,
                    order, distinct: true }, pagination));
                logger_1.default.info(`Fetched distributor list with filters: ${JSON.stringify(qp)}`);
                // ✅ Always return the same response structure
                return respHandler_1.ResponseHandler.success(res, "List retrieved", (0, helper_1.paging)(data, pageNo + 1, perPage) // pageNo starts from 0, so add 1 for correct page number
                );
            }
            catch (error) {
                logger_1.default.error("Error fetching distributor list", { error });
                return respHandler_1.ResponseHandler.error(res, "Error fetching distributor list", 500, error);
            }
        });
    }
    distributors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let qp = req.query;
                let perPage = Number(qp.perPage) > 0 ? Number(qp.perPage) : 10;
                let pageNo = qp.page ? (Number(qp.page) > 0 ? Number(qp.page) - 1 : 0) : 0;
                const where = {};
                if (qp.keyword) {
                    where["name"] = { [Op.like]: `%${qp.keyword}%` };
                }
                const data = yield distributor_1.Distributor.findAndCountAll({
                    where
                });
                logger_1.default.info(`Fetched distributor list with filters: ${JSON.stringify(qp)}`);
                // ✅ Always return the same response structure
                return respHandler_1.ResponseHandler.success(res, "Distributors list retrieved", (0, helper_1.paging)(data, pageNo + 1, perPage) // pageNo starts from 0, so add 1 for correct page number
                );
            }
            catch (error) {
                logger_1.default.error("Error fetching distributor list", { error });
                return respHandler_1.ResponseHandler.error(res, "Error fetching distributor list", 500, error);
            }
        });
    }
    save(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                id: joi_1.default.optional(),
                name: joi_1.default.string().required(),
                description: joi_1.default.allow(null, '').optional(),
                companyName: joi_1.default.string().required(),
                phoneNo: joi_1.default.string().required(),
                status: joi_1.default.optional(),
            });
            const { error, value } = schema.validate(req.body);
            if (error) {
                return respHandler_1.ResponseHandler.error(res, error.details[0].message, 400);
            }
            const catData = Object.assign(Object.assign({}, value), { createdAt: new Date(), updatedAt: new Date() });
            try {
                const instance = yield distributor_1.Distributor.create(catData);
                logger_1.default.info(`Distributor added successfully: ${instance.id}`);
                return respHandler_1.ResponseHandler.success(res, "Added Successfully", instance);
            }
            catch (e) {
                logger_1.default.error("Error creating distributor", { error: e });
                return respHandler_1.ResponseHandler.error(res, "Error creating distributor", 500);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                id: joi_1.default.number().required(),
                name: joi_1.default.string().required(),
                description: joi_1.default.string().required(),
                companyName: joi_1.default.string().required(),
                phoneNo: joi_1.default.string().required(),
                status: joi_1.default.optional(),
            });
            const { error, value } = schema.validate(req.body);
            if (error) {
                return respHandler_1.ResponseHandler.error(res, error.details[0].message, 400);
            }
            try {
                const distributor = yield distributor_1.Distributor.findByPk(value.id);
                if (!distributor) {
                    return respHandler_1.ResponseHandler.error(res, "No Record Found", 404);
                }
                const updatedData = Object.assign(Object.assign({}, value), { updatedAt: new Date() });
                const [affectedRows] = yield distributor_1.Distributor.update(updatedData, {
                    where: { id: value.id },
                });
                if (affectedRows === 0) {
                    return respHandler_1.ResponseHandler.error(res, "Error updating record", 400);
                }
                const updatedDistributor = yield distributor_1.Distributor.findByPk(value.id);
                logger_1.default.info(`Distributor updated successfully: ${value.id}`);
                return respHandler_1.ResponseHandler.success(res, "Updated Successfully", updatedDistributor);
            }
            catch (e) {
                logger_1.default.error("Error updating distributor", { error: e });
                return respHandler_1.ResponseHandler.error(res, "Error updating record", 500);
            }
        });
    }
    transaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                distributorId: joi_1.default.number().required(),
                amount: joi_1.default.number().required().integer().min(1),
                paidAmount: joi_1.default.number().required().integer().min(0),
                billNo: joi_1.default.number().required().integer(),
                description: joi_1.default.string().optional(),
                installmentCount: joi_1.default.optional(),
                installmentAmount: joi_1.default.optional(),
                paymentSourceId: joi_1.default.string().when('paidAmount', {
                    is: joi_1.default.number().greater(0),
                    then: joi_1.default.string().required(),
                    otherwise: joi_1.default.string().optional(),
                }),
                date: joi_1.default.string().required(),
            });
            const { error, value } = schema.validate(req.body);
            if (error instanceof sequelize_1.ValidationError) {
                logger_1.default.warn("Validation failed", { error: error.details[0].message });
                return respHandler_1.ResponseHandler.error(res, error.details[0].message, 400);
            }
            const transaction = yield connection_1.sequelize.transaction();
            const { distributorId, amount, paidAmount, gstAmount, advTaxAmount, billNo, description, installmentCount, installmentAmount, paymentSourceId, date, status } = req.body;
            try {
                // Fetch distributor
                const distributor = yield distributor_1.Distributor.findOne({ where: { id: distributorId }, transaction });
                if (!distributor) {
                    yield transaction.rollback();
                    logger_1.default.warn("Distributor not found", { distributorId });
                    return respHandler_1.ResponseHandler.error(res, "Pass Correct Distributor ID", 400);
                }
                if (value.paymentSourceId && value.paymentSourceId > 0) {
                    const account = yield BankAccounts_1.Account.findByPk(Number(value.paymentSourceId), { transaction: transaction });
                    if (!account) {
                        yield transaction.rollback();
                        return respHandler_1.ResponseHandler.error(res, "Invalid account/payment source", 404);
                    }
                    if (Number(account.balance) < Number(amount)) {
                        yield transaction.rollback();
                        return respHandler_1.ResponseHandler.error(res, "Insufficient account balance", 400);
                    }
                    account.balance = Number(account.balance) - Number(value.amount);
                    yield account.save({ transaction: transaction });
                }
                const debitEntry = yield DistributorDebit_1.DistributorDebit.create({
                    distributorId: distributorId,
                    amount: Number(amount),
                    billNo: billNo !== null && billNo !== void 0 ? billNo : null,
                    description: description !== null && description !== void 0 ? description : null,
                    installmentAmount: installmentAmount !== null && installmentAmount !== void 0 ? installmentAmount : 0,
                    installmentCount: installmentCount !== null && installmentCount !== void 0 ? installmentCount : 0,
                    date,
                    status
                }, { transaction });
                let creditEntry = null;
                let updatedLoanAmount = distributor.loanAmount + Number(amount);
                let updatedPaidAmount = distributor.paidAmount;
                let updatedRemainingAmount = distributor.remainingAmount + Number(amount);
                // Conditionally create credit entry
                if (paidAmount || gstAmount || advTaxAmount) {
                    creditEntry = yield DistributorCredit_1.DistributorCredit.create({
                        distributorId: distributorId,
                        amount: Number(paidAmount),
                        gstAmount: Number(gstAmount),
                        advTaxAmount: Number(advTaxAmount),
                        description: description !== null && description !== void 0 ? description : null,
                        date: date,
                        paymentSourceId: paymentSourceId,
                        status
                    }, { transaction });
                    updatedPaidAmount += Number(paidAmount);
                    updatedRemainingAmount -= Number(paidAmount);
                }
                // Update distributor loan record
                yield distributor_1.Distributor.update({
                    loanAmount: updatedLoanAmount,
                    paidAmount: updatedPaidAmount,
                    remainingAmount: updatedRemainingAmount
                }, { where: { id: distributorId }, transaction });
                yield transaction.commit();
                logger_1.default.info("Distributor debit and conditional credit records created", {
                    distributorId,
                    updatedLoanAmount,
                    updatedPaidAmount,
                    updatedRemainingAmount
                });
                return respHandler_1.ResponseHandler.success(res, "Transaction successful", { debitEntry, creditEntry }, 201);
            }
            catch (e) {
                yield transaction.rollback();
                logger_1.default.error("Error in combined transaction", { error: e.message });
                return respHandler_1.ResponseHandler.error(res, "Error in transaction", 500, e);
            }
        });
    }
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // (global as any).log.info("Update Status");
            const schema = joi_1.default.object().keys({
                status: joi_1.default.string().required(),
                id: joi_1.default.number().required(),
            });
            const { error, value } = schema.validate(req.body);
            if (error instanceof sequelize_1.ValidationError) {
                res.Error(error.details[0].message);
                return;
            }
            const data = yield distributor_1.Distributor.update({ status: req.body.status }, { where: { id: req.body.id } });
            if (data == null) {
                res.Error("record not Found");
                return;
            }
            return res.Success("status updated successfully");
        });
    }
    // del user
    del(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield distributor_1.Distributor.destroy({
                    where: {
                        id: Number(req.body.id),
                    },
                });
            }
            catch (err) {
                console.log(err);
                res.Error("error in deleting distributor");
            }
            res.Success("Successfullt deleted");
        });
    }
}
DistributorController.instance = null;
exports.DistributorController = DistributorController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzdHJpYnV0b3JDb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnRyb2xsZXJzL0Rpc3RyaWJ1dG9yQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFFQSx1REFBb0Q7QUFDcEQsOENBQXNCO0FBQ3RCLHlDQUE0QztBQUM1QyxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3BDLDhDQUFxRDtBQUNyRCxzREFBdUQ7QUFDdkQsNkRBQXFDO0FBQ3JDLGlFQUE4RDtBQUM5RCxxREFBaUQ7QUFDakQsbUVBQWdFO0FBQ2hFLHlEQUFpRDtBQUVqRCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzVDLE1BQWEscUJBQXFCO0lBR2hDLGdCQUF3QixDQUFDO0lBRXpCLE1BQU0sQ0FBQyxJQUFJO1FBQ1QsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTtZQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUkscUJBQXFCLEVBQUUsQ0FBQztTQUM3QztRQUVELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBRVksSUFBSSxDQUFDLEdBQW9CLEVBQUUsR0FBcUI7O1lBQzNELElBQUk7Z0JBQ0YsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztnQkFDbkIsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDL0QsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FB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