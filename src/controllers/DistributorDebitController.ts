import express from "express";
// import { Loan } from "../models/Loan";
import { Loan } from "../models/loan";
import { DistributorLoan } from "../models/DistributorLoan";
import { DistributorDebit } from "../models/DistributorDebit";
import Joi from "joi";
import { ValidationError } from "sequelize";
const { Op } = require("sequelize");
import { paging, enumKeys } from "../helpers/helper";
import { LoanTaker } from "../models/loanTaker";
import { Distributor } from "../models/distributor";
import { ResponseHandler } from "../utils/respHandler";
import logger from "../utils/logger";
const cloudinary = require("cloudinary").v2;

export class DistributorDebitController {
  private static instance: DistributorDebitController | null = null;

  private constructor() { }

  static init(): DistributorDebitController {
    if (this.instance == null) {
      this.instance = new DistributorDebitController();
    }

    return this.instance;
  }

  async list(req: express.Request, res: express.Response) {
    try {
      let qp = req.query;
      let perPage = Number(qp.perPage) > 0 ? Number(qp.perPage) : 10;
      let pageNo = Number(qp.page) > 0 ? Number(qp.page) - 1 : 0;
      let order: Array<any> = [];

      if (qp.orderBy && qp.order) {
        order.push([qp.orderBy as string, qp.order as string]);
      }

      const where: any = { distributorId: qp.id };
      if (qp.keyword) where["name"] = { [Op.like]: `%${qp.keyword}%` };
      if (qp.status) where["status"] = { [Op.eq]: qp.status };
      if (qp.paymentSourceId) where["paymentSourceId"] = { [Op.eq]: qp.paymentSourceId };
      if (qp.date) where["date"] = { [Op.eq]: qp.date };
      if (qp.amount) where["amount"] = { [Op.eq]: qp.amount };
      if (qp.billNo) where["billNo"] = { [Op.eq]: qp.billNo };

      let pagination = {};
      if (qp.perPage && qp.page) {
        pagination = { offset: perPage * pageNo, limit: perPage };
      }

      logger.info("Fetching distributor debit records", { where, order, pagination });

      const data = await DistributorDebit.findAndCountAll({
        where,
        order,
        distinct: true,
        ...pagination,
      });

      logger.info("Successfully retrieved records", { count: data.count });

      return ResponseHandler.success(
        res,
        "Distributor debit records fetched successfully",
        qp.hasOwnProperty("page") ? paging(data, pageNo, perPage) : data
      );
    } catch (error) {
      logger.error("Error fetching distributor debit records", { error: error.message });
      return ResponseHandler.error(res, "Failed to fetch distributor debit records", 500, error);
    }
  }


  public async save(req: express.Request, res: express.Response) {
    const schema = Joi.object({
      distributorId: Joi.number().required(),
      amount: Joi.number().required().integer().min(1),
      billNo: Joi.number().optional().integer(),
      description: Joi.optional(),
      installmentCount: Joi.optional(),
      installmentAmount: Joi.optional(),
      paymentSourceId: Joi.required(),
      date: Joi.string().required(),
      status: Joi.optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error instanceof ValidationError) {
      logger.warn("Validation failed", { error: error.details[0].message });
      return ResponseHandler.error(res, error.details[0].message, 400);
    }

    try {
      logger.info("Creating distributor debit record", { value });
      const instance = await DistributorDebit.create(value);

      const loanTaker = await Distributor.findOne({ where: { id: Number(value.distributorId) } });
      if (!loanTaker) {
        logger.warn("Distributor not found");
        return ResponseHandler.error(res, "Pass Correct Distributor ID", 400);
      }

      let currentLoanAmount = loanTaker.loanAmount;
      let remainingLoanAmount = loanTaker.remainingAmount;

      currentLoanAmount += Number(value.amount);
      remainingLoanAmount += Number(value.amount);

      await Distributor.update(
        {
          loanAmount: currentLoanAmount,
          remainingAmount: remainingLoanAmount,
        },
        { where: { id: Number(value.distributorId) } }
      );

      logger.info("Distributor loan updated", { currentLoanAmount, remainingLoanAmount });
      return ResponseHandler.success(res, "Added Successfully", instance, 201);
    } catch (e: any) {
      logger.error("Error in adding record", { error: e.message });
      return ResponseHandler.error(res, "Error in adding record", 500, e);
    }
  }

  public async update(req: express.Request, res: express.Response) {
    const schema = Joi.object().keys({
      id: Joi.number().required(),
      distributorId: Joi.number().required(),
      amount: Joi.number().optional().integer().min(1),
      billNo: Joi.optional(), // Removed integer() to support BIGINT
      description: Joi.string().optional(),
      paymentSourceId: Joi.optional(),
      status: Joi.optional(),
      returnDate: Joi.optional(),
      installmentCount: Joi.optional(),
      installmentAmount: Joi.optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.error(`Validation Error: ${error.details[0].message}`);
      return ResponseHandler.error(res, error.details[0].message, 400);
    }

    try {
      const debit: any = await Loan.findByPk(req.body.id);

      if (!debit) {
        logger.warn(`No Record Found for ID: ${req.body.id}`);
        return ResponseHandler.error(res, "No Record Found", 404);
      }

      const debitData = {
        distributorId: req.body.distributorId,
        amount: req.body.amount,
        description: req.body.description ?? null,
        billNo: req.body.billNo ?? null,
        status: req.body.status,
        paymentSourceId: req.body.paymentSourceId ?? "",
        updatedAt: new Date(),
        returnDate: req.body.returnDate ?? null,
        installmentCount: req.body.installmentCount ?? 0,
        installmentAmount: req.body.installmentAmount ?? 0,
      };

      const [updatedRows] = await DistributorDebit.update(debitData, {
        where: { id: req.body.id },
      });

      if (updatedRows === 0) {
        logger.warn(`Update Failed for ID: ${req.body.id}`);
        return ResponseHandler.error(res, "Error in updating record. Please check the provided data.", 400);
      }

      const res_data = await DistributorDebit.findByPk(req.body.id);
      logger.info(`Record Updated Successfully for ID: ${req.body.id}`);

      return ResponseHandler.success(res, "Updated successfully", res_data);

    } catch (e: any) {
      logger.error(`Error in updating Loan: ${e.message}`, { error: e });
      return ResponseHandler.error(res, "Internal Server Error. Please try again later.", 500);
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

    const result = await DistributorDebit.findOne({
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

    const data: any = await DistributorDebit.update(
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
      let data = await DistributorDebit.destroy({
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
