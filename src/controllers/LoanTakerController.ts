import express from "express";
import { LoanTaker } from "../models/loanTaker";
import Joi from "joi";
import { ValidationError } from "sequelize";
const { Op } = require("sequelize");
import { paging, enumKeys } from "../helpers/helper";
import { Loan } from "../models/loan";
import { LoanTransaction } from "../models/loanTransaction";
import { ResponseHandler } from "../utils/respHandler";
import logger from "../utils/logger";

const cloudinary = require("cloudinary").v2;
export class LoanTakerController {
  private static instance: LoanTakerController | null = null;

  private constructor() { }

  static init(): LoanTakerController {
    if (this.instance == null) {
      this.instance = new LoanTakerController();
    }

    return this.instance;
  }

  async list(req: express.Request, res: express.Response) {
    try {
      const { limit, offset, orderBy, order, name, status, cnic, phoneNumber } = req.query;

      const where: any = {};

      if (name) where["name"] = { [Op.like]: `%${name}%` };
      if (status) where["status"] = { [Op.eq]: status };
      if (cnic) where["cnic"] = { [Op.eq]: cnic };
      if (phoneNumber) where["phoneNumber"] = { [Op.eq]: phoneNumber };

      const orderQuery: [string, "ASC" | "DESC"][] = orderBy && order ? [[orderBy as string, order as "ASC" | "DESC"]] : [];

      const data = await LoanTaker.findAndCountAll({
        where,
        order: orderQuery,
        distinct: true,
        limit: Number(limit),
        offset: Number(offset),
      });

      logger.info(`Fetched loan takers successfully. Total records: ${data.count}`);
      return ResponseHandler.success(
        res,
        "Loan takers fetched successfully",
        paging(data, Number(offset), Number(limit))
      );

    } catch (error) {
      logger.error("Error fetching loan takers", { error });
      return ResponseHandler.error(res, "Error fetching loan takers", 500, error);
    }
  }

  async loanTakers(req: express.Request, res: express.Response) {
    try {
      const { limit, offset, name } = req.query;

      const where: any = {};

      if (name) where["name"] = { [Op.like]: `%${name}%` };
      const data = await LoanTaker.findAndCountAll({
        where
      });

      logger.info(`Fetched loan takers successfully. Total records: ${data.count}`);
      return ResponseHandler.success(
        res,
        "Loan takers fetched successfully",
        paging(data, Number(offset), Number(limit))
      );

    } catch (error) {
      logger.error("Error fetching loan takers", { error });
      return ResponseHandler.error(res, "Error fetching loan takers", 500, error);
    }
  }

  // Fetch loan list by loan taker ID
  async loanList(req: express.Request, res: express.Response) {
    try {
      // Validate request body using Joi
      const schema = Joi.object({
        loanTakerId: Joi.number().required(),
        amount: Joi.optional(),
        date: Joi.optional(),
        billNo: Joi.optional(),
        loanType: Joi.optional(),
        status: Joi.optional(),
        limit: Joi.optional(),
        offset: Joi.optional(),
      });

      const { error, value } = schema.validate({ ...req.body, ...req.query });
      if (error) {
        logger.warn(`Validation error: ${error.details[0].message}`);
        return ResponseHandler.error(res, error.details[0].message, 400);
      }

      const { limit, offset, orderBy, order, loanTakerId, amount, status, date, billNo, loanType } = req.query;

      const where: any = {};

      if (amount) where["amount"] = { [Op.like]: `%${amount}%` };
      if (status) where["status"] = { [Op.eq]: status };
      if (date) where["date"] = { [Op.eq]: date };
      if (billNo) where["billNo"] = { [Op.eq]: billNo };
      if (loanType) where["loanType"] = { [Op.eq]: loanType };
      if (loanTakerId) where["loanTakerId"] = loanTakerId;

      const orderQuery: [string, "ASC" | "DESC"][] = orderBy && order ? [[orderBy as string, order as "ASC" | "DESC"]] : [];

      const data = await Loan.findAndCountAll({
        where,
        order: orderQuery,
        distinct: true,
        limit: Number(limit),
        offset: Number(offset),
      });

      logger.info(`Fetched loan list for loan taker ID: ${value.id}, Total records: ${data.count}`);
      return ResponseHandler.success(
        res,
        "Loan list fetched successfully",
        paging(data, Number(offset), Number(limit))
      );

    } catch (error) {
      logger.error("Error fetching loan list", { error });
      return ResponseHandler.error(res, "Error fetching loan list", 500, error);
    }
  }


  // Fetch transaction list by loan taker ID
  async transactionList(req: express.Request, res: express.Response) {
    try {
      // Validate loanTakerId in query parameters
      const schema = Joi.object({
        id: Joi.number().required(),
        orderBy: Joi.string().optional(),
        order: Joi.string().valid("ASC", "DESC").optional(),
        amount: Joi.number().optional(),
        paymentsource: Joi.string().optional(),
        date: Joi.date().optional(),
      });

      const { error, value } = schema.validate(req.query);
      if (error) {
        logger.warn(`Validation error: ${error.details[0].message}`);
        return ResponseHandler.error(res, error.details[0].message, 400);
      }

      const { id, limit, offset, orderBy, order, amount, paymentsource, date } = value;
      const where: any = { loanTakerId: { [Op.eq]: id } };

      if (amount) where["amount"] = { [Op.eq]: amount };
      if (paymentsource) where["paymentSourceId"] = { [Op.eq]: paymentsource };
      if (date) where["date"] = { [Op.eq]: date };

      const orderQuery: [string, "ASC" | "DESC"][] = orderBy && order ? [[orderBy, order]] : [];

      const data = await LoanTransaction.findAndCountAll({
        where,
        order: orderQuery,
        distinct: true,
        limit,
        offset,
      });

      logger.info(`Fetched transactions for loan taker ID: ${id}, Total records: ${data.count}`);
      return ResponseHandler.success(
        res,
        "Transaction list fetched successfully",
        paging(data, Number(offset), limit)
      );

    } catch (error) {
      logger.error("Error fetching transaction list", { error });
      return ResponseHandler.error(res, "Error fetching transaction list", 500, error);
    }
  }


  public async save(req: express.Request, res: express.Response) {
    try {
      // Validate request body
      const schema = Joi.object({
        name: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        email: Joi.string().email().required(),
        cnic: Joi.string().required(),
        description: Joi.optional(),
        status: Joi.optional(),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        logger.warn(`Validation error: ${error.details[0].message}`);
        return ResponseHandler.error(res, error.details[0].message, 400);
      }

      const loanTakerData = {
        ...value,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save data
      const instance = await LoanTaker.create(loanTakerData);
      logger.info(`LoanTaker created successfully with ID: ${instance.id}`);

      return ResponseHandler.success(res, "Added Successfully", instance);
    } catch (error) {
      logger.error("Error in adding LoanTaker", { error });
      return ResponseHandler.error(res, "Error in adding record", 500, error);
    }
  }


  public async update(req: express.Request, res: express.Response) {
    try {
      // Validate request body
      const schema = Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        email: Joi.string().email().required(),
        cnic: Joi.string().required(),
        status: Joi.optional(),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        logger.warn(`Validation error: ${error.details[0].message}`);
        return ResponseHandler.error(res, error.details[0].message, 400);
      }

      const { id, ...updateData } = value;
      updateData.updatedAt = new Date();

      // Check if record exists
      const existingRecord = await LoanTaker.findByPk(id);
      if (!existingRecord) {
        logger.warn(`LoanTaker with ID ${id} not found`);
        return ResponseHandler.error(res, "No record found", 404);
      }

      // Update record
      await LoanTaker.update(updateData, { where: { id } });
      const updatedRecord = await LoanTaker.findByPk(id);

      logger.info(`LoanTaker with ID ${id} updated successfully`);
      return ResponseHandler.success(res, "Updated successfully", updatedRecord);
    } catch (error) {
      logger.error("Error updating LoanTaker", { error });
      return ResponseHandler.error(res, "Error updating record", 500, error);
    }
  }


  public async updateStatus(req: express.Request, res: express.Response) {
    try {
      // Validate request body
      const schema = Joi.object({
        status: Joi.string().required(),
        id: Joi.number().required(),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        logger.warn(`Validation error: ${error.details[0].message}`);
        return ResponseHandler.error(res, error.details[0].message, 400);
      }

      const { id, status } = value;

      // Check if record exists
      const existingRecord = await LoanTaker.findByPk(id);
      if (!existingRecord) {
        logger.warn(`LoanTaker with ID ${id} not found`);
        return ResponseHandler.error(res, "Record not found", 404);
      }

      // Update status
      await LoanTaker.update({ status }, { where: { id } });

      logger.info(`LoanTaker ID ${id} status updated to ${status}`);
      return ResponseHandler.success(res, "Status updated successfully");
    } catch (error) {
      logger.error("Error updating status", { error });
      return ResponseHandler.error(res, "Error updating status", 500, error);
    }
  }


  public async detail(req: express.Request, res: express.Response) {
    try {
      // Validate request body
      const schema = Joi.object({
        id: Joi.number().required(),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        logger.warn(`Validation error: ${error.details[0].message}`);
        return ResponseHandler.error(res, error.details[0].message, 400);
      }

      const { id } = value;

      // Fetch record
      const result = await LoanTaker.findOne({ where: { id } });
      if (!result) {
        logger.warn(`LoanTaker with ID ${id} not found`);
        return ResponseHandler.error(res, "Data not found", 404);
      }

      logger.info(`Fetched details for LoanTaker ID ${id}`);
      return ResponseHandler.success(res, "Detail", result);
    } catch (error) {
      logger.error("Error fetching detail", { error });
      return ResponseHandler.error(res, "Error fetching details", 500, error);
    }
  }


  public async loanDetail(req: express.Request, res: express.Response) {
    try {
      // Validate request body
      const schema = Joi.object({
        id: Joi.number().required(),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        logger.warn(`Validation error: ${error.details[0].message}`);
        return ResponseHandler.error(res, error.details[0].message, 400);
      }

      const { id } = value;

      // Fetch loan details
      const result = await Loan.findOne({ where: { id } });
      if (!result) {
        logger.warn(`Loan with ID ${id} not found`);
        return ResponseHandler.error(res, "Data not found", 404);
      }

      logger.info(`Fetched details for Loan ID ${id}`);
      return ResponseHandler.success(res, "Loan Detail", result);
    } catch (error) {
      logger.error("Error fetching loan details", { error });
      return ResponseHandler.error(res, "Error fetching loan details", 500, error);
    }
  }

  // del user
  public async del(req: express.Request, res: express.Response) {
    try {
      // Validate request body
      const schema = Joi.object({
        id: Joi.number().required(),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        logger.warn(`Validation error: ${error.details[0].message}`);
        return ResponseHandler.error(res, error.details[0].message, 400);
      }

      const { id } = value;

      // Check if record exists
      const existingRecord = await LoanTaker.findByPk(id);
      if (!existingRecord) {
        logger.warn(`LoanTaker with ID ${id} not found`);
        return ResponseHandler.error(res, "Record not found", 404);
      }

      // Delete record
      await LoanTaker.destroy({ where: { id } });

      logger.info(`LoanTaker ID ${id} deleted successfully`);
      return ResponseHandler.success(res, "Successfully deleted");
    } catch (error) {
      logger.error("Error deleting LoanTaker", { error });
      return ResponseHandler.error(res, "Error deleting LoanTaker", 500, error);
    }
  }
}
