import express from "express";
// import { Loan } from "../models/Loan";
import { Loan } from "../models/loan";
import { Distributor } from "../models/distributor";
import { DistributorCredit } from "../models/DistributorCredit";
import { DistributorDebit } from "../models/DistributorDebit";
import Joi from "joi";
import { ValidationError } from "sequelize";
const { Op } = require("sequelize");
import { paging, enumKeys } from "../helpers/helper";
import { LoanTaker } from "../models/loanTaker";
import { LoanTransaction } from "../models/loanTransaction";
import { sequelize } from "../config/connection";
import { ResponseHandler } from "../utils/respHandler";
import logger from "../utils/logger";
import { Account } from "../models/BankAccounts";
export class DistributorCreditController {
  private static instance: DistributorCreditController | null = null;

  private constructor() { }

  static init(): DistributorCreditController {
    if (this.instance == null) {
      this.instance = new DistributorCreditController();
    }

    return this.instance;
  }

  async list(req: express.Request, res: express.Response) {
    try {
      const { perPage, page, orderBy, order, distributorId, amount, paymentSourceId, date } = req.query;

      // Pagination Setup
      const limit = Number(perPage) > 0 ? Number(perPage) : 10;
      const pageNo = Number(page) > 0 ? Number(page) - 1 : 0;
      const offset = limit * pageNo;

      // Sorting Setup
      const sortingOrder: Array<[string, string]> = orderBy && order ? [[orderBy as string, order as string]] : [];

      // Filtering Setup
      const where: Record<string, any> = {};
      if (distributorId) where["distributorId"] = distributorId;
      if (amount) where["amount"] = { [Op.eq]: amount };
      if (paymentSourceId) where["paymentSourceId"] = { [Op.eq]: paymentSourceId };
      if (date) where["date"] = { [Op.eq]: date };
      if (date) where["date"] = { [Op.eq]: date };

      // Fetch Data
      console.log('filgtttters', where)
      const data = await DistributorCredit.findAndCountAll({
        where,
        order: sortingOrder,
        distinct: true,
        offset,
        limit,
      });

      // Response Handling
      const responseData = page ? paging(data, pageNo, limit) : data;
      return ResponseHandler.success(res, "List fetched successfully", responseData);

    } catch (error: any) {
      logger.error(`Error fetching list: ${error.message}`, { error });
      return ResponseHandler.error(res, "Error fetching list. Please try again later.", 500);
    }
  }


  public async save(req: express.Request, res: express.Response) {
    // Define validation schema
    const schema = Joi.object({
      distributorId: Joi.number().required(),
      description: Joi.string().optional(),
      date: Joi.date().optional(),
      amount: Joi.number().required().min(1),
      paymentSourceId: Joi.string().required(),
      status: Joi.optional(),
    });

    // Validate request body
    const { error, value } = schema.validate(req.body);
    if (error instanceof ValidationError) {
      return ResponseHandler.error(res, error.details[0].message, 400);
    }

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
      const instance = await DistributorCredit.create(value, { transaction });

      const loanTaker = await Distributor.findOne({ where: { id: value.distributorId }, transaction });

      if (!loanTaker) {
        await transaction.rollback();
        return ResponseHandler.error(res, "Invalid distributor ID", 400);
      }
      const updatedLoanData = {
        paidAmount: Number(loanTaker.paidAmount) + Number(value.amount),
        remainingAmount: Number(loanTaker.remainingAmount) - Number(value.amount),
      };

      await Distributor.update(updatedLoanData, { where: { id: value.distributorId }, transaction });

      await transaction.commit();
      return ResponseHandler.success(res, "Added successfully", instance, 201);

    } catch (error: any) {
      await transaction.rollback();
      logger.error(`Error adding credit: ${error.message}`, { error });
      return ResponseHandler.error(res, "Error adding record. Please try again.", 500);
    }
  }

  public async update(req: express.Request, res: express.Response) {
    // Define validation schema
    const schema = Joi.object({
      id: Joi.number().required(),
      distributorId: Joi.number().required(),
      description: Joi.string().optional(),
      date: Joi.date().optional(),
      amount: Joi.number().optional(),
      paymentSourceId: Joi.string().optional(),
      status: Joi.string().optional(),
    });

    // Validate request body
    const { error, value } = schema.validate(req.body);
    if (error instanceof ValidationError) {
      return ResponseHandler.error(res, error.details[0].message, 400);
    }

    const { id, distributorId, description, date, amount, paymentSourceId, status } = req.body;

    try {
      // Find record
      const creditRecord = await DistributorCredit.findByPk(id);
      if (!creditRecord) {
        return ResponseHandler.error(res, "No record found", 404);
      }

      // Prepare updated data
      const updatedData = {
        distributorId,
        description: description ?? creditRecord.description,
        amount: amount ?? creditRecord.amount,
        date: date ?? creditRecord.date,
        paymentSourceId: paymentSourceId ?? creditRecord.paymentSourceId,
        status: status ?? creditRecord.status,
        updatedAt: new Date(),
      };

      // Update record
      const [updateCount] = await DistributorCredit.update(updatedData, { where: { id } });
      if (updateCount === 0) {
        return ResponseHandler.error(res, "No changes made. Check your data.", 400);
      }

      // Fetch updated data
      const updatedRecord = await DistributorCredit.findByPk(id);
      return ResponseHandler.success(res, "Updated successfully", updatedRecord);

    } catch (error: any) {
      logger.error(`Error updating credit: ${error.message}`, { error });
      return ResponseHandler.error(res, "Error updating record. Please try again.", 500);
    }
  }


  public async detail(req: express.Request, res: express.Response) {
    const schema = Joi.object().keys({
      id: Joi.number().required(),
    });
    const { error, value } = schema.validate(req.body);

    if (error instanceof ValidationError) {
      res.Error(error.details[0].message);
      return;
    }

    const result = await DistributorCredit.findOne({
      where: { id: Number(req.body.id) },
    });
    // console.log(review);

    if (result === null) {
      res.Error("data not found");
      return;
    }

    res.Success("Detail", result);
  }

  async updateStatus(req: express.Request, res: express.Response) {
    // (global as any).log.info("Update Status");

    const schema = Joi.object().keys({
      status: Joi.string().required(),
      id: Joi.number().required(),
    });
    const { error, value } = schema.validate(req.body);

    if (error instanceof ValidationError) {
      res.Error(error.details[0].message);
      return;
    }

    const data: any = await DistributorCredit.update(
      { status: req.body.status },
      { where: { id: req.body.id } }
    );

    if (data == null) {
      res.Error("record not Found");
      return;
    }
    return res.Success("status updated successfully");
  }
  // del user
  async del(req: express.Request, res: express.Response) {
    try {
      let data = await DistributorCredit.destroy({
        where: {
          id: Number(req.body.id),
        },
      });
    } catch (err) {
      console.log(err);
      res.Error("error in deleting Loan");
    }

    res.Success("Successfullt deleted");
  }
}
