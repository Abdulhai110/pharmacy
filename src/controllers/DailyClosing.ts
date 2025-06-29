import express from "express";
import { Loan } from "../models/loan";
import { DistributorLoan } from "../models/DistributorLoan";
import { DistributorDebit } from "../models/DistributorDebit";
import Joi from "joi";
import { ValidationError } from "sequelize";
const { Op } = require("sequelize");
import { paging, enumKeys } from "../helpers/helper";
import { LoanTaker } from "../models/loanTaker";
import { Distributor } from "../models/distributor";
import { DailyClosing as DC } from "../models/DailyClosing";
import { LoanTransaction } from "../models/loanTransaction";
import { Sequelize } from 'sequelize';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import moment from "moment";
import { DistributorCredit } from "../models/DistributorCredit";
import { Expense } from "../models/Expense";
import { ResponseHandler } from "../utils/respHandler";
import logger from "../utils/logger";
import { ExpenseCategory } from "../models/ExpenseCategory";
import { Account } from "../models/BankAccounts";
import { sequelize } from "../config/connection";
import { endOfDay, startOfDay } from "date-fns";
const cloudinary = require("cloudinary").v2;
const puppeteer = require('puppeteer-core');




export class DailyClosing {
  private static instance: DailyClosing | null = null;

  private constructor() { }

  static init(): DailyClosing {
    if (this.instance == null) {
      this.instance = new DailyClosing();
    }

    return this.instance;
  }

  async list(req: express.Request, res: express.Response) {
    try {
      const { limit, offset, orderBy, order, status, closing_date } = req.query;

      const where: any = {};

      if (status) {
        where.status = { [Op.eq]: status };
      }

      if (closing_date) {
        const parsedDate = new Date(closing_date as string);
        where.closing_date = {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)]
        };
      }


      const data = await DC.findAndCountAll({
        where,
        limit: Number(limit),
        offset: Number(offset),
        distinct: true,
      });

      if (data.count === 0 || data.rows.length === 0) {
        return ResponseHandler.error(res, "No daily closing records found", 204);
      }

      return ResponseHandler.success(
        res,
        "Daily closing list fetched successfully",
        paging(data, Number(offset), Number(limit))
      );
    } catch (error) {
      logger.error("Daily closing list error", error);
      return ResponseHandler.error(res, "Failed to fetch daily closing records", 500, error);
    }
  }



  async save(req: express.Request, res: express.Response) {
    const t = await sequelize.transaction();
    try {
      const schema = Joi.object({
        closing_date: Joi.date().required(),
        ten: Joi.number().allow(null).required(),
        twenty: Joi.number().allow(null).required(),
        fifty: Joi.number().allow(null).required(),
        hundred: Joi.number().allow(null).required(),
        fiveHundred: Joi.number().allow(null).required(),
        thousand: Joi.number().allow(null).required(),
        fiveThousand: Joi.number().allow(null).required(),
        coins: Joi.number().allow(null).required(),
        physicalCashTotal: Joi.number().allow(null).required(),
        bankAmount: Joi.number().allow(null).required(),
        todayGrandTotal: Joi.number().allow(null).required(),
        yesterdaySale: Joi.number().allow(null).required(),
        todaySale: Joi.number().allow(null).required(),
        salesTotal: Joi.number().allow(null).required(),
        distributorsDebit: Joi.number().allow(null).required(),
        distributorsCredit: Joi.number().allow(null).required(),
        loanTakersDebit: Joi.number().allow(null).required(),
        loanTakersCredit: Joi.number().allow(null).required(),
        expenses: Joi.number().allow(null).required(),
        dayTotal: Joi.number().allow(null).required(),
        dayClosingGap: Joi.number().allow(null).required(),
        description: Joi.string().allow(null, ''),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        await t.rollback();
        return ResponseHandler.error(res, error.details[0].message, 400);
      }

      const closing_date = new Date(value.closing_date);


      const existingClosing = await DC.findOne({
        where: {
          closing_date: {
            [Op.between]: [startOfDay(closing_date), endOfDay(closing_date)]
          }
        }
      });

      if (existingClosing) {
        await t.rollback();
        return ResponseHandler.error(res, "Closing already exists for this date.", 400);
      }

      const newRecord = await DC.create(
        {
          ...value
        },
        { transaction: t }
      );

      await t.commit();
      return ResponseHandler.success(res, "Daily closing record added successfully", newRecord);
    } catch (error) {
      await t.rollback();
      logger.error("Daily closing save error", error);
      return ResponseHandler.error(res, "Failed to save daily closing", 500, error);
    }
  }

  public async update(req: express.Request, res: express.Response) {
    const schema = Joi.object().keys({
      id: Joi.number().required(),
      distributorId: Joi.number().required(),
      // loanType: Joi.string().optional().valid("cash", "items"),
      amount: Joi.number().optional().integer().min(1),
      billNo: Joi.number().optional().integer(),
      description: Joi.string().optional(),
      paymentSourceId: Joi.optional(),
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

    const debit: any = await Loan.findByPk(req.body.id);

    if (!debit) {
      res.Error("No Record Found");
      return;
    }

    const debitData = {
      distributorId: req.body.distributorId,
      amount: req.body.amount,
      description: req.body.description ?? null,
      billNo: req.body.billNo ?? null, // Make billNo optional using conditional assignment
      status: req.body.status,
      paymentSourceId: req.body.paymentSourceId ?? "",
      updatedAt: new Date(),
      returnDate: req.body.returnDate ?? null,
      installmentCount: req.body.installmentCount ?? 0,
      installmentAmount: req.body.installmentAmount ?? 0,
    };
    try {
      const instance = await DistributorDebit.update(debitData, {
        where: { id: req.body.id },
      });
      if (!instance) {
        return res.Error("Error in updating record please fill correct data");
      }
      const res_data = await DistributorDebit.findByPk(req.body.id);
      return res.Success("updated successfully", res_data);
    } catch (e: any) {
      return res.Error("Error in updating record please fill correct data");
      console.log("Error in updating Loan", e);
      (global as any).log.error(e);
    }
  }


  /* public async detail(req: express.Request, res: express.Response) {
    try {
      const schema = Joi.object({
        id: Joi.number().required(),
      });

      const { error, value } = schema.validate({ ...req.params, ...req.query });

      if (error) {
        return ResponseHandler.error(res, error.details[0].message, 400);
      }

      // Get the Daily Closing (DC) record
      const record = await DC.findOne({
        where: { id: value.id },
        // Include associations if necessary (adjust as per your data models)
        include: [
          {
            model: LoanTaker,
            include: [
              {
                model: LoanTransaction,
                required: false,
                where: {
                  date: {
                    [Op.eq]: Sequelize.col('DailyClosing.closing_date'),
                  },
                },
              },
              {
                model: Loan,
                required: false,
                where: {
                  date: {
                    [Op.eq]: Sequelize.col('DailyClosing.closing_date'),
                  },
                },
              },
            ],
          },
          {
            model: Distributor,
            include: [
              {
                model: DistributorCredit,
                where: {
                  date: {
                    [Op.eq]: Sequelize.col('DailyClosing.closing_date'),
                  },
                },
              },
              {
                model: DistributorDebit,
                where: {
                  date: {
                    [Op.eq]: Sequelize.col('DailyClosing.closing_date'),
                  },
                },
              },
            ],
          },
          {
            model: Expense,
            where: {
              expense_date: {
                [Op.eq]: Sequelize.col('DailyClosing.closing_date'),
              },
            },
          },
        ],
      });

      if (!record) {
        return ResponseHandler.error(res, "Record not found", 404);
      }

      return ResponseHandler.success(res, "Detail fetched successfully", record);
    } catch (err) {
      logger.error("Error fetching day-end detail", err);
      return ResponseHandler.error(res, "Internal Server Error", 500, err);
    }
  } */


  public async detail(req: express.Request, res: express.Response) {
    try {
      const schema = Joi.object({
        id: Joi.number().required(),
      });

      const { error, value } = schema.validate({ ...req.params, ...req.query });

      if (error) {
        return ResponseHandler.error(res, error.details[0].message, 400);
      }

      const record = await DC.findOne({ where: { id: value.id } });

      if (!record) {
        return ResponseHandler.error(res, "Record not found", 404);
      }

      // Extract closing_date and compute start of day
      const closingDate = moment(record.closing_date).startOf('day').toDate();

      const where = {
        createdAt: {
          [Op.gte]: closingDate,
        },
      };

      // Fetch all related data using the same date condition
      const [loanTakersData, distributorsData, expensesData] = await Promise.all([
        LoanTaker.findAll({
          include: [
            {
              model: Loan,
              where,
              as: 'Loans',
              required: false,
            },
            {
              model: LoanTransaction,
              where,
              as: 'LoanTransactions',
              required: false,
            },
          ],
          where: {
            [Op.or]: [
              Sequelize.literal("Loans.id IS NOT NULL"),
              Sequelize.literal("LoanTransactions.id IS NOT NULL"),
            ],
          },
        }),

        Distributor.findAll({
          include: [
            {
              model: DistributorCredit,
              where,
              required: false,
            },
            {
              model: DistributorDebit,
              where,
              required: false,
            },
          ],
          where: {
            [Op.or]: [
              Sequelize.literal("`DistributorCredits`.`id` IS NOT NULL"),
              Sequelize.literal("`DistributorDebits`.`id` IS NOT NULL"),
            ],
          },
        }),

        Expense.findAll({
          where,
          include: [
            {
              model: ExpenseCategory,
              as: 'ExpenseCategory',
              attributes: ['id', 'name', 'description'],
              required: false,
            },
            // {
            //   model: Account,
            //   required: false,
            // }
          ]
        }),
      ]);

      // Combine the results in one response
      return ResponseHandler.success(res, "Detail fetched successfully", {
        dailyClosing: record,
        loanTakers: loanTakersData,
        distributors: distributorsData,
        expenses: expensesData,
      });

    } catch (err) {
      logger.error("Error fetching day-end detail", err);
      return ResponseHandler.error(res, "Internal Server Error", 500, err);
    }
  }




  public async todayTransaction(req: express.Request, res: express.Response) {
    /* const schema = Joi.object().keys({
      id: Joi.number().required(),
    });
    const { error, value } = schema.validate(req.body);

    if (error) {
      return ResponseHandler.error(res, error.details[0].message, 400);
    } */

    let todayDate: any = req.query.date || moment().format("YYYY-MM-DD 00:00:00");
    const startDate = moment(todayDate).startOf("day").toDate();


    const where: any = {
      createdAt: {
        [Op.gte]: startDate,
      },
    };

    const loanTakersData = await LoanTaker.findAll({
      include: [
        {
          model: Loan,
          where,
          as: 'Loans',
          required: false,
        },
        {
          model: LoanTransaction,
          where,
          as: 'LoanTransactions',
          required: false,
        },
      ],
      where: {
        [Op.or]: [
          Sequelize.literal("Loans.id IS NOT NULL"),
          Sequelize.literal("LoanTransactions.id IS NOT NULL"),
        ],
      },
    });

    const distributorsData = await Distributor.findAll({
      include: [
        {
          model: DistributorCredit,
          where,
          required: false,
        },
        {
          model: DistributorDebit,
          where,
          required: false,
        },
      ],
      where: {
        [Op.or]: [
          Sequelize.literal("`DistributorCredits`.`id` IS NOT NULL"),
          Sequelize.literal("`DistributorDebits`.`id` IS NOT NULL"),
        ],
      },
    });

    const expensesDetail = await Expense.findAll({
      where,
      include: [
        {
          model: ExpenseCategory,
          as: 'ExpenseCategory',
          attributes: ['id', 'name', 'description'],
          required: false
        }
      ]
    });

    const startOfYesterday = new Date();
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    startOfYesterday.setHours(0, 0, 0, 0);

    const endOfYesterday = new Date();
    endOfYesterday.setDate(endOfYesterday.getDate() - 1);
    endOfYesterday.setHours(23, 59, 59, 999);

    const closingDetail = await DC.findOne({
      where: {
        closing_date: {
          [Op.between]: [startOfYesterday, endOfYesterday],
        },
      },
    });

    const accountsDetail = await Account.findAll();



    const noDataFound =
      (!loanTakersData || loanTakersData.length === 0) &&
      (!distributorsData || distributorsData.length === 0) &&
      (!expensesDetail || expensesDetail.length === 0) &&
      (!accountsDetail || accountsDetail.length === 0) &&
      (!closingDetail);

    if (noDataFound) {
      return ResponseHandler.error(res, "No Data Found", 404);
    }

    const today_transaction_detail = {
      loanTakers: loanTakersData,
      distributors: distributorsData,
      expenses: expensesDetail,
      accounts: accountsDetail,
      yesterdayClosing: closingDetail,
    };

    return ResponseHandler.success(res, "Today's Transactions", today_transaction_detail);
  }


  public async downloadPdf(req: express.Request, res: express.Response) {
    const schema = Joi.object().keys({
      id: Joi.number().required(),
    });

    const { error, value } = schema.validate(req.body.params);

    if (error instanceof ValidationError) {
      res.Error(error.details[0].message);
      return;
    }


    try {
      // const result = await DC.findOne({
      //   where: { id: Number(req.body.id) },
      //   include: [
      //     {
      //       model: LoanTaker,
      //       include: [
      //         {
      //           model: LoanTransaction,
      //           required: false,
      //           where: {
      //             date: {
      //               [Op.eq]: Sequelize.col('DailyClosing.closingDate'),
      //             },
      //           },
      //         },
      //         {
      //           model: Loan,
      //           required: false,
      //           where: {
      //             date: {
      //               [Op.eq]: Sequelize.col('DailyClosing.closingDate'),
      //             },
      //           },
      //         },
      //       ],
      //       required: false,
      //     },
      //   ],
      // });

      // if (!result) {
      //   res.Error("Data not found");
      //   return;
      // }
      const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Update to the correct path
      });

      const page = await browser.newPage();

      // HTML content for the PDF
      const content = `<html>
      <body>
        <h1>Your PDF Content</h1>
        <p>This PDF was generated using Puppeteer.</p>
      </body>
    </html>`;

      await page.setContent(content);
      const pdfBuffer = await page.pdf({ format: 'A4' });
      await browser.close();

      // Send the buffer with proper headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=generated-pdf.pdf');
      res.send(pdfBuffer);

    } catch (error) {
      console.error("Error fetching closing details:", error);
      res.Error("An error occurred while fetching closing details");
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
