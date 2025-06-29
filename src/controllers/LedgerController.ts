import { Request, Response } from "express";
import { Distributor } from "../models/distributor";
import { DistributorCredit } from "../models/DistributorCredit";
import { DistributorDebit } from "../models/DistributorDebit";
import { Expense } from "../models/Expense";
import { ExpenseCategory } from "../models/ExpenseCategory";
import { Loan } from "../models/loan";
import { LoanTaker } from "../models/loanTaker";
import { LoanTransaction } from "../models/loanTransaction";
import { Op, Sequelize } from "sequelize";
import { sequelize } from "../config/connection";
import Joi from "joi";
import logger from "../utils/logger";
import { ResponseHandler } from "../utils/respHandler";
import { ModuleTypeEnum } from "../constants/enum";
import { enumKeys } from "../helpers/helper";
export class LedgerController {
  private static instance: LedgerController | null = null;

  private constructor() { }

  static init(): LedgerController {
    if (this.instance == null) {
      this.instance = new LedgerController();
    }
    return this.instance;
  }

  async getLedger(req: Request, res: Response) {
    // Validation
    const schema = Joi.object<LedgerRequest>({
      moduleType: Joi.string().valid(...enumKeys(ModuleTypeEnum)).required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      entityId: Joi.number().optional(),
      gst: Joi.boolean().optional().default(false),
      advTax: Joi.boolean().optional().default(false),
      generatePdf: Joi.boolean().optional().default(false)
    });

    const { error, value } = schema.validate(req.query);

    if (error) {
      logger.warn("Validation failed in getLedger:", error.details[0].message);
      return ResponseHandler.error(res, error.details[0].message, 400);
    }

    let { moduleType, startDate, endDate, entityId, gst, advTax, generatePdf } = value;

    try {

      startDate = new Date(startDate);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(endDate);
      endDate.setHours(23, 59, 59, 999);

      const whereCondition = {
        date: {
          [Op.between]: [startDate, endDate],
        },
      };


      let data: LedgerEntry[] = [];
      let openingBalances: Record<number, OpeningBalance> = {};
      let title: string;

      if (gst || advTax) {
        // title = gst ? "GST Ledger" : "ADV Tax Ledger";
        ({ data, openingBalances, title } = await this.processDistributors(whereCondition, startDate, entityId, gst, advTax));
      } else {
        switch (moduleType) {
          case ModuleTypeEnum.loanTakers:
            ({ data, openingBalances, title } = await this.processLoanTakers(whereCondition, startDate, entityId));
            break;
          case ModuleTypeEnum.distributors:
            ({ data, openingBalances, title } = await this.processDistributors(whereCondition, startDate, entityId));
            break;
          case ModuleTypeEnum.expenses:
            ({ data, openingBalances, title } = await this.processExpenses(whereCondition, entityId));
            break;
        }
      }
      const hasValidData =
        moduleType === ModuleTypeEnum.expenses
          ? data.length > 0
          : data.length > 1;

      if (!hasValidData) {
        logger.info("No records found for PDF generation", { moduleType, startDate, endDate, entityId });
        return ResponseHandler.error(res, "No records found in the given date range.", 404);
      }

      if (generatePdf) {
        return this.generatePdfResponse(res, moduleType, data, openingBalances, entityId, title, startDate, endDate, gst, advTax);
      } else {
        logger.info("Ledger fetched successfully", { moduleType, startDate, endDate, entityId });
        return ResponseHandler.success(res, "Ledger fetched successfully", {
          data,
          openingBalances,
          startDate,
          endDate,
        });
      }


    } catch (err) {
      logger.error("Error in getLedger:", err);
      return ResponseHandler.error(res, "Internal Server Error", 500, err);
    }
  }

  private async processLoanTakers(whereCondition: any, startDate: Date, entityId?: number) {
    const [loanTakers, { openingBalances, title }] = await Promise.all([
      LoanTaker.findAll({
        where: entityId ? { id: entityId } : {},
        include: [
          {
            model: Loan,
            where: whereCondition,
            as: "Loans",
            required: false,
            separate: true,
            order: [['date', 'ASC']],
          },
          {
            model: LoanTransaction,
            where: whereCondition,
            as: "LoanTransactions",
            required: false,
            separate: true,
            order: [['date', 'ASC']],
          },
        ],
      }),
      this.calculateLoanTakerOpeningBalances(startDate, entityId)
    ]);

    const data = this.formatLoanTakerData(loanTakers, openingBalances, startDate);
    return { data, openingBalances, title };
  }

  private async calculateLoanTakerOpeningBalances(startDate: Date, entityId?: number) {
    const where: any = { date: { [Op.lt]: startDate } };
    if (entityId) where.loanTakerId = entityId;

    const [loans, repayments] = await Promise.all([
      Loan.findAll({
        attributes: [
          ['loanTakerId', 'loanTakerId'],
          [sequelize.fn('sum', sequelize.col('amount')), 'total']
        ],
        where,
        group: ['loanTakerId'],
        raw: true
      }) as unknown as Promise<AggregationResult[]>,

      LoanTransaction.findAll({
        attributes: [
          ['loanTakerId', 'loanTakerId'],
          [sequelize.fn('sum', sequelize.col('amount')), 'total']
        ],
        where,
        group: ['loanTakerId'],
        raw: true
      }) as unknown as Promise<AggregationResult[]>
    ]);

    const loanTakers = await LoanTaker.findAll({
      where: entityId ? { id: entityId } : {},
      attributes: ['id', 'name', 'phoneNumber']
    });

    const openingBalances: Record<number, OpeningBalance> = {};
    let title: string;

    loanTakers.forEach(lt => {
      const loanTotal = loans.find(l => l.loanTakerId === lt.id)?.total || 0;
      const repaymentTotal = repayments.find(r => r.loanTakerId === lt.id)?.total || 0;

      openingBalances[lt.id] = {
        name: lt.name,
        phoneNumber: lt.phoneNumber,
        openingBalance: loanTotal - repaymentTotal
      };

      title = lt.name || '';
    });

    return { openingBalances, title };
  }

  private formatLoanTakerData(loanTakersData: any[], openingBalances: Record<number, OpeningBalance>, startDate: Date): LedgerEntry[] {
    return loanTakersData.flatMap(lt => {
      const entries: LedgerEntry[] = [];
      const openingBalance = openingBalances[lt.id]?.openingBalance || 0;

      // Add opening balance
      entries.push({
        id: `opening-${lt.id}`,
        date: null,
        type: 'Opening Balance',
        description: `Opening balance as of ${startDate.toLocaleDateString()}`,
        runningBalance: openingBalance
      });

      // Combine and sort all transactions chronologically
      const allTransactions = [
        ...(lt.Loans?.map((loan: any) => ({
          ...loan.toJSON(),
          _type: 'loan',
          _sortDate: new Date(loan.date)
        })) || []),
        ...(lt.LoanTransactions?.map((txn: any) => ({
          ...txn.toJSON(),
          _type: 'repayment',
          _sortDate: new Date(txn.date)
        })) || [])
      ].sort((a, b) => a._sortDate - b._sortDate);

      // Process transactions in chronological order
      let runningBalance = openingBalance;
      allTransactions.forEach(txn => {
        if (txn._type === 'loan') {
          runningBalance += txn.amount;
          entries.push({
            id: txn.id,
            date: txn.date,
            type: 'Loan Given',
            entityId: lt.id,
            entityName: lt.name,
            phone: lt.phoneNumber,
            debitAmount: txn.amount,
            description: txn.description,
            runningBalance,
            billNo: txn.billNo
          });
        } else {
          runningBalance -= txn.amount;
          entries.push({
            id: txn.id,
            date: txn.date,
            type: 'Repayment',
            entityId: lt.id,
            entityName: lt.name,
            phone: lt.phoneNumber,
            creditAmount: txn.amount,
            description: txn.description,
            runningBalance,
            paymentSourceId: txn.paymentSourceId
          });
        }
      });

      return entries;
    });
  }

  private async processDistributors(whereCondition: any, startDate: Date, entityId?: number, gst?: boolean, advTax?: boolean) {
    const [distributors, { openingBalances, title }] = await Promise.all([
      Distributor.findAll({
        where: entityId ? { id: entityId } : {},
        include: [
          {
            model: DistributorDebit,
            where: whereCondition,
            required: false,
            separate: true,
            order: [['date', 'ASC']],
          },
          {
            model: DistributorCredit,
            where: whereCondition,
            required: false,
            separate: true,
            order: [['date', 'ASC']],
          },
        ],
      }),
      this.calculateDistributorOpeningBalances(startDate, entityId)
    ]);

    const data = this.formatDistributorData(distributors, openingBalances, startDate, gst, advTax);
    return { data, openingBalances, title };
  }

  private async calculateDistributorOpeningBalances(startDate: Date, entityId?: number) {
    const where: any = { date: { [Op.lt]: startDate } };
    if (entityId) where.distributorId = entityId;

    const [debits, credits] = await Promise.all([
      DistributorDebit.findAll({
        attributes: [
          ['distributorId', 'distributorId'],
          [sequelize.fn('sum', sequelize.col('amount')), 'total']
        ],
        where,
        group: ['distributorId'],
        raw: true
      }) as unknown as Promise<AggregationResult[]>,

      DistributorCredit.findAll({
        attributes: [
          ['distributorId', 'distributorId'],
          [sequelize.fn('sum', sequelize.col('amount')), 'total']
        ],
        where,
        group: ['distributorId'],
        raw: true
      }) as unknown as Promise<AggregationResult[]>
    ]);

    const distributors = await Distributor.findAll({
      where: entityId ? { id: entityId } : {},
      attributes: ['id', 'name', 'companyName']
    });

    const openingBalances: Record<number, OpeningBalance> = {};
    let title: string;

    distributors.forEach(dist => {
      const debitTotal = debits.find(d => d.distributorId === dist.id)?.total || 0;
      const creditTotal = credits.find(c => c.distributorId === dist.id)?.total || 0;

      openingBalances[dist.id] = {
        name: dist.name,
        companyName: dist.companyName,
        openingBalance: debitTotal - creditTotal
      };

      title = dist.companyName || dist.name || '';
    });

    return { openingBalances, title };
  }

  private formatDistributorData(distributorsData: any[], openingBalances: Record<number, OpeningBalance>, startDate: Date, gst?: boolean, advTax?: boolean): LedgerEntry[] {
    return distributorsData.flatMap(dist => {
      const entries: LedgerEntry[] = [];
      let gstTotal = 0;
      let advTaxTotal = 0;
      const openingBalance = openingBalances[dist.id]?.openingBalance || 0;

      if (gst || advTax) {
        (dist.DistributorCredits || []).forEach((credit: any) => {
          // if ((gst && credit.gstAmount > 0) || (advTax && credit.advTaxAmount > 0)) {
          if (gst) gstTotal += credit.gstAmount;
          if (advTax) advTaxTotal += credit.advTaxAmount;
          entries.push({
            id: credit.id,
            date: credit.date,
            type: 'Credit',
            entityId: dist.id,
            entityName: dist.name,
            company: dist.companyName,
            description: credit.description,
            gstAmount: gst ? credit.gstAmount : undefined,
            advTaxAmount: advTax ? credit.advTaxAmount : undefined,
            paymentSourceId: credit.paymentSourceId
          });
          // }
        });

        entries.push({
          id: `total-${dist.id}`,
          date: null,
          type: 'Total',
          description: `Total ${gst ? 'GST' : 'Advance Tax'} for ${dist.name}`,
          gstAmount: gstTotal,
          advTaxAmount: advTaxTotal,
          runningBalance: null
        });

        return entries;
      }
      // Add opening balance
      entries.push({
        id: `opening-${dist.id}`,
        date: null,
        type: 'Opening Balance',
        description: `Opening balance as of ${startDate.toLocaleDateString()}`,
        runningBalance: openingBalance
      });

      // Combine and sort all transactions chronologically
      const allTransactions = [
        ...(dist.DistributorDebits?.map((debit: any) => ({
          ...debit.toJSON(),
          _type: 'debit',
          _sortDate: new Date(debit.date)
        })) || []),
        ...(dist.DistributorCredits?.map((credit: any) => ({
          ...credit.toJSON(),
          _type: 'credit',
          _sortDate: new Date(credit.date)
        })) || [])
      ].sort((a, b) => a._sortDate - b._sortDate);

      // Process transactions in chronological order
      let runningBalance = openingBalance;
      allTransactions.forEach(txn => {
        if (txn._type === 'debit') {
          runningBalance += txn.amount;
          entries.push({
            id: txn.id,
            date: txn.date,
            type: 'Debit',
            entityId: dist.id,
            entityName: dist.name,
            company: dist.companyName,
            debitAmount: txn.amount,
            description: txn.description,
            runningBalance,
            billNo: txn.billNo
          });
        } else {
          runningBalance -= txn.amount;
          entries.push({
            id: txn.id,
            date: txn.date,
            type: 'Credit',
            entityId: dist.id,
            entityName: dist.name,
            company: dist.companyName,
            creditAmount: txn.amount,
            description: txn.description,
            runningBalance,
            paymentSourceId: txn.paymentSourceId
          });
        }
      });

      return entries;
    });
  }

  private async calculateGSTorAdvTaxTotal(
    whereCondition: any,
    gst: boolean,
    advTax: boolean,
    entityId?: number
  ): Promise<number> {
    if (!gst && !advTax) return 0;

    const attributeToSum = gst ? 'gstAmount' : 'advTaxAmount';

    const totalResult = await DistributorCredit.findAll({
      where: {
        ...whereCondition,
        ...(entityId ? { distributorId: entityId } : {})
      },
      attributes: [
        [sequelize.fn('sum', sequelize.col(attributeToSum)), 'total']
      ],
      raw: true
    });
    console.log('totallll', totalResult)
    // const total = parseFloat((totalResult[0]?.total || 0).toString());
    // return total;
  }


  private async processExpenses(whereCondition: any, entityId?: number): Promise<{ data: LedgerEntry[], openingBalances: Record<number, OpeningBalance>, title: string }> {
    const expensesData = await Expense.findAll({
      where: {
        ...whereCondition,
        ...(entityId ? { categoryId: entityId } : {}),
      },
      include: [
        {
          model: ExpenseCategory,
          required: false,
        },
      ],
      order: [['date', 'ASC']],
    });
    let categoryName: string;
    const ledgerEntries: LedgerEntry[] = expensesData.map((exp: any) => {
      categoryName = exp.ExpenseCategory?.name || "Uncategorized";

      return {
        id: exp.id,
        date: exp.date,
        type: "Expense",
        amount: exp.amount,
        description: exp.description,
        category: categoryName,
        paymentMethod: exp.paymentMethod,
      };
    });
    return { data: ledgerEntries, openingBalances: {}, title: categoryName };
  }

  private async generatePdfResponse(
    res: Response,
    moduleType: string,
    data: LedgerEntry[],
    openingBalances: Record<number, OpeningBalance>,
    entityId: number,
    title: string,
    startDate: Date,
    endDate: Date,
    gst: boolean,
    advTax: boolean
  ) {
    try {
      // Determine columns based on module type
      let columns: any[];
      let module: string;

      switch (moduleType) {
        case ModuleTypeEnum.loanTakers:
          module = 'Loan Takers Ledger';
          columns = [
            { title: 'Name', dataKey: 'entityName' },
            { title: 'Date', dataKey: 'date' },
            { title: 'Type', dataKey: 'type' },
            { title: 'Debit', dataKey: 'debitAmount' },
            { title: 'Credit', dataKey: 'creditAmount' },
            { title: 'Balance', dataKey: 'runningBalance' }
          ];
          break;
        case ModuleTypeEnum.distributors:
          module = 'Distributors Ledger';
          if (gst || advTax) {
            columns = [
              { title: 'Date', dataKey: 'date' },
              { title: 'Company', dataKey: 'company' },
              { title: 'Type', dataKey: 'type' },
              { title: 'Gst', dataKey: 'gst' },
              { title: 'Adv Tax', dataKey: 'advTaxAmount' },
            ];
          } else {
            columns = [
              { title: 'Date', dataKey: 'date' },
              { title: 'Company', dataKey: 'company' },
              { title: 'Type', dataKey: 'type' },
              { title: 'Debit', dataKey: 'debitAmount' },
              { title: 'Credit', dataKey: 'creditAmount' },
              { title: 'Balance', dataKey: 'runningBalance' }
            ];
          }
          break;
        case ModuleTypeEnum.expenses:
          module = 'Expenses Ledger';
          columns = [
            { title: 'Date', dataKey: 'date' },
            { title: 'Amount', dataKey: 'amount' },
            { title: 'Description', dataKey: 'description' }
          ];
          break;
        default:
          throw new Error('Invalid module type');
      }

      // Format dates in the data
      const formattedData = data.map(item => ({
        ...item,
        date: item.date ? new Date(item.date).toLocaleDateString() : '',
        debitAmount: item.debitAmount || '',
        creditAmount: item.creditAmount || '',
        runningBalance: item.runningBalance || ''
      }));

      const pdfBuffer = await this.generatePdf(
        module,
        moduleType,
        columns,
        formattedData,
        openingBalances,
        entityId,
        title,
        startDate,
        endDate
      );

      // Set response headers for PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${module.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);

      // Send the PDF
      res.send(pdfBuffer);

    } catch (err) {
      logger.error("Error generating PDF:", err);
      return ResponseHandler.error(res, "Failed to generate PDF", 500, err);
    }
  }

  private async generatePdf(
    module: string,
    moduleType: string,
    columns: any[],
    data: any[],
    openingBalances: Record<number, OpeningBalance>,
    entityId: number,
    title: Record<number, string>,
    startDate: Date,
    endDate: Date
  ): Promise<Buffer> {
    const PDFDocument = require('pdfkit');

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 40 });
        const buffers: any[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Prepare entity display name and opening balance (get first entry)
        console.log(title)
        console.log(openingBalances)
        // if (Object.keys(openingBalances).length > 0) {
        //   const [firstId, data] = Object.entries(openingBalances)[0];
        //   entityName = moduleType == ModuleTypeEnum.loanTakers ? data?.name : data?.companyName || '';
        //   openingBalance = data?.openingBalance || '';
        // }

        // Title
        doc.fontSize(18).fillColor('#006400').text(module, { align: 'center' }).moveDown();
        doc.fillColor('black');

        // Ledger Report Heading
        if (title) {
          doc.fontSize(12).fillColor('#000080').text(`${title} Ledger Report`, {
            align: 'center',
            underline: true,
          });
          doc.moveDown();
        }

        // Date Range
        doc.fontSize(12).text(`From: ${startDate.toLocaleDateString()}  To: ${endDate.toLocaleDateString()}`, {
          align: 'center',
        }).moveDown(2);

        // Opening Balances
        if (Object.entries(openingBalances).length > 0 && entityId) {
          doc.fontSize(10).fillColor('#006400').text('Opening Balance: ', { continued: true, });
          doc.fillColor('black').text(`${openingBalances[entityId].openingBalance}`);
          doc.moveDown(2);
        }

        // Table Headers
        const tableTop = doc.y;
        const columnWidth = (doc.page.width - 80) / columns.length; // 40 margin left and right
        let rowHeight = 20;

        // Header row background
        doc.rect(40, tableTop, doc.page.width - 80, rowHeight).fill('#d0f0c0');

        // Column Titles
        columns.forEach((col, i) => {
          doc
            .fillColor('black')
            .fontSize(12)
            .text(col.title, 40 + i * columnWidth + 2, tableTop + 5, {
              width: columnWidth - 4,
              align: 'left'
            });
        });

        // Data Rows
        let y = tableTop + rowHeight;

        data.forEach((row, rowIndex) => {
          if (y + rowHeight > doc.page.height - 40) {
            doc.addPage();
            y = 40;

            // Redraw header on new page
            doc.rect(40, y, doc.page.width - 80, rowHeight).fill('#d0f0c0');
            columns.forEach((col, i) => {
              doc
                .fillColor('black')
                .fontSize(12)
                .text(col.title, 40 + i * columnWidth + 2, y + 5, {
                  width: columnWidth - 4,
                  align: 'left'
                });
            });

            y += rowHeight;
          }

          // Alternate row color
          if (rowIndex % 2 === 0) {
            doc.rect(40, y, doc.page.width - 80, rowHeight).fill('#f0fff0');
          } else {
            doc.rect(40, y, doc.page.width - 80, rowHeight).fill('#ffffff');
          }

          // Row values
          columns.forEach((col, i) => {
            const value = row[col.dataKey] !== undefined ? String(row[col.dataKey]) : '';
            doc
              .fillColor('black')
              .fontSize(10)
              .text(value, 40 + i * columnWidth + 2, y + 5, {
                width: columnWidth - 4,
                align: 'left'
              });
          });

          y += rowHeight;
        });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  async getLedgerSummary(req: Request, res: Response) {
    try {
      const { moduleType, startDate, endDate } = req.query;

      if (!moduleType) {
        return res.status(400).json({ error: "Module type is required" });
      }

      const dateFilter = {
        date: {
          [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
        }
      };

      let summary: any = {};

      switch (moduleType) {
        case ModuleTypeEnum.loanTakers:
          const totalLoans = await Loan.sum('amount', { where: dateFilter });
          const totalRepayments = await LoanTransaction.sum('amount', { where: dateFilter });

          summary = {
            totalLoans,
            totalRepayments,
            netBalance: totalLoans - totalRepayments
          };
          break;

        case ModuleTypeEnum.distributors:
          const totalDebits = await DistributorDebit.sum('amount', { where: dateFilter });
          const totalCredits = await DistributorCredit.sum('amount', { where: dateFilter });

          summary = {
            totalDebits,
            totalCredits,
            netBalance: totalDebits - totalCredits
          };
          break;

        case ModuleTypeEnum.expenses:
          const totalExpenses = await Expense.sum('amount', { where: dateFilter });

          summary = {
            totalExpenses
          };
          break;

        default:
          return res.status(400).json({ error: "Invalid module type" });
      }

      res.json({
        success: true,
        data: summary,
        module: moduleType,
        startDate,
        endDate
      });

    } catch (error) {
      console.error("Error fetching ledger summary:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}