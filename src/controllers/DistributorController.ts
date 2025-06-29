import express from "express";
import { User } from "../models/user";
import { Distributor } from "../models/distributor";
import Joi from "joi";
import { ValidationError } from "sequelize";
const { Op } = require("sequelize");
import { paging, enumKeys } from "../helpers/helper";
import { ResponseHandler } from "../utils/respHandler";
import logger from "../utils/logger";
import { DistributorDebit } from "../models/DistributorDebit";
import { sequelize } from "../config/connection";
import { DistributorCredit } from "../models/DistributorCredit";
import { Account } from "../models/BankAccounts";

const cloudinary = require("cloudinary").v2;
export class DistributorController {
  private static instance: DistributorController | null = null;

  private constructor() { }

  static init(): DistributorController {
    if (this.instance == null) {
      this.instance = new DistributorController();
    }

    return this.instance;
  }

  public async list(req: express.Request, res: express.Response) {
    try {
      let qp = req.query;
      let perPage = Number(qp.perPage) > 0 ? Number(qp.perPage) : 10;
      let pageNo = qp.page ? (Number(qp.page) > 0 ? Number(qp.page) - 1 : 0) : 0;
      let order: Array<any> = [];

      if (qp.orderBy && qp.order) {
        order.push([qp.orderBy as string, qp.order as string]);
      }

      const where: any = {};

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

      const data = await Distributor.findAndCountAll({
        where,
        order,
        distinct: true,
        ...pagination,
      });

      logger.info(`Fetched distributor list with filters: ${JSON.stringify(qp)}`);

      // ✅ Always return the same response structure
      return ResponseHandler.success(
        res,
        "List retrieved",
        paging(data, pageNo + 1, perPage) // pageNo starts from 0, so add 1 for correct page number
      );
    } catch (error) {
      logger.error("Error fetching distributor list", { error });
      return ResponseHandler.error(res, "Error fetching distributor list", 500, error);
    }
  }

  public async distributors(req: express.Request, res: express.Response) {
    try {
      let qp = req.query;
      let perPage = Number(qp.perPage) > 0 ? Number(qp.perPage) : 10;
      let pageNo = qp.page ? (Number(qp.page) > 0 ? Number(qp.page) - 1 : 0) : 0;
      const where: any = {};

      if (qp.keyword) {
        where["name"] = { [Op.like]: `%${qp.keyword}%` };
      }
      const data = await Distributor.findAndCountAll({
        where
      });

      logger.info(`Fetched distributor list with filters: ${JSON.stringify(qp)}`);

      // ✅ Always return the same response structure
      return ResponseHandler.success(
        res,
        "Distributors list retrieved",
        paging(data, pageNo + 1, perPage) // pageNo starts from 0, so add 1 for correct page number
      );
    } catch (error) {
      logger.error("Error fetching distributor list", { error });
      return ResponseHandler.error(res, "Error fetching distributor list", 500, error);
    }
  }

  public async save(req: express.Request, res: express.Response) {
    const schema = Joi.object({
      id: Joi.optional(),
      name: Joi.string().required(),
      description: Joi.allow(null, '').optional(),
      companyName: Joi.string().required(),
      phoneNo: Joi.string().required(),
      status: Joi.optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return ResponseHandler.error(res, error.details[0].message, 400);
    }

    const catData = {
      ...value,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const instance = await Distributor.create(catData);
      logger.info(`Distributor added successfully: ${instance.id}`);
      return ResponseHandler.success(res, "Added Successfully", instance);
    } catch (e) {
      logger.error("Error creating distributor", { error: e });
      return ResponseHandler.error(res, "Error creating distributor", 500);
    }
  }


  public async update(req: express.Request, res: express.Response) {
    const schema = Joi.object({
      id: Joi.number().required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      companyName: Joi.string().required(),
      phoneNo: Joi.string().required(),
      status: Joi.optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return ResponseHandler.error(res, error.details[0].message, 400);
    }

    try {
      const distributor = await Distributor.findByPk(value.id);
      if (!distributor) {
        return ResponseHandler.error(res, "No Record Found", 404);
      }

      const updatedData = {
        ...value,
        updatedAt: new Date(),
      };

      const [affectedRows] = await Distributor.update(updatedData, {
        where: { id: value.id },
      });

      if (affectedRows === 0) {
        return ResponseHandler.error(res, "Error updating record", 400);
      }

      const updatedDistributor = await Distributor.findByPk(value.id);
      logger.info(`Distributor updated successfully: ${value.id}`);

      return ResponseHandler.success(res, "Updated Successfully", updatedDistributor);
    } catch (e) {
      logger.error("Error updating distributor", { error: e });
      return ResponseHandler.error(res, "Error updating record", 500);
    }
  }

  public async transaction(req: express.Request, res: express.Response) {
    const schema = Joi.object({
      distributorId: Joi.number().required(),
      amount: Joi.number().required().integer().min(1),
      paidAmount: Joi.number().required().integer().min(0),
      billNo: Joi.number().required().integer(),
      description: Joi.string().optional(),
      installmentCount: Joi.optional(),
      installmentAmount: Joi.optional(),
      paymentSourceId: Joi.string().when('paidAmount', {
        is: Joi.number().greater(0),
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
      }),
      date: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error instanceof ValidationError) {
      logger.warn("Validation failed", { error: error.details[0].message });
      return ResponseHandler.error(res, error.details[0].message, 400);
    }

    const transaction = await sequelize.transaction();

    const {
      distributorId,
      amount,
      paidAmount,
      gstAmount,
      advTaxAmount,
      billNo,
      description,
      installmentCount,
      installmentAmount,
      paymentSourceId,
      date,
      status
    } = req.body;

    try {
      // Fetch distributor
      const distributor = await Distributor.findOne({ where: { id: distributorId }, transaction });

      if (!distributor) {
        await transaction.rollback();
        logger.warn("Distributor not found", { distributorId });
        return ResponseHandler.error(res, "Pass Correct Distributor ID", 400);
      }

      if (value.paymentSourceId && value.paymentSourceId > 0) {
        const account = await Account.findByPk(Number(value.paymentSourceId), { transaction: transaction });

        if (!account) {
          await transaction.rollback();
          return ResponseHandler.error(res, "Invalid account/payment source", 404);
        }

        if (Number(account.balance) < Number(amount)) {
          await transaction.rollback();
          return ResponseHandler.error(res, "Insufficient account balance", 400);
        }
        account.balance = Number(account.balance) - Number(value.amount);
        await account.save({ transaction: transaction });
      }
      const debitEntry = await DistributorDebit.create({
        distributorId: distributorId,
        amount: Number(amount),
        billNo: billNo ?? null,
        description: description ?? null,
        installmentAmount: installmentAmount ?? 0,
        installmentCount: installmentCount ?? 0,
        date,
        status
      }, { transaction });

      let creditEntry = null;
      let updatedLoanAmount = distributor.loanAmount + Number(amount);
      let updatedPaidAmount = distributor.paidAmount;
      let updatedRemainingAmount = distributor.remainingAmount + Number(amount);

      // Conditionally create credit entry
      if (paidAmount || gstAmount || advTaxAmount) {
        creditEntry = await DistributorCredit.create({
          distributorId: distributorId,
          amount: Number(paidAmount),
          gstAmount: Number(gstAmount),
          advTaxAmount: Number(advTaxAmount),
          description: description ?? null,
          date: date,
          paymentSourceId: paymentSourceId,
          status
        }, { transaction });

        updatedPaidAmount += Number(paidAmount);
        updatedRemainingAmount -= Number(paidAmount);
      }

      // Update distributor loan record
      await Distributor.update({
        loanAmount: updatedLoanAmount,
        paidAmount: updatedPaidAmount,
        remainingAmount: updatedRemainingAmount
      }, { where: { id: distributorId }, transaction });

      await transaction.commit();

      logger.info("Distributor debit and conditional credit records created", {
        distributorId,
        updatedLoanAmount,
        updatedPaidAmount,
        updatedRemainingAmount
      });

      return ResponseHandler.success(res, "Transaction successful", { debitEntry, creditEntry }, 201);

    } catch (e: any) {
      await transaction.rollback();
      logger.error("Error in combined transaction", { error: e.message });
      return ResponseHandler.error(res, "Error in transaction", 500, e);
    }
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

    const data: any = await Distributor.update(
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
      let data = await Distributor.destroy({
        where: {
          id: Number(req.body.id),
        },
      });
    } catch (err) {
      console.log(err);
      res.Error("error in deleting distributor");
    }

    res.Success("Successfullt deleted");
  }
}
