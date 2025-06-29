import { QueryInterface, DataTypes, QueryTypes } from "sequelize";
import Sequelize from "sequelize";
import { StatusEnum } from "../../constants/enum";
import { enumKeys } from "../../helpers/helper";
module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("distributor-debits", {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      distributorId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
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
    return queryInterface.dropTable("distributor-debits");
  },
};
