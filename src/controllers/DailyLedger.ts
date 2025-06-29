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
import { DailyLedger as DL } from "../models/DailyLedger";

const cloudinary = require("cloudinary").v2;

export class DailyLedger {
  private static instance: DailyLedger | null = null;

  private constructor() { }

  static init(): DailyLedger {
    if (this.instance == null) {
      this.instance = new DailyLedger();
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
    // where["distributorId"] = req.query.id;
    // if (qp.keyword) {
    //   where["name"] = { [Op.like]: "%" + qp.keyword + "%" };
    // }

    if (qp.status && qp.status != "" && qp.status != null) {
      where["status"] = {
        [Op.eq]: qp.status,
      };
    }

    // if (qp.loanType && qp.loanType != "" && qp.loanType != null) {
    //   where["loanType"] = {
    //     [Op.eq]: qp.loanType,
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

    // if (qp.billNo && qp.billNo != "" && qp.billNo != null) {
    //   where["billNo"] = {
    //     [Op.eq]: qp.billNo,
    //   };
    // }

    let pagination = {};

    if (qp?.perPage && qp?.page) {
      pagination = {
        offset: perPage * pageNo,
        limit: perPage,
      };
    }

    const data = await DL.findAndCountAll({
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
      ledger_date: Joi.required(),
      rs_ten: Joi.number().required(),
      rs_twenty: Joi.number().required(),
      rs_fifty: Joi.number().required(),
      rs_hundred: Joi.number().required(),
      rs_5hundred: Joi.number().required(),
      rs_thousand: Joi.number().required(),
      rs_5thousand: Joi.number().required(),
      coins: Joi.number().required(),
      rs_total: Joi.number().required(),
      jazz_cash: Joi.number().required(),
      easy_pasa: Joi.number().required(),
      bank: Joi.number().required(),
      accounts_total: Joi.number().required(),
      grand_total: Joi.number().required(),
      // status: Joi.required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error instanceof ValidationError) {
      return res.Error(error.details[0].message);
    }
    console.log("dataREC", req.body);
    const catData = {
      ledger_date: req.body.ledger_date,
      rs_ten: req.body.rs_ten,
      // description: req.body.description || "",
      rs_twenty: req.body.rs_twenty,
      rs_fifty: req.body.rs_fifty,
      rs_hundred: req.body.rs_hundred,
      rs_5hundred: req.body.rs_5hundred,
      rs_thousand: req.body.rs_thousand,
      rs_5thousand: req.body.rs_5thousand,
      coins: req.body.coins,
      rs_total: req.body.rs_total,
      jazz_cash: req.body.jazz_cash,
      easy_pasa: req.body.easy_pasa,
      bank: req.body.easy_pasa,
      accounts_total: req.body.bank,
      grand_total: req.body.grand_total,
      // status: req.body.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // const distributorId = Number(req.body.distributorId);
    // const additionalAmount = req.body.amount;
    try {
      const instance = await DL.create(catData);

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
