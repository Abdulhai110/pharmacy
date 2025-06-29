import { QueryInterface, DataTypes, QueryTypes } from "sequelize";
import Sequelize from "sequelize";
import { LoanTypeEnum, StatusEnum } from "../../constants/enum";
import { enumKeys } from "../../helpers/helper";
module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("loans", {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      loanTakerId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      returnDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
      },
      paymentSourceId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
      loanType: {
        type: DataTypes.ENUM(...enumKeys(LoanTypeEnum)),
        allowNull: false,
        defaultValue: LoanTypeEnum.money,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      installmentAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      installmentCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      billNo: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(100),
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
    return queryInterface.dropTable("loans");
  },
};
