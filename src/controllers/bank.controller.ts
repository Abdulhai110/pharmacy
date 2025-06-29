import express from 'express';
import Joi from 'joi';
import { ResponseHandler } from '../utils/respHandler';
import logger from '../utils/logger';
import { StatusEnum } from '../constants/enum';
import { enumKeys, paging } from '../helpers/helper';
import { sequelize } from '../config/connection';
import { Op } from 'sequelize';
import { Bank } from '../models/Banks';
import { Account } from '../models/BankAccounts';

export class BankController {
    private static instance: BankController | null = null;

    private constructor() { }

    static init(): BankController {
        if (this.instance === null) {
            this.instance = new BankController();
        }
        return this.instance;
    }

    /**
     * Create a new bank
     */
    async create(req: express.Request, res: express.Response) {
        const transaction = await sequelize.transaction();
        try {
            const schema = Joi.object({
                name: Joi.string().max(100).required(),
                code: Joi.string().max(20).required(),
                branch: Joi.allow(null, '').optional(),
                address: Joi.allow(null, '').optional(),
                phone: Joi.allow(null, '').optional(),
                email: Joi.allow(null, '').optional(),
                website: Joi.allow(null, '').optional(),
                status: Joi.string().valid(...enumKeys(StatusEnum)).optional()
            });

            const { error, value } = schema.validate(req.body);
            if (error) {
                await transaction.rollback();
                logger.warn(`Bank creation validation failed: ${error.message}`);
                return ResponseHandler.error(res, error.details[0].message, 400);
            }

            // Check if bank code already exists
            const existingBank = await Bank.findOne({
                where: { code: value.code },
                transaction
            });

            if (existingBank) {
                await transaction.rollback();
                logger.warn(`Bank creation failed - code already exists: ${value.code}`);
                return ResponseHandler.error(res, 'Bank code already exists', 409);
            }

            const bank = await Bank.create({
                ...value,
                status: value.status || StatusEnum.Active
            }, { transaction });

            await transaction.commit();
            logger.info(`Bank created successfully: ${bank.id}`);
            return ResponseHandler.success(res, 'Bank created successfully', bank);
        } catch (error) {
            await transaction.rollback();
            logger.error(`Bank creation error: ${error.message}`, { error });
            return ResponseHandler.error(res, 'Failed to create bank', 500, error);
        }
    }

    /**
     * Get list of banks with pagination
     */
    async list(req: express.Request, res: express.Response) {
        try {
            const { limit, offset, keyword, status } = req.query;

            const where: any = {};
            if (keyword) {
                where[Op.or] = [
                    { name: { [Op.like]: `%${keyword}%` } },
                    { code: { [Op.like]: `%${keyword}%` } },
                    { branch: { [Op.like]: `%${keyword}%` } }
                ];
            }
            if (status) where.status = status;

            const data = await Bank.findAndCountAll({
                where,
                order: [['name', 'ASC']],
                limit: Number(limit),
                offset: Number(offset)
            });

            logger.info(`Fetched ${data.count} banks`);
            return ResponseHandler.success(
                res,
                'Banks fetched successfully',
                paging(data, Number(offset), Number(limit))
            );
        } catch (error) {
            logger.error(`Bank list error: ${error.message}`, { error });
            return ResponseHandler.error(res, 'Failed to fetch banks', 500, error);
        }
    }

    /**
     * Get list of banks with pagination
     */
    async getAllBanks(req: express.Request, res: express.Response) {
        try {
            const { limit, offset, keyword, status } = req.query;

            const where: any = {};
            if (keyword) {
                where[Op.or] = [
                    { name: { [Op.like]: `%${keyword}%` } },
                    { code: { [Op.like]: `%${keyword}%` } },
                    { branch: { [Op.like]: `%${keyword}%` } }
                ];
            }
            /*
            if (status) where.status = status;
 */
            const data = await Bank.findAndCountAll({
                where,
                order: [['name', 'ASC']],
                attributes: ['id', 'name', 'code', 'branch', 'status']
            });

            logger.info(`Fetched ${data.count} banks`);
            return ResponseHandler.success(
                res,
                'Banks fetched successfully',
                paging(data, 1, data.count)
            );
        } catch (error) {
            logger.error(`Bank list error: ${error.message}`, { error });
            return ResponseHandler.error(res, 'Failed to fetch banks', 500, error);
        }
    }

    /**
     * Get bank details by ID
     */
    async detail(req: express.Request, res: express.Response) {
        try {
            const schema = Joi.object({
                id: Joi.number().required()
            });

            const { error, value } = schema.validate(req.params);
            if (error) {
                logger.warn(`Bank detail validation failed: ${error.message}`);
                return ResponseHandler.error(res, error.details[0].message, 400);
            }

            const bank = await Bank.findByPk(value.id);
            if (!bank) {
                logger.warn(`Bank not found: ${value.id}`);
                return ResponseHandler.error(res, 'Bank not found', 404);
            }

            logger.info(`Fetched bank details: ${value.id}`);
            return ResponseHandler.success(res, 'Bank details', bank);
        } catch (error) {
            logger.error(`Bank detail error: ${error.message}`, { error });
            return ResponseHandler.error(res, 'Failed to fetch bank details', 500, error);
        }
    }

    /**
     * Update bank information
     */
    async update(req: express.Request, res: express.Response) {
        const transaction = await sequelize.transaction();
        try {
            const schema = Joi.object({
                id: Joi.number().required(),
                name: Joi.string().max(100).required(),
                code: Joi.string().max(20).required(),
                branch: Joi.allow(null, '').optional(),
                address: Joi.allow(null, '').optional(),
                phone: Joi.allow(null, '').optional(),
                email: Joi.allow(null, '').optional(),
                website: Joi.allow(null, '').optional(),
                status: Joi.string().valid(...enumKeys(StatusEnum)).optional()
            });

            const { error, value } = schema.validate({ ...req.params, ...req.body });
            if (error) {
                await transaction.rollback();
                logger.warn(`Bank update validation failed: ${error.message}`);
                return ResponseHandler.error(res, error.details[0].message, 400);
            }

            const { id, ...updateData } = value;

            const bank = await Bank.findByPk(id, { transaction });
            if (!bank) {
                await transaction.rollback();
                logger.warn(`Bank not found for update: ${id}`);
                return ResponseHandler.error(res, 'Bank not found', 404);
            }

            // Check if new code conflicts with other banks
            if (updateData.code && updateData.code !== bank.code) {
                const existingBank = await Bank.findOne({
                    where: { code: updateData.code },
                    transaction
                });

                if (existingBank) {
                    await transaction.rollback();
                    logger.warn(`Bank code conflict: ${updateData.code}`);
                    return ResponseHandler.error(res, 'Bank code already exists', 409);
                }
            }

            await bank.update(updateData, { transaction });
            await transaction.commit();

            logger.info(`Bank updated successfully: ${id}`);
            return ResponseHandler.success(res, 'Bank updated successfully', bank);
        } catch (error) {
            await transaction.rollback();
            logger.error(`Bank update error: ${error.message}`, { error });
            return ResponseHandler.error(res, 'Failed to update bank', 500, error);
        }
    }

    /**
     * Update bank status
     */
    async updateStatus(req: express.Request, res: express.Response) {
        const transaction = await sequelize.transaction();
        try {
            const schema = Joi.object({
                id: Joi.number().required(),
                status: Joi.string().valid(...enumKeys(StatusEnum)).required()
            });

            const { error, value } = schema.validate(req.body);
            if (error) {
                await transaction.rollback();
                logger.warn(`Bank status update validation failed: ${error.message}`);
                return ResponseHandler.error(res, error.details[0].message, 400);
            }

            const bank = await Bank.findByPk(value.id, { transaction });
            if (!bank) {
                await transaction.rollback();
                logger.warn(`Bank not found for status update: ${value.id}`);
                return ResponseHandler.error(res, 'Bank not found', 404);
            }

            await bank.update({ status: value.status }, { transaction });
            await transaction.commit();

            logger.info(`Bank status updated: ${value.id} to ${value.status}`);
            return ResponseHandler.success(res, 'Bank status updated successfully');
        } catch (error) {
            await transaction.rollback();
            logger.error(`Bank status update error: ${error.message}`, { error });
            return ResponseHandler.error(res, 'Failed to update bank status', 500, error);
        }
    }

    /**
     * Delete a bank (soft delete by changing status)
     */
    async delete(req: express.Request, res: express.Response) {
        const transaction = await sequelize.transaction();
        try {
            const schema = Joi.object({
                id: Joi.number().required()
            });

            const { error, value } = schema.validate(req.body);
            if (error) {
                await transaction.rollback();
                logger.warn(`Bank delete validation failed: ${error.message}`);
                return ResponseHandler.error(res, error.details[0].message, 400);
            }

            const bank = await Bank.findByPk(value.id, { transaction });
            if (!bank) {
                await transaction.rollback();
                logger.warn(`Bank not found for deletion: ${value.id}`);
                return ResponseHandler.error(res, 'Bank not found', 404);
            }

            // Count accounts directly
            const accountsCount = await Account.count({
                where: { bankId: value.id },
                transaction
            });

            if (accountsCount > 0) {
                await transaction.rollback();
                logger.warn(`Bank deletion prevented - has accounts: ${value.id}`);
                return ResponseHandler.error(res, 'Cannot delete bank with existing accounts', 400);
            }

            await bank.update({ status: StatusEnum.Inactive }, { transaction });
            await transaction.commit();

            logger.info(`Bank marked as inactive: ${value.id}`);
            return ResponseHandler.success(res, 'Bank deactivated successfully');
        } catch (error) {
            await transaction.rollback();
            logger.error(`Bank deletion error: ${error.message}`, { error });
            return ResponseHandler.error(res, 'Failed to delete bank', 500, error);
        }
    }
}