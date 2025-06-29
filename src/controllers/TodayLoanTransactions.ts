import express from "express";
// import { Loan } from "../models/Loan";
import { Loan } from "../models/loan";
import Joi from "joi";
import { Sequelize, ValidationError, Op } from "sequelize";
import { paging, enumKeys } from "../helpers/helper";
import { LoanTaker } from "../models/loanTaker";
import { LoanTransaction } from "../models/loanTransaction";
import moment from "moment";
import { Distributor } from "../models/distributor";
import { DistributorCredit } from "../models/DistributorCredit";
import { DistributorDebit } from "../models/DistributorDebit";
import { LoanTypeEnum } from "../constants/enum";

const cloudinary = require("cloudinary").v2;
export class TodayTransactions {
  private static instance: TodayTransactions | null = null;

  private constructor() { }

  static init(): TodayTransactions {
    if (this.instance == null) {
      this.instance = new TodayTransactions();
    }

    return this.instance;
  }
  async todayLoanTransactions(req: express.Request, res: express.Response) {
    try {
      let todayDate: any;

      if (req.query.date) {
        // Parse and format the provided date string
        todayDate = req.query.date;
      } else {
        // If no date is provided, default to today's date
        todayDate = moment(new Date()).format("YYYY-MM-DD 00:00:00");
      }

      // Set the start and end of the day for the date
      const startDate = moment(todayDate).startOf("day").toDate();

      const where: any = {
        createdAt: {
          [Op.gte]: startDate,
        },
      };

      const loanTakersData = await LoanTaker.findAll({
        // where: where,
        include: [
          {
            model: Loan,
            where: where,
            required: false,
          },
          {
            model: LoanTransaction,
            where: where,
            required: false,
          },
        ],
        where: {
          [Op.or]: [
            Sequelize.literal("Loans.id IS NOT NULL"), // Checking if there are any associated loans
            Sequelize.literal("LoanTransactions.id IS NOT NULL"), // Checking if there are any associated loan transactions
          ],
        },
      });

      res.Success("Success", loanTakersData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async todayDistributorsTransactions(
    req: express.Request,
    res: express.Response
  ) {
    try {
      let todayDate: any;

      if (req.query.date) {
        // Parse and format the provided date string
        todayDate = req.query.date;
      } else {
        // If no date is provided, default to today's date
        todayDate = moment(new Date()).format("YYYY-MM-DD 00:00:00");
      }

      // Set the start and end of the day for the date
      const startDate = moment(todayDate).startOf("day").toDate();

      const where: any = {
        createdAt: {
          [Op.gte]: startDate,
        },
      };

      const distributorsData = await Distributor.findAll({
        include: [
          {
            model: DistributorCredit,
            where: where,
            required: false,
          },
          {
            model: DistributorDebit,
            where: where,
            required: false,
          },
        ],
        where: {
          [Op.or]: [
            Sequelize.literal("`DistributorCredits`.`id` IS NOT NULL"), // Checking if there are any associated credits
            Sequelize.literal("`DistributorDebits`.`id` IS NOT NULL"), // Checking if there are any associated debits
          ],
        },
      });

      res.Success("Success", distributorsData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async list(req: express.Request, res: express.Response) {
    let qp = req.query;
    let perPage: any = Number(qp.perPage) > 0 ? Number(qp.perPage) : 10;
    let pageNo: any = Number(qp.page) > 0 ? Number(qp.page) - 1 : 0;
    let order: Array<any> = [];
    if (req.query.orderBy && req.query.order) {
      order.push([req.query.orderBy as string, req.query.order as string]);
    }

    const where: any = {};

    if (qp.keyword) {
      where["name"] = { [Op.like]: "%" + qp.keyword + "%" };
    }

    if (qp.status && qp.status != "" && qp.status != null) {
      where["status"] = {
        [Op.eq]: qp.status,
      };
    }

    if (qp.loanType && qp.loanType != "" && qp.loanType != null) {
      where["loanType"] = {
        [Op.eq]: qp.loanType,
      };
    }

    if (qp.date && qp.date != "" && qp.date != null) {
      where["date"] = {
        [Op.eq]: qp.date,
      };
    }

    let pagination = {};

    if (qp?.perPage && qp?.page) {
      pagination = {
        offset: perPage * pageNo,
        limit: perPage,
      };
    }

    const data = await Loan.findAndCountAll({
      where,
      order,
      distinct: true,
      ...pagination,
    }).catch((e) => {
      console.log(e);
    });

    if (qp.hasOwnProperty("page")) {
      return res.Success("list", paging(data, pageNo, perPage));
    } else {
      return res.Success("list", data);
    }
  }

  public async save(req: express.Request, res: express.Response) {
    const schema = Joi.object().keys({
      loanTakerId: Joi.number().required(),
      loanType: Joi.string().required().valid(...enumKeys(LoanTypeEnum)),
      amount: Joi.number().required().integer().min(1),
      billNo: Joi.number().optional().integer(),
      description: Joi.string().optional(),
      returnDate: Joi.optional(),
      installmentCount: Joi.optional(),
      installmentAmount: Joi.optional(),
      date: Joi.string().required(),
      status: Joi.required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error instanceof ValidationError) {
      return res.Error(error.details[0].message);
    }

    const catData = {
      loanTakerId: req.body.loanTakerId,
      loanType: req.body.loanType,
      amount: req.body.amount,
      description: req.body.description ?? null,
      installmentAmount: req.body.installmentAmount ?? 0,
      installmentCount: req.body.installmentCount ?? 0,
      returnDate: req.body.returnDate ?? null,
      billNo: req.body.billNo ?? null, // Make billNo optional using conditional assignment
      date: req.body.date,
      status: req.body.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const loanTakerId = Number(req.body.loanTakerId);
    const additionalAmount = req.body.amount;
    try {
      const instance = await Loan.create(catData);
      const loanTaker = await LoanTaker.findOne({
        where: { id: loanTakerId },
      });

      if (loanTaker) {
        let currentLoanAmount = loanTaker.loanAmount;
        let remainingLoanAmount = loanTaker.remainingAmount;

        currentLoanAmount += additionalAmount;

        // Calculate the remaining loan amount after the update
        remainingLoanAmount = remainingLoanAmount + additionalAmount;

        // Update the loan amount in the database
        await LoanTaker.update(
          {
            loanAmount: currentLoanAmount,
            remainingAmount: remainingLoanAmount,
          },
          { where: { id: loanTakerId } }
        );
      } else {
        return res.Error("Pass Correct Loan Taker id");
      }

      return res.Success("Added Successfully", instance);
    } catch (e: any) {
      console.log("Error", e);
      return res.Error("Error in adding record");
      //   (global as any).log.error(e);
    }
  }

  public async update(req: express.Request, res: express.Response) {
    const schema = Joi.object().keys({
      id: Joi.number().required(),
      loanTakerId: Joi.number().required(),
      loanType: Joi.string().optional().valid(...enumKeys(LoanTypeEnum)),
      amount: Joi.number().optional().integer().min(1),
      billNo: Joi.number().optional().integer(),
      description: Joi.string().optional(),
      status: Joi.optional(),
      returnDate: Joi.optional(),
      installmentCount: Joi.optional(),
      installmentAmount: Joi.optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error instanceof ValidationError) {
      res.Error(error.details[0].message);
      return;
    }

    const Loanr: any = await Loan.findByPk(req.body.id);

    if (!Loanr) {
      res.Error("No Record Found");
      return;
    }

    const LoanData = {
      loanTakerId: req.body.loanTakerId,
      loanType: req.body.loanType,
      amount: req.body.amount,
      description: req.body.description ?? null,
      billNo: req.body.billNo ?? null, // Make billNo optional using conditional assignment
      status: req.body.status,
      updatedAt: new Date(),
      returnDate: req.body.returnDate ?? null,
      installmentCount: req.body.installmentCount ?? 0,
      installmentAmount: req.body.installmentAmount ?? 0,
    };
    try {
      const instance = await Loan.update(LoanData, {
        where: { id: req.body.id },
      });
      if (!instance) {
        return res.Error("Error in updating record please fill correct data");
      }
      const res_data = await Loan.findByPk(req.body.id);
      return res.Success("updated successfully", res_data);
    } catch (e: any) {
      return res.Error("Error in updating record please fill correct data");
      console.log("Error in updating Loan", e);
      (global as any).log.error(e);
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

    const result = await Loan.findOne({
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

    const data: any = await Loan.update(
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
      let data = await Loan.destroy({
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
