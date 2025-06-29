import { QueryInterface, DataTypes } from 'sequelize';
import { AccountTypeEnum, StatusEnum } from '../../constants/enum';
import { enumKeys } from '../../helpers/helper';
import Sequelize from "sequelize";

export = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('accounts', {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      accountNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      accountTitle: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      accountType: {
        type: DataTypes.ENUM(...enumKeys(AccountTypeEnum)),
        allowNull: false,
      },
      balance: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      openingBalance: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM(...enumKeys(StatusEnum)),
        defaultValue: StatusEnum.Active,
      },
      bankId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'banks',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
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
    await queryInterface.dropTable('accounts');
  },
};
