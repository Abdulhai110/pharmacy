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
const cloudinary = require("cloudinary").v2;

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
    let qp = req.query;
    let perPage: any = Number(qp.perPage) > 0 ? Number(qp.perPage) : 10;
    let pageNo: any = Number(qp.page) > 0 ? Number(qp.page) - 1 : 0;
    let order: Array<any> = [];
    if (req.query.orderBy && req.query.order) {
      order.push([req.query.orderBy as string, req.query.order as string]);
    }

    const where: any = {};
    // where["distributor_id"] = req.query.id;
    // if (qp.keyword) {
    //   where["name"] = { [Op.like]: "%" + qp.keyword + "%" };
    // }

    if (qp.status && qp.status != "" && qp.status != null) {
      where["status"] = {
        [Op.eq]: qp.status,
      };
    }

    // if (qp.loan_type && qp.loan_type != "" && qp.loan_type != null) {
    //   where["loan_type"] = {
    //     [Op.eq]: qp.loan_type,
    //   };
    // }

    if (qp.date && qp.date != "" && qp.date != null) {
      where["date"] = {
        [Op.eq]: qp.date,
      };
    }

    // if (qp.amount && qp.amount != "" && qp.amount != null) {
    //   where["amount"] = {
    //     [Op.eq]: qp.amount,
    //   };
    // }

    // if (qp.bill_no && qp.bill_no != "" && qp.bill_no != null) {
    //   where["bill_no"] = {
    //     [Op.eq]: qp.bill_no,
    //   };
    // }

    let pagination = {};

    if (qp?.perPage && qp?.page) {
      pagination = {
        offset: perPage * pageNo,
        limit: perPage,
      };
    }

    const data = await DC.findAndCountAll({
      // include: { model: Loan },
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
      closingDate: Joi.date().required(),
      rsTen: Joi.number().required(),
      status: Joi.required(),
      rsTwenty: Joi.number().required(),
      rsFifty: Joi.number().required(),
      rsHundred: Joi.number().required(),
      rs5hundred: Joi.number().required(),
      rsThousand: Joi.number().required(),
      rs5thousand: Joi.number().required(),
      coins: Joi.number().required(),
      rsTotal: Joi.number().required(),
      jazzCash: Joi.number().required(),
      easyPasa: Joi.number().required(),
      bank: Joi.number().required(),
      accountsTotal: Joi.number().required(),
      todayGrandTotal: Joi.number().required(), // Assuming grand_total represents todayGrandTotal
      yesterdaySale: Joi.number().required(),
      yesterdayTotalAmount: Joi.number().required(),
      todaySale: Joi.number().required(),
      salesTotal: Joi.number().required(),
    });


    const { error, value } = schema.validate(req.body);
    if (error instanceof ValidationError) {
      return res.Error(error.details[0].message);
    }
    console.log(req.body);
    const catData = {
      // id: req.body.id,
      loanTakerId: req.body.loanTakerId,
      distributorId: req.body.distributorId,
      closingDate: req.body.closingDate,
      rsTen: req.body.rsTen,
      rsTwenty: req.body.rsTwenty,
      rsFifty: req.body.rsFifty,
      rsHundred: req.body.rsHundred,
      rs5hundred: req.body.rs5hundred,
      rsThousand: req.body.rsThousand,
      rs5thousand: req.body.rs5thousand,
      coins: req.body.coins,
      rsTotal: req.body.rsTotal,
      jazzCash: req.body.jazzCash,
      easyPasa: req.body.easyPasa,
      bank: req.body.bank,
      accountsTotal: req.body.accountsTotal,
      todayGrandTotal: req.body.todayGrandTotal,
      yesterdaySale: req.body.yesterdaySale,
      yesterdayTotalAmount: req.body.yesterdayTotalAmount,
      todaySale: req.body.todaySale,
      salesTotal: req.body.salesTotal,
      // description: req.body.description,
      // status: req.body.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // const distributorId = Number(req.body.distributor_id);
    // const additionalAmount = req.body.amount;
    try {
      const instance = await DC.create(catData);

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
      distributor_id: Joi.number().required(),
      // loan_type: Joi.string().optional().valid("cash", "items"),
      amount: Joi.number().optional().integer().min(1),
      bill_no: Joi.number().optional().integer(),
      description: Joi.string().optional(),
      payment_source: Joi.optional(),
      status: Joi.optional(),
      return_date: Joi.optional(),
      installment_count: Joi.optional(),
      installment_amount: Joi.optional(),
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
      distributor_id: req.body.distributor_id,
      amount: req.body.amount,
      description: req.body.description ?? null,
      bill_no: req.body.bill_no ?? null, // Make bill_no optional using conditional assignment
      status: req.body.status,
      payment_source: req.body.payment_source ?? "",
      updatedAt: new Date(),
      return_date: req.body.return_date ?? null,
      installment_count: req.body.installment_count ?? 0,
      installment_amount: req.body.installment_amount ?? 0,
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

  public async detail(req: express.Request, res: express.Response) {
    const schema = Joi.object().keys({
      id: Joi.number().required(),
    });
    const { error, value } = schema.validate(req.body);

    if (error instanceof ValidationError) {
      res.Error(error.details[0].message);
      return;
    }

    const result = await DC.findOne({
      where: { id: Number(req.body.id) },
      include: [
        {
          model: LoanTaker,
          include: [
            {
              model: LoanTransaction,
              required: false,
              where: {
                transaction_date: {
                  [Op.eq]: Sequelize.col('DailyClosing.closingDate'),
                },
              },
            },
            {
              model: Loan,
              required: false,
              where: {
                date: {
                  [Op.eq]: Sequelize.col('DailyClosing.closingDate'),
                },
              },
            },
          ],
          required: false,
        },
      ],
    });
    // console.log(review);

    if (result === null) {
      res.Error("Data not found");
      return;
    }

    res.Success("Detail", result);
  }

  public async downloadPdf(req: express.Request, res: express.Response) {
    const schema = Joi.object().keys({
      id: Joi.number().required(),
    });

    console.log('bodyyyyyyy', req.body.params);

    const { error, value } = schema.validate(req.body.params);

    if (error instanceof ValidationError) {
      res.Error(error.details[0].message);
      return;
    }


    try {
      const result = await DC.findOne({
        where: { id: Number(req.body.id) },
        include: [
          {
            model: LoanTaker,
            include: [
              {
                model: LoanTransaction,
                required: false,
                where: {
                  transaction_date: {
                    [Op.eq]: Sequelize.col('DailyClosing.closingDate'),
                  },
                },
              },
              {
                model: Loan,
                required: false,
                where: {
                  date: {
                    [Op.eq]: Sequelize.col('DailyClosing.closingDate'),
                  },
                },
              },
            ],
            required: false,
          },
        ],
      });

      if (!result) {
        res.Error("Data not found");
        return;
      }



      const doc = new PDFDocument();

      // Buffer to store the PDF data
      let buffer = Buffer.from('');

      // Pipe the PDF document to the buffer
      doc.on('data', (chunk) => {
        buffer = Buffer.concat([buffer, chunk]);
      });

      // Once the PDF document is fully generated
      doc.on('end', () => {
        // Set the response headers to indicate a PDF file
        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', 'attachment; filename="detail.pdf"');
        // Send the PDF data as the response
        res.send(buffer);
      });

      // Write the retrieved information to the PDF document
      doc.text(JSON.stringify(result, null, 2));

      // Finalize the PDF document
      doc.end();
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
