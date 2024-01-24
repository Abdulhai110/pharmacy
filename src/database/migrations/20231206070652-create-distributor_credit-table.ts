import { QueryInterface, DataTypes, QueryTypes } from "sequelize";
import Sequelize from "sequelize";
import { StatusEnum, PaymentSourceEnum } from "../../constants/enum";
import { enumKeys } from "../../helpers/helper";
module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("distributor-credits", {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      distributor_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      // loan_id: {
      //     type: DataTypes.BIGINT.UNSIGNED,
      //     allowNull: false,
      // },
      credit_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(100),
      },
      credit_amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },

      payment_source: {
        type: DataTypes.ENUM(...enumKeys(PaymentSourceEnum)),
        defaultValue: PaymentSourceEnum.CASH,
      },
      status: {
        type: DataTypes.ENUM(...enumKeys(StatusEnum)),
        defaultValue: StatusEnum.Active,
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
    return queryInterface.dropTable("distributor-credits");
  },
};
