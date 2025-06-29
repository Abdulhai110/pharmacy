import { QueryInterface, DataTypes, QueryTypes } from "sequelize";
import Sequelize from "sequelize";
import { StatusEnum, PaymentSourceEnum } from "../../constants/enum";
import { enumKeys } from "../../helpers/helper";
module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("daily_closings", {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      loanTakerId: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: false,
      },
      distributorId: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: false,
      },
      closing_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      ten: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      twenty: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      fifty: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      hundred: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      fiveHundred: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      thousand: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      fiveThousand: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      coins: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      physicalCashTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bankAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      todayGrandTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      yesterdaySale: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      todaySale: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      salesTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      distributorsDebit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      distributorsCredit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      loanTakersDebit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      loanTakersCredit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expenses: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dayTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dayClosingGap: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(100),
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
  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("daily_closings");
  },
};
