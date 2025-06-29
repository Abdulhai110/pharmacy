import express from "express";
import { ExpenseCategory } from "../models/ExpenseCategory";
import Joi from "joi";
import { ResponseHandler } from "../utils/respHandler";
import logger from "../utils/logger";
import { paging } from "../helpers/helper";
import { StatusEnum } from "../constants/enum";
import { Expense } from "../models/Expense";

const { Op } = require("sequelize");

export class ExpenseCategoryController {
    private static instance: ExpenseCategoryController | null = null;

    private constructor() { }

    static init(): ExpenseCategoryController {
        if (this.instance == null) {
            this.instance = new ExpenseCategoryController();
        }
        return this.instance;
    }

    // Create new category
    async create(req: express.Request, res: express.Response) {
        try {
            const schema = Joi.object({
                name: Joi.string().required(),
                description: Joi.string().allow(null, ''),
                status: Joi.string().valid(...Object.values(StatusEnum)).default('Active'),
            });

            const { error, value } = schema.validate(req.body);
            if (error) {
                return ResponseHandler.error(res, error.details[0].message, 400);
            }

            const existingCategory = await ExpenseCategory.findOne({
                where: { name: value.name }
            });

            if (existingCategory) {
                return ResponseHandler.error(res, "Category with this name already exists", 400);
            }

            const category = await ExpenseCategory.create(value);
            return ResponseHandler.success(res, "Category created successfully", category);
        } catch (error) {
            logger.error("Category creation error", error);
            return ResponseHandler.error(res, "Error creating category", 500, error);
        }
    }

    // List categories
    async list(req: express.Request, res: express.Response) {
        try {
            const { perPage = 10, page = 1, keyword, status } = req.query;

            const limit = Number(perPage);
            const offset = (Number(page) - 1) * limit;

            const where: any = {};
            if (keyword) {
                where.name = { [Op.like]: `%${keyword}%` };
            }
            if (status) where.status = status;

            const data = await ExpenseCategory.findAndCountAll({
                where,
                order: [['name', 'ASC']],
                limit,
                offset,
            });

            return ResponseHandler.success(
                res,
                "Categories fetched successfully",
                paging(data, Number(page), limit)
            );
        } catch (error) {
            logger.error("Category list error", error);
            return ResponseHandler.error(res, "Error fetching categories", 500, error);
        }
    }

    async expenseCategories(req: express.Request, res: express.Response) {
        try {
            const { limit, offset, name } = req.query;

            const where: any = { status: { [Op.eq]: 'Active' } };

            if (name) where["name"] = { [Op.like]: `%${name}%` };
            const data = await ExpenseCategory.findAndCountAll({
                where
            });

            logger.info(`Fetched expense successfully. Total records: ${data.count}`);
            return ResponseHandler.success(
                res,
                "Expense fetched successfully",
                paging(data, Number(offset), Number(limit))
            );

        } catch (error) {
            logger.error("Error fetching expense", { error });
            return ResponseHandler.error(res, "Error fetching expense", 500, error);
        }
    }

    // Update category
    async update(req: express.Request, res: express.Response) {
        try {
            const schema = Joi.object({
                id: Joi.number().required(),
                name: Joi.string(),
                description: Joi.string().allow(null, ''),
                status: Joi.string().valid(...Object.values(StatusEnum)),
            });

            const { error, value } = schema.validate(req.body);
            if (error) {
                return ResponseHandler.error(res, error.details[0].message, 400);
            }

            const category = await ExpenseCategory.findByPk(value.id);
            if (!category) {
                return ResponseHandler.error(res, "Category not found", 404);
            }

            // Check if name is being changed and if new name already exists
            if (value.name && value.name !== category.name) {
                const existingCategory = await ExpenseCategory.findOne({
                    where: { name: value.name }
                });

                if (existingCategory) {
                    return ResponseHandler.error(res, "Category with this name already exists", 400);
                }
            }

            await category.update(value);
            return ResponseHandler.success(res, "Category updated successfully", category);
        } catch (error) {
            logger.error("Category update error", error);
            return ResponseHandler.error(res, "Error updating category", 500, error);
        }
    }

    // Delete category
    async delete(req: express.Request, res: express.Response) {
        try {
            const { id } = req.params;

            // Check if category has expenses
            const expenseCount = await Expense.count({
                where: { categoryId: id }
            });

            if (expenseCount > 0) {
                return ResponseHandler.error(res, "Cannot delete category with associated expenses", 400);
            }

            const deleted = await ExpenseCategory.destroy({
                where: { id }
            });

            if (!deleted) {
                return ResponseHandler.error(res, "Category not found", 404);
            }

            return ResponseHandler.success(res, "Category deleted successfully");
        } catch (error) {
            logger.error("Category delete error", error);
            return ResponseHandler.error(res, "Error deleting category", 500, error);
        }
    }
}