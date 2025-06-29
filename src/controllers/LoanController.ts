import { endOfDay, startOfDay } from 'date-fns';
import express from "express";
import { Loan } from "../models/loan";
import Joi from "joi";
import { ValidationError } from "sequelize";
const { Op } = require("sequelize");
import { enumKeys, paging } from "../helpers/helper";
import { LoanTaker } from "../models/loanTaker";
import { ResponseHandler } from "../utils/respHandler";
import logger from "../utils/logger";
import { LoanTransactionEnum, LoanTypeEnum, PaymentMethodEnum, TransactionStatusEnum, TransactionTypeEnum } from '../constants/enum';
import { sequelize } from '../config/connection';
import { Account } from '../models/BankAccounts';
import { Transaction } from '../models/BankTransactions';

export class LoanController {
  private static instance: LoanController | null = null;

  private constructor() { }

  static init(): LoanController {
    if (this.instance == null) {
      this.instance = new LoanController();
    }
    return this.instance;
  }

  async list(req: express.Request, res: express.Response) {
    try {
      let { limit, offset, orderBy, id, order, billNo, status, loanType, date } = req.query;

      let orderQuery: [string, "ASC" | "DESC"][] = [];
      if (orderBy && order) {
        orderQuery.push([orderBy as string, order as "ASC" | "DESC"]);
      } let where: any = {};

      if (id) where["loanTakerId"] = id;
      if (billNo) where["billNo"] = { [Op.like]: billNo };
      if (status) where["status"] = { [Op.eq]: status };
      if (loanType) where["loanType"] = { [Op.eq]: loanType };
      if (date) {
        const parsedDate = new Date(date as string);
        where["date"] = {
          [Op.between]: [
            startOfDay(parsedDate),
            endOfDay(parsedDate)
          ]
        };
      }
      let data = await Loan.findAndCountAll({ where, order: orderQuery, distinct: true, limit: Number(limit), offset: Number(offset) });

      return ResponseHandler.success(res, "List retrieved successfully", paging(data, Number(offset), Number(limit)), 200);
    } catch (err) {
      logger.error("Error fetching loans", { error: err });
      return ResponseHandler.error(res, "Internal Server Error", 500, err);
    }
  }

  public async save(req: express.Request, res: express.Response) {
    const schema = Joi.object({
      id: Joi.optional(),
      loanTakerId: Joi.number().required(),
      loanType: Joi.string().valid(...enumKeys(LoanTypeEnum)).required(),
      amount: Joi.number().integer().min(1).required(),
      billNo: Joi.number().integer().optional(),
      description: Joi.allow(null, '').optional(),
      paymentSourceId: Joi.alternatives().conditional('loanType', {
        is: LoanTypeEnum.money,
        then: Joi.number().greater(0).required(),
        otherwise: Joi.any().forbidden(),
      }),
      date: Joi.string().required(),
      status: Joi.optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn("Validation error", { error: error.details[0].message });
      return ResponseHandler.error(res, error.details[0].message, 400);
    }

    const t = await sequelize.transaction();
    try {
      // Step 1: Handle account balance check if payment source is provided
      if (value.paymentSourceId && value.paymentSourceId > 0) {
        const account = await Account.findByPk(Number(value.paymentSourceId), { transaction: t });

        if (!account) {
          await t.rollback();
          return ResponseHandler.error(res, "Invalid account/payment source", 404);
        }

        if (Number(account.balance) < Number(value.amount)) {
          await t.rollback();
          return ResponseHandler.error(res, "Insufficient account balance", 400);
        }

        // Deduct the amount
        account.balance = Number(account.balance) - Number(value.amount);
        await account.save({ transaction: t });

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
      const loan = await Loan.create(value, { transaction: t });

      // Step 3: Update LoanTaker
      const loanTaker = await LoanTaker.findByPk(value.loanTakerId, { transaction: t });
      if (!loanTaker) {
        await t.rollback();
        return ResponseHandler.error(res, "Invalid Loan Taker ID", 404);
      }

      loanTaker.loanAmount += value.amount;
      loanTaker.remainingAmount += value.amount;
      await loanTaker.save({ transaction: t });

      await t.commit();
      return ResponseHandler.success(res, "Loan added successfully", loan, 201);
    } catch (err) {
      await t.rollback();
      logger.error("Error saving loan", { error: err });
      return ResponseHandler.error(res, "Error in adding record", 500, err);
    }
  }


  public async update(req: express.Request, res: express.Response) {
    const schema = Joi.object({
      id: Joi.number().required(),
      loanTakerId: Joi.number().required(),
      loanType: Joi.string().valid(...enumKeys(LoanTypeEnum)).optional(),
      amount: Joi.number().integer().min(1).optional(),
      billNo: Joi.number().integer().optional(),
      description: Joi.string().optional(),
      status: Joi.optional(),
      returnDate: Joi.optional(),
      installmentCount: Joi.optional(),
      installmentAmount: Joi.optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn("Validation error", { error: error.details[0].message });
      return ResponseHandler.error(res, error.details[0].message, 400);
    }

    try {
      const updated = await Loan.update(value, { where: { id: value.id } });
      if (!updated[0]) return ResponseHandler.error(res, "No record found or no change made", 404);
      const updatedLoan = await Loan.findByPk(value.id);
      return ResponseHandler.success(res, "Updated successfully", updatedLoan, 200);
    } catch (err) {
      logger.error("Error updating loan", { error: err });
      return ResponseHandler.error(res, "Error updating record", 500, err);
    }
  }


  async createTransaction({
    transactionType,
    amount,
    description,
    accountId,
    refrenceNumber = '',
    paymentMethod,
    transaction
  }: {
    transactionType: any;
    amount: number;
    description: string;
    accountId: number;
    refrenceNumber?: string;
    paymentMethod: PaymentMethodEnum
    transaction?: any;
  }) {
    const txn = await Transaction.create({
      transactionType,
      amount,
      description,
      accountId,
      refrenceNumber,
      paymentMethod,
      status: TransactionStatusEnum.Completed
    }, { transaction });

    return txn;
  }

  public async detail(req: express.Request, res: express.Response) {
    const schema = Joi.object({ id: Joi.number().required() });
    const { error, value } = schema.validate(req.body);
    if (error) return ResponseHandler.error(res, error.details[0].message, 400);

    try {
      const result = await Loan.findByPk(value.id);
      if (!result) return ResponseHandler.error(res, "Data not found", 404);
      return ResponseHandler.success(res, "Detail retrieved successfully", result, 200);
    } catch (err) {
      logger.error("Error fetching loan detail", { error: err });
      return ResponseHandler.error(res, "Internal Server Error", 500, err);
    }
  }

  public async updateStatus(req: express.Request, res: express.Response) {
    const schema = Joi.object({ id: Joi.number().required(), status: Joi.string().required() });
    const { error, value } = schema.validate(req.body);
    if (error) return ResponseHandler.error(res, error.details[0].message, 400);

    try {
      const updated = await Loan.update({ status: value.status }, { where: { id: value.id } });
      if (!updated[0]) return ResponseHandler.error(res, "Record not found or no change made", 404);
      return ResponseHandler.success(res, "Status updated successfully", null, 200);
    } catch (err) {
      logger.error("Error updating loan status", { error: err });
      return ResponseHandler.error(res, "Internal Server Error", 500, err);
    }
  }

  public async del(req: express.Request, res: express.Response) {
    const schema = Joi.object({ id: Joi.number().required() });
    const { error, value } = schema.validate(req.body);
    if (error) return ResponseHandler.error(res, error.details[0].message, 400);

    try {
      const deleted = await Loan.destroy({ where: { id: value.id } });
      if (!deleted) return ResponseHandler.error(res, "Record not found", 404);
      return ResponseHandler.success(res, "Successfully deleted", null, 200);
    } catch (err) {
      logger.error("Error deleting loan", { error: err });
      return ResponseHandler.error(res, "Internal Server Error", 500, err);
    }
  }
}
