import express from "express";
// import { Loan } from "../models/Loan";
import { Loan } from "../models/loan";
import Joi from "joi";
import { ValidationError } from "sequelize";
const { Op } = require("sequelize");
import { paging, enumKeys } from "../helpers/helper";
import { LoanTaker } from "../models/loanTaker";
import { LoanTransaction } from "../models/loanTransaction";
import { sequelize } from "../config/connection";
import logger from "../utils/logger"; // Assuming you have a logger utility
import { ResponseHandler } from "../utils/respHandler";
import { Account } from "../models/BankAccounts";
const cloudinary = require("cloudinary").v2;
export class LoanTransactionController {
  private static instance: LoanTransactionController | null = null;

  private constructor() { }

  static init(): LoanTransactionController {
    if (this.instance == null) {
      this.instance = new LoanTransactionController();
    }

    return this.instance;
  }

  async list(req: express.Request, res: express.Response) {
    try {
      const { limit, offset, orderBy, order, loanTakerId, amount, status, date, paymentSourceId } = req.query;

      const where: any = {};
      if (amount) where["amount"] = { [Op.like]: `%${amount}%` };
      if (status) where["status"] = { [Op.eq]: status };
      if (date) where["date"] = { [Op.eq]: date };
      if (paymentSourceId) where["paymentSourceId"] = { [Op.eq]: paymentSourceId };
      if (loanTakerId) where["loanTakerId"] = loanTakerId;

      let orderQuery: [string, "ASC" | "DESC"][] = [];
      if (orderBy && order) {
        orderQuery.push([orderBy as string, order as "ASC" | "DESC"]);
      }

      const data = await LoanTransaction.findAndCountAll({
        where,
        order: orderQuery,
        distinct: true,
        offset: Number(offset),
        limit: Number(limit),
      });

      logger.info("Fetched loan transactions successfully");
      return ResponseHandler.success(
        res,
        "Loan transactions fetched successfully",
        paging(data, Number(offset), Number(limit))
      );
    } catch (error) {
      logger.error("Error fetching loan transactions", error);
      return ResponseHandler.error(res, "Error fetching loan transactions", 500, error);
    }
  }


  public async save(req: express.Request, res: express.Response) {
    const schema = Joi.object({
      id: Joi.optional(),
      loanTakerId: Joi.number().required(),
      description: Joi.allow(null, '').optional(),
      date: Joi.date().default(new Date()),
      amount: Joi.required(),
      paymentSourceId: Joi.required(),
      status: Joi.optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn("Validation failed", { error: error.details[0].message });
      return ResponseHandler.error(res, error.details[0].message, 400);
    }

    const catData = {
      loanTakerId: req.body.loanTakerId,
      description: req.body.description ?? null,
      amount: req.body.amount ?? 0,
      date: req.body.date ?? "",
      paymentSourceId: req.body.paymentSourceId ?? "",
      status: req.body.status,
    };

    const loanTakerId = Number(req.body.loanTakerId);
    const transactionAmount = req.body.amount;
    const transaction = await sequelize.transaction();

    try {

      if (value.paymentSourceId && value.paymentSourceId > 0) {
        const account = await Account.findByPk(Number(value.paymentSourceId), { transaction: transaction });

        if (!account) {
          await transaction.rollback();
          return ResponseHandler.error(res, "Invalid account/payment source", 404);
        }

        account.balance = Number(account.balance) + Number(value.amount);
        await account.save({ transaction: transaction });
      }
      const instance = await LoanTransaction.create(value, { transaction });

      const loanTaker = await LoanTaker.findOne({ where: { id: loanTakerId } });

      if (!loanTaker) {
        logger.warn(`Loan Taker not found for ID: ${loanTakerId}`);
        await transaction.rollback();
        return ResponseHandler.error(res, "Pass Correct Loan Taker ID", 404);
      }

      let paidLoanAmount = loanTaker.paidAmount;
      let remainingLoanAmount = loanTaker.remainingAmount;

      paidLoanAmount += Number(transactionAmount);
      remainingLoanAmount -= transactionAmount;

      await LoanTaker.update(
        {
          paidAmount: paidLoanAmount,
          remainingAmount: remainingLoanAmount,
        },
        { where: { id: loanTakerId }, transaction }
      );

      await transaction.commit();
      logger.info(`Loan transaction added successfully for Loan Taker ID: ${loanTakerId}`);
      return ResponseHandler.success(res, "Loan transaction added successfully", instance, 201);
    } catch (error) {
      await transaction.rollback();
      logger.error("Error saving loan transaction", { error });
      return ResponseHandler.error(res, "Error saving loan transaction", 500, error);
    }
  }


  public async update(req: express.Request, res: express.Response) {
    const schema = Joi.object({
      id: Joi.number().required(),
      loanTakerId: Joi.number().required(),
      description: Joi.string().optional(),
      date: Joi.optional(),
      amount: Joi.optional(),
      paymentSourceId: Joi.optional(),
      status: Joi.optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn("Validation failed", { error: error.details[0].message });
      return ResponseHandler.error(res, error.details[0].message, 400);
    }

    try {
      const loanTransaction = await LoanTransaction.findByPk(req.body.id);
      if (!loanTransaction) {
        logger.warn(`Loan transaction not found for ID: ${req.body.id}`);
        return ResponseHandler.error(res, "No Record Found", 404);
      }

      const loanData = {
        loanTakerId: req.body.loanTakerId,
        amount: req.body.amount ?? loanTransaction.amount,
        date: req.body.date ?? loanTransaction.date,
        paymentSourceId: req.body.paymentSourceId ?? loanTransaction.paymentSourceId,
        status: req.body.status ?? loanTransaction.status,
        updatedAt: new Date(),
      };

      const transaction = await sequelize.transaction();
      try {
        const updatedRows = await LoanTransaction.update(loanData, {
          where: { id: req.body.id },
          transaction,
        });

        if (!updatedRows[0]) {
          await transaction.rollback();
          logger.warn(`Update failed for Loan Transaction ID: ${req.body.id}`);
          return ResponseHandler.error(res, "Error updating record, please provide valid data", 400);
        }

        const updatedTransaction = await LoanTransaction.findByPk(req.body.id, { transaction });

        await transaction.commit();
        logger.info(`Loan transaction updated successfully for ID: ${req.body.id}`);
        return ResponseHandler.success(res, "Loan transaction updated successfully", updatedTransaction, 200);
      } catch (updateError) {
        await transaction.rollback();
        logger.error("Error during transaction update", { error: updateError });
        return ResponseHandler.error(res, "Error updating loan transaction", 500, updateError);
      }
    } catch (error) {
      logger.error("Unexpected error in update method", { error });
      return ResponseHandler.error(res, "Internal Server Error", 500, error);
    }
  }


  public async detail(req: express.Request, res: express.Response) {
    const schema = Joi.object({
      id: Joi.number().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn("Validation failed", { error: error.details[0].message });
      return ResponseHandler.error(res, error.details[0].message, 400);
    }

    try {
      const result = await LoanTransaction.findOne({ where: { id: value.id } });

      if (!result) {
        logger.warn(`LoanTransaction not found for ID: ${value.id}`);
        return ResponseHandler.error(res, "Data not found", 404);
      }

      logger.info(`LoanTransaction details fetched for ID: ${value.id}`);
      return ResponseHandler.success(res, "Detail retrieved successfully", result, 200);
    } catch (err) {
      logger.error("Error fetching LoanTransaction details", { error: err });
      return ResponseHandler.error(res, "Internal Server Error", 500, err);
    }
  }

  public async updateStatus(req: express.Request, res: express.Response) {
    const schema = Joi.object({
      id: Joi.number().required(),
      status: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn("Validation failed", { error: error.details[0].message });
      return ResponseHandler.error(res, error.details[0].message, 400);
    }

    try {
      const updatedRows = await LoanTransaction.update(
        { status: value.status },
        { where: { id: value.id } }
      );

      if (!updatedRows[0]) {
        logger.warn(`LoanTransaction status update failed for ID: ${value.id}`);
        return ResponseHandler.error(res, "Record not found or no change made", 404);
      }

      logger.info(`LoanTransaction status updated for ID: ${value.id}`);
      return ResponseHandler.success(res, "Status updated successfully", null, 200);
    } catch (err) {
      logger.error("Error updating LoanTransaction status", { error: err });
      return ResponseHandler.error(res, "Internal Server Error", 500, err);
    }
  }

  public async del(req: express.Request, res: express.Response) {
    const schema = Joi.object({
      id: Joi.number().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn("Validation failed", { error: error.details[0].message });
      return ResponseHandler.error(res, error.details[0].message, 400);
    }

    try {
      const deletedRows = await LoanTransaction.destroy({
        where: { id: value.id },
      });

      if (!deletedRows) {
        logger.warn(`LoanTransaction deletion failed for ID: ${value.id}`);
        return ResponseHandler.error(res, "Record not found", 404);
      }

      logger.info(`LoanTransaction deleted successfully for ID: ${value.id}`);
      return ResponseHandler.success(res, "Successfully deleted", null, 200);
    } catch (err) {
      logger.error("Error deleting LoanTransaction", { error: err });
      return ResponseHandler.error(res, "Internal Server Error", 500, err);
    }
  }

}
