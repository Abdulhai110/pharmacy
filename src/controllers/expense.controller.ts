import express from "express";
import { Expense } from "../models/Expense";
import { ExpenseCategory } from "../models/ExpenseCategory";
import Joi from "joi";
import { ResponseHandler } from "../utils/respHandler";
import logger from "../utils/logger";
import { paging } from "../helpers/helper";
import { sequelize } from "../config/connection";
import { Account } from "../models/BankAccounts";
import { Transaction } from "../models/BankTransactions";
import { PaymentMethodEnum, RecurringIntervalEnum, StatusEnum, TransactionStatusEnum, TransactionTypeEnum } from "../constants/enum";
import { where } from "sequelize";

const { Op } = require("sequelize");

export class ExpenseController {
    private static instance: ExpenseController | null = null;

    private constructor() { }

    static init(): ExpenseController {
        if (this.instance == null) {
            this.instance = new ExpenseController();
        }
        return this.instance;
    }

    // Create new expense
    async create(req: express.Request, res: express.Response) {
        const transaction = await sequelize.transaction();
        try {
            const schema = Joi.object({
                amount: Joi.number().min(1).required(),
                description: Joi.allow(null, '').optional(),
                date: Joi.date(),
                paymentMethod: Joi.string().valid(...Object.values(PaymentMethodEnum)).required(),
                accountId: Joi.when('paymentMethod', {
                    is: PaymentMethodEnum.BankTransfer,
                    then: Joi.number().required(),
                    otherwise: Joi.any().strip()
                }), userId: Joi.number().required(),
                categoryId: Joi.number().required(),
            });

            const { error, value } = schema.validate(req.body);
            if (error) {
                await transaction.rollback();
                return ResponseHandler.error(res, error.details[0].message, 400);
            }

            // Check if category exists
            const category = await ExpenseCategory.findByPk(value.categoryId, { transaction: transaction });
            if (!category) {
                await transaction.rollback();
                return ResponseHandler.error(res, "Category not found", 404);
            }

            // If accountNumber is provided, verify the account
            if (value.accountId) {
                const account = await Account.findByPk(value.accountId, { transaction });
                if (!account) {
                    await transaction.rollback();
                    return ResponseHandler.error(res, "Account not found", 404);
                }

                if (Number(account.balance) < Number(value.amount)) {
                    await transaction.rollback();
                    return ResponseHandler.error(res, "Insufficient account balance", 400);
                }
            }

            const expense = await Expense.create(value, { transaction: transaction });

            // If paid from an account, create a transaction
            if (value.accountId) {
                await this.createExpenseTransaction(expense, transaction);
            }

            await transaction.commit();
            return ResponseHandler.success(res, "Expense created successfully", expense);
        } catch (error) {
            await transaction.rollback();
            logger.error("Expense creation error", error);
            return ResponseHandler.error(res, "Error creating expense", 500, error);
        }
    }

    private async createExpenseTransaction(expense: Expense, transaction: any,) {
        const account = await Account.findByPk(expense.accountId, { transaction });
        if (!account) return;

        // Update account balance
        const newBalance = Number(account.balance) - Number(expense.amount);
        await account.update({ balance: newBalance }, { transaction: transaction });

        // Create transaction record
        await Transaction.create({
            transactionType: TransactionTypeEnum.Expense,
            amount: expense.amount,
            description: expense.description,
            paymentMethod: expense.paymentMethod,
            accountId: expense.accountId,
            refrenceNumber: `EXP-${expense.id}`
        }, { transaction: transaction });
    }

    // List expenses
    async list(req: express.Request, res: express.Response) {
        try {
            const { keyword, categoryId, status, start_date, end_date, limit, offset } = req.query;
            const parsedOffset = Number(offset);
            const parsedLimit = Number(limit);
            const where: any = {};
            if (keyword) {
                where[Op.or] = [
                    { description: { [Op.like]: `%${keyword}%` } }
                ];
            }
            if (categoryId) where.categoryId = categoryId;
            if (status) where.status = status;

            // Date range filter
            if (start_date && end_date) {
                const start = new Date(start_date as string);
                start.setHours(0, 0, 0, 0);

                const end = new Date(end_date as string);
                end.setHours(23, 59, 59, 999);

                where.date = {
                    [Op.between]: [start, end]
                };
            } else if (start_date) {
                const start = new Date(start_date as string);
                start.setHours(0, 0, 0, 0);

                where.date = { [Op.gte]: start };
            } else if (end_date) {
                const end = new Date(end_date as string);
                end.setHours(23, 59, 59, 999);

                where.date = { [Op.lte]: end };
            }

            const data = await Expense.findAndCountAll({
                where,
                include: [
                    { model: ExpenseCategory, attributes: ['name'] },
                    { model: Account, attributes: ['accountTitle', 'accountNumber'] }
                ],
                order: [['date', 'ASC']],
                limit: parsedLimit,
                offset: parsedOffset,
            });

            return ResponseHandler.success(
                res,
                "Expenses fetched successfully",
                paging(data, parsedOffset, parsedLimit)
            );
        } catch (error) {
            logger.error("Expense list error", error);
            return ResponseHandler.error(res, "Error fetching expenses", 500, error);
        }
    }

    // Update expense
    async update(req: express.Request, res: express.Response) {
        const t = await sequelize.transaction();
        try {
            const schema = Joi.object({
                id: Joi.number().required(),
                amount: Joi.number().min(1).required(),
                description: Joi.allow(null, '').optional(),
                date: Joi.date(),
                paymentMethod: Joi.string().valid(...Object.values(PaymentMethodEnum)).required(),
                accountId: Joi.number().required(),
                userId: Joi.number().required(),
                categoryId: Joi.number().required(),
            });

            const { error, value } = schema.validate(req.body);
            if (error) {
                await t.rollback();
                return ResponseHandler.error(res, error.details[0].message, 400);
            }

            const expense = await Expense.findByPk(value.id, { transaction: t });
            if (!expense) {
                await t.rollback();
                return ResponseHandler.error(res, "Expense not found", 404);
            }

            // If changing account, we need to reverse the old transaction and create a new one
            if (value.accountId !== undefined && value.accountId !== expense.accountId) {
                await this.handleAccountChange(expense, value, t);
            }

            // If amount changed and expense is tied to an account, update the transaction
            if (value.amount !== undefined && value.amount !== expense.amount && expense.accountId) {
                await this.updateExpenseTransaction(expense, value, t);
            }

            await expense.update(value, { transaction: t });
            await t.commit();
            return ResponseHandler.success(res, "Expense updated successfully", expense);
        } catch (error) {
            await t.rollback();
            logger.error("Expense update error", error);
            return ResponseHandler.error(res, "Error updating expense", 500, error);
        }
    }

    private async handleAccountChange(oldExpense: Expense, newValues: any, t: any) {
        // If old expense had an account, reverse the transaction
        if (oldExpense.accountId) {
            await this.reverseExpenseTransaction(oldExpense, t);
        }

        // If new account is provided, create a new transaction
        if (newValues.accountId) {
            const updatedExpense = { ...oldExpense.toJSON(), ...newValues };
            await this.createExpenseTransaction(updatedExpense, t);
        }
    }

    private async reverseExpenseTransaction(expense: Expense, t: any) {
        const account = await Account.findByPk(expense.accountId, { transaction: t });
        if (!account) return;

        // Reverse the balance change
        const newBalance = Number(account.balance) + Number(expense.amount);
        await account.update({ balance: newBalance }, { transaction: t });

        // Mark the original transaction as reversed
        await Transaction.update(
            { status: TransactionStatusEnum.Reversed },
            {
                where: { refrenceNumber: `EXP-${expense.id}` },
                transaction: t
            }
        );
    }

    private async updateExpenseTransaction(expense: Expense, newValues: any, t: any) {
        const account = await Account.findByPk(expense.accountId, { transaction: t });
        if (!account) return;

        // Calculate the difference
        const difference = Number(expense.amount) - Number(newValues.amount);
        const newBalance = Number(account.balance) + difference;
        await account.update({ balance: newBalance }, { transaction: t });

        // Update the transaction record
        await Transaction.update(
            { amount: newValues.amount },
            {
                where: { refrenceNumber: `EXP-${expense.id}` },
                transaction: t
            }
        );
    }

    // Get expense by ID
    async get(req: express.Request, res: express.Response) {
        try {
            const { id } = req.params;
            const expense = await Expense.findByPk(id, {
                include: [
                    { model: ExpenseCategory, attributes: ['id', 'name'] },
                    { model: Account, attributes: ['id', 'accountTitle'] }
                ]
            });

            if (!expense) {
                return ResponseHandler.error(res, "Expense not found", 404);
            }

            return ResponseHandler.success(res, "Expense fetched successfully", expense);
        } catch (error) {
            logger.error("Expense get error", error);
            return ResponseHandler.error(res, "Error fetching expense", 500, error);
        }
    }

    // Delete expense
    async delete(req: express.Request, res: express.Response) {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            const expense = await Expense.findByPk(id, { transaction: t });

            if (!expense) {
                await t.rollback();
                return ResponseHandler.error(res, "Expense not found", 404);
            }

            // If expense is tied to an account, reverse the transaction
            if (expense.accountId) {
                await this.reverseExpenseTransaction(expense, t);
            }

            await expense.destroy({ transaction: t });
            await t.commit();
            return ResponseHandler.success(res, "Expense deleted successfully");
        } catch (error) {
            await t.rollback();
            logger.error("Expense delete error", error);
            return ResponseHandler.error(res, "Error deleting expense", 500, error);
        }
    }

    // Process recurring expenses
    /* async processRecurring(req: express.Request, res: express.Response) {
        const t = await sequelize.transaction();
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const recurringExpenses = await Expense.findAll({
                where: {
                    isRecurring: true,
                    nextRecurringDate: {
                        [Op.lte]: today
                    }
                },
                transaction: t
            });

            for (const expense of recurringExpenses) {
                // Create a new expense based on the recurring one
                const newExpense = await Expense.create({
                    amount: expense.amount,
                    description: expense.description,
                    date: today,
                    paymentMethod: expense.paymentMethod,
                    isRecurring: true,
                    recurringInterval: expense.recurringInterval,
                    accountId: expense.accountId,
                    userId: expense.userId,
                    categoryId: expense.categoryId
                }, { transaction: t });

                // If paid from an account, create a transaction
                if (expense.accountId) {
                    await this.createExpenseTransaction(newExpense, t);
                }

                // Update next recurring date
                const nextDate = new Date(today);
                switch (expense.recurringInterval) {
                    case 'daily':
                        nextDate.setDate(nextDate.getDate() + 1);
                        break;
                    case 'weekly':
                        nextDate.setDate(nextDate.getDate() + 7);
                        break;
                    case 'monthly':
                        nextDate.setMonth(nextDate.getMonth() + 1);
                        break;
                    case 'yearly':
                        nextDate.setFullYear(nextDate.getFullYear() + 1);
                        break;
                }

                await expense.update({ nextRecurringDate: nextDate }, { transaction: t });
            }

            await t.commit();
            return ResponseHandler.success(
                res,
                `Processed ${recurringExpenses.length} recurring expenses`,
                { processed: recurringExpenses.length }
            );
        } catch (error) {
            await t.rollback();
            logger.error("Recurring expenses processing error", error);
            return ResponseHandler.error(res, "Error processing recurring expenses", 500, error);
        }
    } */

    // Get expense statistics
    async stats(req: express.Request, res: express.Response) {
        try {
            const { start_date, end_date, group_by = 'category' } = req.query;

            const where: any = { status: 'Active' };

            // Date range filter
            if (start_date && end_date) {
                where.date = {
                    [Op.between]: [new Date(start_date as string), new Date(end_date as string)]
                };
            }

            let stats;
            if (group_by === 'category') {
                stats = await Expense.findAll({
                    where,
                    attributes: [
                        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
                        'categoryId'
                    ],
                    include: [{
                        model: ExpenseCategory,
                        attributes: ['name']
                    }],
                    group: ['categoryId'],
                    raw: true
                });
            } else if (group_by === 'month') {
                stats = await Expense.findAll({
                    where,
                    attributes: [
                        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
                        [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m'), 'month']
                    ],
                    group: ['month'],
                    order: [['month', 'ASC']],
                    raw: true
                });
            }

            return ResponseHandler.success(res, "Expense statistics fetched", stats);
        } catch (error) {
            logger.error("Expense stats error", error);
            return ResponseHandler.error(res, "Error fetching expense statistics", 500, error);
        }
    }
}