import express from "express";
import { Account } from "../models/BankAccounts";
import Joi from "joi";
import { Transaction } from "../models/BankTransactions";
import { ResponseHandler } from "../utils/respHandler";
import logger from "../utils/logger";
import { paging } from "../helpers/helper";
import { sequelize } from "../config/connection";
import { AccountTypeEnum, PaymentMethodEnum, StatusEnum, TransactionTypeEnum } from "../constants/enum";
import { Bank } from "../models/Banks";

const { Op } = require("sequelize");

export class AccountController {
    private static instance: AccountController | null = null;

    private constructor() { }

    static init(): AccountController {
        if (this.instance == null) {
            this.instance = new AccountController();
        }
        return this.instance;
    }

    // Create new account
    async create(req: express.Request, res: express.Response) {
        const t = await sequelize.transaction();
        try {
            const schema = Joi.object({
                bankId: Joi.number().required(),
                accountNumber: Joi.string().alphanum().required(),
                accountTitle: Joi.string().required(),
                accountType: Joi.string().valid(...Object.values(AccountTypeEnum)).required(),
                openingBalance: Joi.number().min(0).required(),
                userId: Joi.number().required(),
            });

            const { error, value } = schema.validate(req.body);
            if (error) {
                await t.rollback();
                return ResponseHandler.error(res, error.details[0].message, 400);
            }

            // Check if bank exists
            const bank = await Bank.findByPk(value.bankId, { transaction: t });
            if (!bank) {
                await t.rollback();
                return ResponseHandler.error(res, "Bank not found", 404);
            }

            const existingAccount = await Account.findOne({
                where: {
                    accountNumber: value.accountNumber,
                    bankId: value.bankId
                },
                transaction: t
            });

            if (existingAccount) {
                await t.rollback();
                return ResponseHandler.error(res, "Account number already exists", 400);
            }

            const account = await Account.create({
                ...value,
                balance: value.openingBalance,
                status: 'Active'
            }, { transaction: t });

            if (value.openingBalance > 0) {
                await Transaction.create({
                    transactionType: TransactionTypeEnum.Deposit,
                    amount: value.openingBalance,
                    description: 'Initial deposit',
                    paymentMethod: PaymentMethodEnum.Cash,
                    accountId: account.id,
                    refrenceNumber: `INIT-${Date.now()}`
                }, { transaction: t });
            }

            await t.commit();
            return ResponseHandler.success(res, "Account created successfully", account);
        } catch (error) {
            await t.rollback();
            logger.error("Account creation error", error);
            return ResponseHandler.error(res, "Error creating account", 500, error);
        }
    }

    // List accounts
    async list(req: express.Request, res: express.Response) {
        try {
            const { limit, offset, keyword, accountType, status } = req.query;;

            const where: any = {};
            if (keyword) {
                where[Op.or] = [
                    { accountNumber: { [Op.like]: `%${keyword}%` } },
                    { accountTitle: { [Op.like]: `%${keyword}%` } }
                ];
            }
            if (accountType) where.accountType = accountType;
            if (status) where.status = status;

            const data = await Account.findAndCountAll({
                where,
                order: [['createdAt', 'DESC']],
                limit: Number(limit),
                offset: Number(offset),
            });

            return ResponseHandler.success(
                res,
                "Accounts fetched successfully",
                paging(data, Number(offset), Number(limit))
            );
        } catch (error) {
            logger.error("Account list error", error);
            return ResponseHandler.error(res, "Error fetching accounts", 500, error);
        }
    }

    // List accounts
    async accounts(req: express.Request, res: express.Response) {
        try {
            const { limit, offset, keyword, accountType, status } = req.query;;

            const where: any = {};
            if (keyword) {
                where[Op.or] = [
                    { accountNumber: { [Op.like]: `%${keyword}%` } },
                    { accountTitle: { [Op.like]: `%${keyword}%` } }
                ];
            }

            const data = await Account.findAndCountAll({
                where
            });

            return ResponseHandler.success(
                res,
                "Accounts fetched successfully",
                paging(data, Number(offset), Number(limit))
            );
        } catch (error) {
            logger.error("Account list error", error);
            return ResponseHandler.error(res, "Error fetching accounts", 500, error);
        }
    }

    // Update account details
    async update(req: express.Request, res: express.Response) {
        const t = await sequelize.transaction();
        try {
            const schema = Joi.object({
                id: Joi.number().required(),
                accountTitle: Joi.string().optional(),
                accountType: Joi.string().valid(...Object.values(AccountTypeEnum)).optional(),
                userId: Joi.number().optional()
            });

            const { error, value } = schema.validate(req.body);
            if (error) {
                await t.rollback();
                return ResponseHandler.error(res, error.details[0].message, 400);
            }

            const { id } = value;

            const accountId = id;
            const account = await Account.findByPk(accountId, { transaction: t });

            if (!account) {
                await t.rollback();
                return ResponseHandler.error(res, "Account not found", 404);
            }

            // Prevent updating certain fields if account is not active
            if (account.status !== StatusEnum.Active) {
                await t.rollback();
                return ResponseHandler.error(res, "Cannot update a non-active account", 400);
            }

            await account.update(value, { transaction: t });
            await t.commit();

            return ResponseHandler.success(res, "Account updated successfully", account);
        } catch (error) {
            await t.rollback();
            logger.error("Account update error", error);
            return ResponseHandler.error(res, "Error updating account", 500, error);
        }
    }

    // Delete account (soft delete)
    async delete(req: express.Request, res: express.Response) {
        const t = await sequelize.transaction();
        try {
            const accountId = req.params.id;
            const account = await Account.findByPk(accountId, { transaction: t });

            if (!account) {
                await t.rollback();
                return ResponseHandler.error(res, "Account not found", 404);
            }

            // Check if account has balance
            if (account.balance > 0) {
                await t.rollback();
                return ResponseHandler.error(res, "Cannot delete account with remaining balance", 400);
            }

            await account.destroy({ transaction: t });
            await t.commit();

            return ResponseHandler.success(res, "Account deleted successfully");
        } catch (error) {
            await t.rollback();
            logger.error("Account deletion error", error);
            return ResponseHandler.error(res, "Error deleting account", 500, error);
        }
    }

    // Update account status
    async updateStatus(req: express.Request, res: express.Response) {
        const t = await sequelize.transaction();
        try {
            const schema = Joi.object({
                status: Joi.string().valid(...Object.values(StatusEnum)).required()
            });

            const { error, value } = schema.validate(req.body);
            if (error) {
                await t.rollback();
                return ResponseHandler.error(res, error.details[0].message, 400);
            }

            const accountId = req.params.id;
            const account = await Account.findByPk(accountId, { transaction: t });

            if (!account) {
                await t.rollback();
                return ResponseHandler.error(res, "Account not found", 404);
            }

            // Prevent certain status transitions
            if (account.status === StatusEnum.Inactive && value.status !== StatusEnum.Active) {
                await t.rollback();
                return ResponseHandler.error(res, "Cannot reactivate a closed account", 400);
            }

            await account.update({ status: value.status }, { transaction: t });
            await t.commit();

            return ResponseHandler.success(res, "Account status updated successfully", account);
        } catch (error) {
            await t.rollback();
            logger.error("Account status update error", error);
            return ResponseHandler.error(res, "Error updating account status", 500, error);
        }
    }

    // Process account transitions (deposit/withdraw)
    async processTransaction(req: express.Request, res: express.Response) {
        const t = await sequelize.transaction();
        try {
            const schema = Joi.object({
                accountId: Joi.number().required(),
                transactionType: Joi.string().valid(...Object.values(TransactionTypeEnum)).required(),
                amount: Joi.number().min(0.01).required(),
                description: Joi.allow(null, '').optional(),
                paymentMethod: Joi.string().valid(...Object.values(PaymentMethodEnum)).required(),
                refrenceNumber: Joi.string().optional()
            });

            const { error, value } = schema.validate(req.body);
            if (error) {
                await t.rollback();
                return ResponseHandler.error(res, error.details[0].message, 400);
            }

            const accountId = req.body.accountId;
            const account = await Account.findByPk(accountId, { transaction: t });

            if (!account) {
                await t.rollback();
                return ResponseHandler.error(res, "Account not found", 404);
            }

            // Check if account is active
            if (account.status !== StatusEnum.Active) {
                await t.rollback();
                return ResponseHandler.error(res, "Cannot process transaction for a non-active account", 400);
            }

            const currentBalance = Number(account.balance);
            const transactionAmount = Number(value.amount);

            if (value.transactionType === TransactionTypeEnum.Withdrawal) {
                if (currentBalance < transactionAmount) {
                    await t.rollback();
                    return ResponseHandler.error(res, "Insufficient balance", 400);
                }
                account.balance = currentBalance - transactionAmount;
            }
            else if (value.transactionType === TransactionTypeEnum.Deposit) {
                account.balance = currentBalance + transactionAmount;
            }

            // Update account balance
            await account.save({ transaction: t });

            // Create transaction record
            const transaction = await Transaction.create({
                transactionType: value.transactionType,
                amount: transactionAmount,
                description: value.description,
                paymentMethod: value.paymentMethod,
                refrenceNumber: value.refrenceNumber || `TX-${Date.now()}`,
                accountId: account.id // Use the account's id property
            }, { transaction: t });

            await t.commit();
            return ResponseHandler.success(res, "Transaction processed successfully", {
                account,
                transaction
            });
        } catch (error) {
            await t.rollback();
            logger.error("Transaction processing error", error);
            return ResponseHandler.error(res, "Error processing transaction", 500, error);
        }
    }

    // Transfer between accounts
    async transfer(req: express.Request, res: express.Response) {
        const t = await sequelize.transaction();
        try {
            const schema = Joi.object({
                fromAccountNumber: Joi.string().alphanum().required(),
                toAccountNumber: Joi.string().alphanum().required(),
                amount: Joi.number().min(1).required(),
                description: Joi.allow(null, '').optional(),
                refrenceNumber: Joi.string().optional()
            });

            const { error, value } = schema.validate(req.body);
            if (error) {
                await t.rollback();
                return ResponseHandler.error(res, error.details[0].message, 400);
            }

            // Check if accounts are different
            if (value.fromAccountNumber === value.toAccountNumber) {
                await t.rollback();
                return ResponseHandler.error(res, "Cannot transfer to the same account", 400);
            }

            // Get both accounts by accountNumber 
            const fromAccount = await Account.findOne({
                where: { accountNumber: value.fromAccountNumber },
                transaction: t
            });

            const toAccount = await Account.findOne({
                where: { accountNumber: value.toAccountNumber },
                transaction: t
            });
            if (!fromAccount || !toAccount) {
                await t.rollback();
                return ResponseHandler.error(res, "One or both accounts not found", 404);
            }

            // Check if accounts are active
            if (fromAccount.status !== StatusEnum.Active || toAccount.status !== StatusEnum.Active) {
                await t.rollback();
                return ResponseHandler.error(res, "One or both accounts are not active", 400);
            }
            // Convert balances to numbers
            const fromBalance: number = Number(fromAccount.balance);
            const toBalance: number = Number(toAccount.balance);
            const transferAmount: number = Number(value.amount);

            // Check sufficient balance
            if (fromBalance < transferAmount) {
                await t.rollback();
                return ResponseHandler.error(res, "Insufficient balance in source account", 400);
            }

            // Process transfer with proper numeric operations
            fromAccount.balance = parseFloat((Number(fromAccount.balance) - transferAmount).toFixed(2));
            toAccount.balance = parseFloat((Number(toAccount.balance) + transferAmount).toFixed(2));

            await fromAccount.save({ transaction: t });
            await toAccount.save({ transaction: t });


            // Create transaction records
            const referenceNumber = value.refrenceNumber || `TRF-${Date.now()}`;

            await Transaction.create({
                transactionType: TransactionTypeEnum.Transfer, // More specific type
                amount: transferAmount,
                description: value.description || `Transfer to account ${toAccount.accountNumber}`,
                paymentMethod: PaymentMethodEnum.BankTransfer,
                accountId: fromAccount.id, // Explicit accountId
                refrenceNumber: referenceNumber
            }, { transaction: t });

            await Transaction.create({
                transactionType: TransactionTypeEnum.Transfer, // More specific type
                amount: transferAmount,
                description: value.description || `Transfer from account ${fromAccount.accountNumber}`,
                paymentMethod: PaymentMethodEnum.BankTransfer,
                accountId: toAccount.id, // Explicit accountId
                refrenceNumber: referenceNumber
            }, { transaction: t });

            await t.commit();
            return ResponseHandler.success(res, "Transfer completed successfully", {
                fromAccount,
                toAccount
            });
        } catch (error) {
            await t.rollback();
            logger.error("Transfer error", error);
            return ResponseHandler.error(res, "Error processing transfer", 500, error);
        }
    }

    // Get account details
    async get(req: express.Request, res: express.Response) {
        try {
            const accountId = req.params.id;
            const account = await Account.findByPk(accountId, {
                include: [
                    {
                        model: Bank,
                        attributes: ['id', 'name']
                    },
                    {
                        model: Transaction,
                        attributes: ['id', 'transactionType', 'amount', 'description', 'createdAt'],
                        order: [['createdAt', 'DESC']],
                        limit: 10
                    }
                ]
            });

            if (!account) {
                return ResponseHandler.error(res, "Account not found", 404);
            }

            return ResponseHandler.success(res, "Account details fetched successfully", account);
        } catch (error) {
            logger.error("Account details error", error);
            return ResponseHandler.error(res, "Error fetching account details", 500, error);
        }
    }

    // Get transactions
    async getTransactions(req: express.Request, res: express.Response) {
        try {
            const schema = Joi.object({
                accountId: Joi.number().required(),
                offset: Joi.number().default(10),
                limit: Joi.number().default(1),
                startDate: Joi.date().optional(),
                endDate: Joi.date().optional(),
            });

            const { error, value } = schema.validate({ ...req.query, ...req.params });
            if (error) {
                return ResponseHandler.error(res, error.details[0].message, 400);
            }

            let { accountId, perPage, page, startDate, endDate, offset, limit } = value;

            startDate = new Date(startDate);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(endDate);
            endDate.setHours(23, 59, 59, 999);

            const where: any = {
                accountId: accountId
            };
            if (startDate && endDate) {
                where.createdAt = { [Op.between]: [startDate, endDate] };
            }

            const data = await Transaction.findAndCountAll({
                where,
                order: [['createdAt', 'ASC']],
                limit,
                offset,
            });

            return ResponseHandler.success(
                res,
                "Transactions fetched",
                paging(data, Number(page), limit)
            );
        } catch (error) {
            logger.error("Transactions error", error);
            return ResponseHandler.error(res, "Error fetching transactions", 500, error);
        }
    }
    /* 
        // Update account
        async update(req: express.Request, res: express.Response) {
            try {
                const schema = Joi.object({
                    id: Joi.number().required(),
                    accountTitle: Joi.string().optional(),
                    status: Joi.string().optional(),
                });
    
                const { error, value } = schema.validate({ ...req.body, ...req.params });
                if (error) {
                    return ResponseHandler.error(res, error.details[0].message, 400);
                }
    
                const { id, ...updateData } = value;
                const account = await Account.findByPk(id);
    
                if (!account) {
                    return ResponseHandler.error(res, "Account not found", 404);
                }
    
                await account.update(updateData);
                return ResponseHandler.success(res, "Account updated successfully", account);
            } catch (error) {
                logger.error("Account update error", error);
                return ResponseHandler.error(res, "Error updating account", 500, error);
            }
        }
    
        // Update status
        async updateStatus(req: express.Request, res: express.Response) {
            try {
                const schema = Joi.object({
                    id: Joi.number().required(),
                    status: Joi.string().required(),
                });
    
                const { error, value } = schema.validate(req.body);
                if (error) {
                    return ResponseHandler.error(res, error.details[0].message, 400);
                }
    
                const account = await Account.findByPk(value.id);
                if (!account) {
                    return ResponseHandler.error(res, "Account not found", 404);
                }
    
                await account.update({ status: value.status });
                return ResponseHandler.success(res, "Status updated successfully");
            } catch (error) {
                logger.error("Status update error", error);
                return ResponseHandler.error(res, "Error updating status", 500, error);
            }
        }
    
        // Delete account (soft delete)
        async delete(req: express.Request, res: express.Response) {
            try {
                const schema = Joi.object({
                    id: Joi.number().required(),
                });
    
                const { error, value } = schema.validate(req.body);
                if (error) {
                    return ResponseHandler.error(res, error.details[0].message, 400);
                }
    
                const account = await Account.findByPk(value.id);
                if (!account) {
                    return ResponseHandler.error(res, "Account not found", 404);
                }
    
                if (account.balance !== 0) {
                    return ResponseHandler.error(res, "Account has balance, cannot be deleted", 400);
                }
    
                await account.update({ status: StatusEnum.Inactive });
                return ResponseHandler.success(res, "Account deactivated successfully");
            } catch (error) {
                logger.error("Account deletion error", error);
                return ResponseHandler.error(res, "Error deleting account", 500, error);
            }
        }
    
        // Process transaction
        async processTransaction(req: express.Request, res: express.Response) {
            const t = await sequelize.transaction();
            try {
                const schema = Joi.object({
                    accountId: Joi.number().required(),
                    transactionType: Joi.string().valid(...Object.values(TransactionTypeEnum)).required(),
                    amount: Joi.number().min(0.01).required(),
                    description: Joi.string().optional(),
                    paymentMethod: Joi.string().valid(...Object.values(PaymentMethodEnum)).required(),
                    refrenceNumber: Joi.string().optional(),
                });
    
                const { error, value } = schema.validate(req.body);
                if (error) {
                    await t.rollback();
                    return ResponseHandler.error(res, error.details[0].message, 400);
                }
    
                const account = await Account.findByPk(value.accountId, { transaction: t });
                if (!account) {
                    await t.rollback();
                    return ResponseHandler.error(res, "Account not found", 404);
                }
    
                if (account.status !== 'Active') {
                    await t.rollback();
                    return ResponseHandler.error(res, "Account is not active", 400);
                }
    
                let newBalance = account.balance;
                if (value.transactionType === 'Deposit') {
                    newBalance += value.amount;
                } else {
                    if (account.balance < value.amount) {
                        await t.rollback();
                        return ResponseHandler.error(res, "Insufficient balance", 400);
                    }
                    newBalance -= value.amount;
                }
    
                await account.update({ balance: newBalance }, { transaction: t });
    
                const transaction = await Transaction.create({
                    ...value,
                    accountId: account.id,
                    refrenceNumber: value.refrenceNumber || `TRX-${Date.now()}`
                }, { transaction: t });
    
                await t.commit();
                return ResponseHandler.success(res, "Transaction processed", {
                    transaction,
                    new_balance: newBalance
                });
            } catch (error) {
                await t.rollback();
                logger.error("Transaction error", error);
                return ResponseHandler.error(res, "Transaction failed", 500, error);
            }
        }
    
        // Transfer between accounts
        async transfer(req: express.Request, res: express.Response) {
            const t = await sequelize.transaction();
            try {
                const schema = Joi.object({
                    from_account_id: Joi.number().required(),
                    to_account_id: Joi.number().required(),
                    amount: Joi.number().min(0.01).required(),
                    description: Joi.string().optional(),
                    refrenceNumber: Joi.string().optional(),
                });
    
                const { error, value } = schema.validate(req.body);
                if (error) {
                    await t.rollback();
                    return ResponseHandler.error(res, error.details[0].message, 400);
                }
    
                if (value.from_account_id === value.to_account_id) {
                    await t.rollback();
                    return ResponseHandler.error(res, "Cannot transfer to same account", 400);
                }
    
                const fromAccount = await Account.findByPk(value.from_account_id, { transaction: t });
                const toAccount = await Account.findByPk(value.to_account_id, { transaction: t });
    
                if (!fromAccount || !toAccount) {
                    await t.rollback();
                    return ResponseHandler.error(res, "One or both accounts not found", 404);
                }
    
                if (fromAccount.balance < value.amount) {
                    await t.rollback();
                    return ResponseHandler.error(res, "Insufficient balance", 400);
                }
    
                const newFromBalance = fromAccount.balance - value.amount;
                const newToBalance = toAccount.balance + value.amount;
    
                await fromAccount.update({ balance: newFromBalance }, { transaction: t });
                await toAccount.update({ balance: newToBalance }, { transaction: t });
    
                const reference = value.refrenceNumber || `TRF-${Date.now()}`;
                const desc = value.description || 'Account transfer';
    
                await Transaction.create({
                    accountId: fromAccount.id,
                    transactionType: TransactionTypeEnum.Transfer,
                    amount: value.amount,
                    description: `${desc} (To: ${toAccount.accountNumber})`,
                    paymentMethod: PaymentMethodEnum.BankTransfer,
                    refrenceNumber: reference
                }, { transaction: t });
    
                await Transaction.create({
                    accountId: toAccount.id,
                    transactionType: TransactionTypeEnum.Deposit,
                    amount: value.amount,
                    description: `${desc} (From: ${fromAccount.accountNumber})`,
                    paymentMethod: PaymentMethodEnum.BankTransfer,
                    refrenceNumber: reference
                }, { transaction: t });
    
                await t.commit();
                return ResponseHandler.success(res, "Transfer completed", {
                    from_balance: newFromBalance,
                    to_balance: newToBalance,
                    reference
                });
            } catch (error) {
                await t.rollback();
                logger.error("Transfer error", error);
                return ResponseHandler.error(res, "Transfer failed", 500, error);
            }
        } */
}