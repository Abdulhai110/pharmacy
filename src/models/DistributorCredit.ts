import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  ForeignKey,
  Sequelize,
} from "sequelize";
import { sequelize } from "../config/connection";
import { StatusEnum, PaymentSourceEnum } from "../constants/enum";
import { enumKeys } from "../helpers/helper";
import { Loan } from "./loan";
export class DistributorCredit extends Model<
  InferAttributes<DistributorCredit>,
  InferCreationAttributes<DistributorCredit>
> {
  id: number | null;
  distributorId: number;
  //   loan_id: number;
  description: string;
  date: Date;
  amount: number;
  gstAmount: number;
  advTaxAmount: number;
  paymentSourceId: number;
  status: StatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

DistributorCredit.init(
  {
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
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    description: {
      type: DataTypes.STRING(100),
    },
    amount: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      allowNull: false,
    },
    gstAmount: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      allowNull: true,
    },
    advTaxAmount: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      allowNull: true,
    },
    paymentSourceId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(...enumKeys(StatusEnum)),
      defaultValue: StatusEnum.Active,
    },

  },
  {
    sequelize,
    timestamps: true,
    tableName: "distributor-credits",
  }
);

// LoanTaker.belongsTo(Loan, { foreignKey: 'loanTakerId' });
