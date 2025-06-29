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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanTakerController = void 0;
const loanTaker_1 = require("../models/loanTaker");
const joi_1 = __importDefault(require("joi"));
const { Op } = require("sequelize");
const helper_1 = require("../helpers/helper");
const loan_1 = require("../models/loan");
const loanTransaction_1 = require("../models/loanTransaction");
const respHandler_1 = require("../utils/respHandler");
const logger_1 = __importDefault(require("../utils/logger"));
const cloudinary = require("cloudinary").v2;
class LoanTakerController {
    constructor() { }
    static init() {
        if (this.instance == null) {
            this.instance = new LoanTakerController();
        }
        return this.instance;
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { limit, offset, orderBy, order, name, status, cnic, phoneNumber } = req.query;
                const where = {};
                if (name)
                    where["name"] = { [Op.like]: `%${name}%` };
                if (status)
                    where["status"] = { [Op.eq]: status };
                if (cnic)
                    where["cnic"] = { [Op.eq]: cnic };
                if (phoneNumber)
                    where["phoneNumber"] = { [Op.eq]: phoneNumber };
                const orderQuery = orderBy && order ? [[orderBy, order]] : [];
                const data = yield loanTaker_1.LoanTaker.findAndCountAll({
                    where,
                    order: orderQuery,
                    distinct: true,
                    limit: Number(limit),
                    offset: Number(offset),
                });
                logger_1.default.info(`Fetched loan takers successfully. Total records: ${data.count}`);
                return respHandler_1.ResponseHandler.success(res, "Loan takers fetched successfully", (0, helper_1.paging)(data, Number(offset), Number(limit)));
            }
            catch (error) {
                logger_1.default.error("Error fetching loan takers", { error });
                return respHandler_1.ResponseHandler.error(res, "Error fetching loan takers", 500, error);
            }
        });
    }
    loanTakers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { limit, offset, name } = req.query;
                const where = {};
                if (name)
                    where["name"] = { [Op.like]: `%${name}%` };
                const data = yield loanTaker_1.LoanTaker.findAndCountAll({
                    where
                });
                logger_1.default.info(`Fetched loan takers successfully. Total records: ${data.count}`);
                return respHandler_1.ResponseHandler.success(res, "Loan takers fetched successfully", (0, helper_1.paging)(data, Number(offset), Number(limit)));
            }
            catch (error) {
                logger_1.default.error("Error fetching loan takers", { error });
                return respHandler_1.ResponseHandler.error(res, "Error fetching loan takers", 500, error);
            }
        });
    }
    // Fetch loan list by loan taker ID
    loanList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate request body using Joi
                const schema = joi_1.default.object({
                    loanTakerId: joi_1.default.number().required(),
                    amount: joi_1.default.optional(),
                    date: joi_1.default.optional(),
                    billNo: joi_1.default.optional(),
                    loanType: joi_1.default.optional(),
                    status: joi_1.default.optional(),
                    limit: joi_1.default.optional(),
                    offset: joi_1.default.optional(),
                });
                const { error, value } = schema.validate(Object.assign(Object.assign({}, req.body), req.query));
                if (error) {
                    logger_1.default.warn(`Validation error: ${error.details[0].message}`);
                    return respHandler_1.ResponseHandler.error(res, error.details[0].message, 400);
                }
                const { limit, offset, orderBy, order, loanTakerId, amount, status, date, billNo, loanType } = req.query;
                const where = {};
                if (amount)
                    where["amount"] = { [Op.like]: `%${amount}%` };
                if (status)
                    where["status"] = { [Op.eq]: status };
                if (date)
                    where["date"] = { [Op.eq]: date };
                if (billNo)
                    where["billNo"] = { [Op.eq]: billNo };
                if (loanType)
                    where["loanType"] = { [Op.eq]: loanType };
                if (loanTakerId)
                    where["loanTakerId"] = loanTakerId;
                const orderQuery = orderBy && order ? [[orderBy, order]] : [];
                const data = yield loan_1.Loan.findAndCountAll({
                    where,
                    order: orderQuery,
                    distinct: true,
                    limit: Number(limit),
                    offset: Number(offset),
                });
                logger_1.default.info(`Fetched loan list for loan taker ID: ${value.id}, Total records: ${data.count}`);
                return respHandler_1.ResponseHandler.success(res, "Loan list fetched successfully", (0, helper_1.paging)(data, Number(offset), Number(limit)));
            }
            catch (error) {
                logger_1.default.error("Error fetching loan list", { error });
                return respHandler_1.ResponseHandler.error(res, "Error fetching loan list", 500, error);
            }
        });
    }
    // Fetch transaction list by loan taker ID
    transactionList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate loanTakerId in query parameters
                const schema = joi_1.default.object({
                    id: joi_1.default.number().required(),
                    orderBy: joi_1.default.string().optional(),
                    order: joi_1.default.string().valid("ASC", "DESC").optional(),
                    amount: joi_1.default.number().optional(),
                    paymentsource: joi_1.default.string().optional(),
                    date: joi_1.default.date().optional(),
                });
                const { error, value } = schema.validate(req.query);
                if (error) {
                    logger_1.default.warn(`Validation error: ${error.details[0].message}`);
                    return respHandler_1.ResponseHandler.error(res, error.details[0].message, 400);
                }
                const { id, limit, offset, orderBy, order, amount, paymentsource, date } = value;
                const where = { loanTakerId: { [Op.eq]: id } };
                if (amount)
                    where["amount"] = { [Op.eq]: amount };
                if (paymentsource)
                    where["paymentSourceId"] = { [Op.eq]: paymentsource };
                if (date)
                    where["date"] = { [Op.eq]: date };
                const orderQuery = orderBy && order ? [[orderBy, order]] : [];
                const data = yield loanTransaction_1.LoanTransaction.findAndCountAll({
                    where,
                    order: orderQuery,
                    distinct: true,
                    limit,
                    offset,
                });
                logger_1.default.info(`Fetched transactions for loan taker ID: ${id}, Total records: ${data.count}`);
                return respHandler_1.ResponseHandler.success(res, "Transaction list fetched successfully", (0, helper_1.paging)(data, Number(offset), limit));
            }
            catch (error) {
                logger_1.default.error("Error fetching transaction list", { error });
                return respHandler_1.ResponseHandler.error(res, "Error fetching transaction list", 500, error);
            }
        });
    }
    save(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate request body
                const schema = joi_1.default.object({
                    name: joi_1.default.string().required(),
                    phoneNumber: joi_1.default.string().required(),
                    email: joi_1.default.string().email().required(),
                    cnic: joi_1.default.string().required(),
                    description: joi_1.default.optional(),
                    status: joi_1.default.optional(),
                });
                const { error, value } = schema.validate(req.body);
                if (error) {
                    logger_1.default.warn(`Validation error: ${error.details[0].message}`);
                    return respHandler_1.ResponseHandler.error(res, error.details[0].message, 400);
                }
                const loanTakerData = Object.assign(Object.assign({}, value), { createdAt: new Date(), updatedAt: new Date() });
                // Save data
                const instance = yield loanTaker_1.LoanTaker.create(loanTakerData);
                logger_1.default.info(`LoanTaker created successfully with ID: ${instance.id}`);
                return respHandler_1.ResponseHandler.success(res, "Added Successfully", instance);
            }
            catch (error) {
                logger_1.default.error("Error in adding LoanTaker", { error });
                return respHandler_1.ResponseHandler.error(res, "Error in adding record", 500, error);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate request body
                const schema = joi_1.default.object({
                    id: joi_1.default.number().required(),
                    name: joi_1.default.string().required(),
                    description: joi_1.default.string().required(),
                    phoneNumber: joi_1.default.string().required(),
                    email: joi_1.default.string().email().required(),
                    cnic: joi_1.default.string().required(),
                    status: joi_1.default.optional(),
                });
                const { error, value } = schema.validate(req.body);
                if (error) {
                    logger_1.default.warn(`Validation error: ${error.details[0].message}`);
                    return respHandler_1.ResponseHandler.error(res, error.details[0].message, 400);
                }
                const { id } = value, updateData = __rest(value, ["id"]);
                updateData.updatedAt = new Date();
                // Check if record exists
                const existingRecord = yield loanTaker_1.LoanTaker.findByPk(id);
                if (!existingRecord) {
                    logger_1.default.warn(`LoanTaker with ID ${id} not found`);
                    return respHandler_1.ResponseHandler.error(res, "No record found", 404);
                }
                // Update record
                yield loanTaker_1.LoanTaker.update(updateData, { where: { id } });
                const updatedRecord = yield loanTaker_1.LoanTaker.findByPk(id);
                logger_1.default.info(`LoanTaker with ID ${id} updated successfully`);
                return respHandler_1.ResponseHandler.success(res, "Updated successfully", updatedRecord);
            }
            catch (error) {
                logger_1.default.error("Error updating LoanTaker", { error });
                return respHandler_1.ResponseHandler.error(res, "Error updating record", 500, error);
            }
        });
    }
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate request body
                const schema = joi_1.default.object({
                    status: joi_1.default.string().required(),
                    id: joi_1.default.number().required(),
                });
                const { error, value } = schema.validate(req.body);
                if (error) {
                    logger_1.default.warn(`Validation error: ${error.details[0].message}`);
                    return respHandler_1.ResponseHandler.error(res, error.details[0].message, 400);
                }
                const { id, status } = value;
                // Check if record exists
                const existingRecord = yield loanTaker_1.LoanTaker.findByPk(id);
                if (!existingRecord) {
                    logger_1.default.warn(`LoanTaker with ID ${id} not found`);
                    return respHandler_1.ResponseHandler.error(res, "Record not found", 404);
                }
                // Update status
                yield loanTaker_1.LoanTaker.update({ status }, { where: { id } });
                logger_1.default.info(`LoanTaker ID ${id} status updated to ${status}`);
                return respHandler_1.ResponseHandler.success(res, "Status updated successfully");
            }
            catch (error) {
                logger_1.default.error("Error updating status", { error });
                return respHandler_1.ResponseHandler.error(res, "Error updating status", 500, error);
            }
        });
    }
    detail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate request body
                const schema = joi_1.default.object({
                    id: joi_1.default.number().required(),
                });
                const { error, value } = schema.validate(req.body);
                if (error) {
                    logger_1.default.warn(`Validation error: ${error.details[0].message}`);
                    return respHandler_1.ResponseHandler.error(res, error.details[0].message, 400);
                }
                const { id } = value;
                // Fetch record
                const result = yield loanTaker_1.LoanTaker.findOne({ where: { id } });
                if (!result) {
                    logger_1.default.warn(`LoanTaker with ID ${id} not found`);
                    return respHandler_1.ResponseHandler.error(res, "Data not found", 404);
                }
                logger_1.default.info(`Fetched details for LoanTaker ID ${id}`);
                return respHandler_1.ResponseHandler.success(res, "Detail", result);
            }
            catch (error) {
                logger_1.default.error("Error fetching detail", { error });
                return respHandler_1.ResponseHandler.error(res, "Error fetching details", 500, error);
            }
        });
    }
    loanDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate request body
                const schema = joi_1.default.object({
                    id: joi_1.default.number().required(),
                });
                const { error, value } = schema.validate(req.body);
                if (error) {
                    logger_1.default.warn(`Validation error: ${error.details[0].message}`);
                    return respHandler_1.ResponseHandler.error(res, error.details[0].message, 400);
                }
                const { id } = value;
                // Fetch loan details
                const result = yield loan_1.Loan.findOne({ where: { id } });
                if (!result) {
                    logger_1.default.warn(`Loan with ID ${id} not found`);
                    return respHandler_1.ResponseHandler.error(res, "Data not found", 404);
                }
                logger_1.default.info(`Fetched details for Loan ID ${id}`);
                return respHandler_1.ResponseHandler.success(res, "Loan Detail", result);
            }
            catch (error) {
                logger_1.default.error("Error fetching loan details", { error });
                return respHandler_1.ResponseHandler.error(res, "Error fetching loan details", 500, error);
            }
        });
    }
    // del user
    del(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate request body
                const schema = joi_1.default.object({
                    id: joi_1.default.number().required(),
                });
                const { error, value } = schema.validate(req.body);
                if (error) {
                    logger_1.default.warn(`Validation error: ${error.details[0].message}`);
                    return respHandler_1.ResponseHandler.error(res, error.details[0].message, 400);
                }
                const { id } = value;
                // Check if record exists
                const existingRecord = yield loanTaker_1.LoanTaker.findByPk(id);
                if (!existingRecord) {
                    logger_1.default.warn(`LoanTaker with ID ${id} not found`);
                    return respHandler_1.ResponseHandler.error(res, "Record not found", 404);
                }
                // Delete record
                yield loanTaker_1.LoanTaker.destroy({ where: { id } });
                logger_1.default.info(`LoanTaker ID ${id} deleted successfully`);
                return respHandler_1.ResponseHandler.success(res, "Successfully deleted");
            }
            catch (error) {
                logger_1.default.error("Error deleting LoanTaker", { error });
                return respHandler_1.ResponseHandler.error(res, "Error deleting LoanTaker", 500, error);
            }
        });
    }
}
LoanTakerController.instance = null;
exports.LoanTakerController = LoanTakerController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9hblRha2VyQ29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb250cm9sbGVycy9Mb2FuVGFrZXJDb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsbURBQWdEO0FBQ2hELDhDQUFzQjtBQUV0QixNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3BDLDhDQUFxRDtBQUNyRCx5Q0FBc0M7QUFDdEMsK0RBQTREO0FBQzVELHNEQUF1RDtBQUN2RCw2REFBcUM7QUFFckMsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUM1QyxNQUFhLG1CQUFtQjtJQUc5QixnQkFBd0IsQ0FBQztJQUV6QixNQUFNLENBQUMsSUFBSTtRQUNULElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLEVBQUU7WUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7U0FDM0M7UUFFRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVLLElBQUksQ0FBQyxHQUFvQixFQUFFLEdBQXFCOztZQUNwRCxJQUFJO2dCQUNGLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztnQkFFckYsTUFBTSxLQUFLLEdBQVEsRUFBRSxDQUFDO2dCQUV0QixJQUFJLElBQUk7b0JBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNyRCxJQUFJLE1BQU07b0JBQUUsS0FBSyxD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