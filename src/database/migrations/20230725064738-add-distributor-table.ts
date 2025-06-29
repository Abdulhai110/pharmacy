import { QueryInterface, DataTypes, QueryTypes } from "sequelize";
import { enumKeys } from "../../helpers/helper";
import { StatusEnum } from "../../constants/enum";
import Sequelize from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("distributors", {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(100),
      },
      phoneNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      companyName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      loanAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      remainingAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      paidAmount: {
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
    return queryInterface.dropTable("distributors");
  },
};
