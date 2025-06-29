import { QueryInterface, DataTypes, QueryTypes } from "sequelize";
import { enumKeys } from "../../helpers/helper";
import { StatusEnum } from "../../constants/enum";
import Sequelize from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("loan_takers", {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      cnic: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(100),
      },
      loanAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      paidAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      remainingAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
    return queryInterface.dropTable("loan_takers");
  },
};
