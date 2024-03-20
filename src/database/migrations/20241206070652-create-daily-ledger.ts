import { QueryInterface, DataTypes, QueryTypes } from "sequelize";
import Sequelize from "sequelize";
import { StatusEnum, PaymentSourceEnum } from "../../constants/enum";
import { enumKeys } from "../../helpers/helper";
module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("daily_ledger", {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      ledger_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      rs_ten: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rs_twenty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rs_fifty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rs_hundred: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rs_5hundred: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rs_thousand: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rs_5thousand: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      coins: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rs_total: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jazz_cash: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      easy_pasa: {
        type: DataTypes.INTEGER,
      },
      bank: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      accounts_total: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      grand_total: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(100),
      },
      // Add other fields as needed
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
    return queryInterface.dropTable("daily_ledger");
  },
};
