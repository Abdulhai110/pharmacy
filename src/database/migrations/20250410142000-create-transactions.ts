import { QueryInterface, DataTypes } from 'sequelize';
import { TransactionTypeEnum, PaymentMethodEnum, TransactionStatusEnum } from '../../constants/enum';
import { enumKeys } from '../../helpers/helper';
import Sequelize from "sequelize";

export = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('transactions', {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      transactionType: {
        type: DataTypes.ENUM(...enumKeys(TransactionTypeEnum)),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      paymentMethod: {
        type: DataTypes.ENUM(...enumKeys(PaymentMethodEnum)),
        allowNull: false,
      },
      refrenceNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      accountId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'accounts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      expenseId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'expenses',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      categoryId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'expense_categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      status: {
        type: DataTypes.ENUM(...enumKeys(TransactionStatusEnum)),
        defaultValue: TransactionStatusEnum.Completed,
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
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('transactions');
  },
};
