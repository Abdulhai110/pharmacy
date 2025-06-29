import { QueryInterface, DataTypes } from 'sequelize';
import { StatusEnum } from '../../constants/enum';
import { enumKeys } from '../../helpers/helper';
import Sequelize from "sequelize";

export = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('expense_categories', {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...enumKeys(StatusEnum)),
        defaultValue: StatusEnum.Active,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    });

    // Insert default categories
    await queryInterface.bulkInsert('expense_categories', [
      {
        name: 'Office Supplies', description: 'Pens, paper, etc.', status: StatusEnum.Active, createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Travel', description: 'Business travel expenses', status: StatusEnum.Active, createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Utilities', description: 'Electricity, water, etc.', status: StatusEnum.Active, createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Salaries', description: 'Employee salaries', status: StatusEnum.Active, createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Marketing', description: 'Advertising and promotions', status: StatusEnum.Active, createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('expense_categories');
  },
};