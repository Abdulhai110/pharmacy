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
      closingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      rsTen: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(100),
      },
      rsTwenty: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      rsFifty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rsHundred: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rs5hundred: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rsThousand: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rs5thousand: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      coins: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rsTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jazzCash: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      easyPasa: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bank: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      accountsTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      todayGrandTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      yesterdaySale: {
        type: DataTypes.INTEGER,
      },
      yesterdayTotalAmount: {
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
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updatedAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
        allowNull: false,
      },
    });
  },
  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("daily_closings");
  },
};
