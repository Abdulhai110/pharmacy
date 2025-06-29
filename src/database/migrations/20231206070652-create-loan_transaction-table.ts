import { QueryInterface, DataTypes, QueryTypes } from "sequelize";
import Sequelize from "sequelize";
import { StatusEnum, PaymentSourceEnum } from "../../constants/enum";
import { enumKeys } from "../../helpers/helper";
module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("loan_transactions", {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      loanTakerId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      // loan_id: {
      //     type: DataTypes.BIGINT.UNSIGNED,
      //     allowNull: false,
      // },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      description: {
        type: DataTypes.STRING(100),
      },
      amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },

      paymentSourceId: {
        type: DataTypes.BIGINT.UNSIGNED,
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
  },
  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("loan_transactions");
  },
};
