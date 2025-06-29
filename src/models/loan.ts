import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  ForeignKey,
  Sequelize,
} from "sequelize";
import { sequelize } from "../config/connection";
import { LoanTypeEnum, PaymentSourceEnum, StatusEnum } from "../constants/enum";
import { enumKeys } from "../helpers/helper";
import { LoanTaker } from "./loanTaker";
export class Loan extends Model<
  InferAttributes<Loan>,
  InferCreationAttributes<Loan>
> {
  id: number | null;
  loanTakerId: number;
  loanType: string;
  description: string;
  amount: number;
  billNo: number;
  date?: Date;
  returnDate?: Date;
  paymentSourceId: number;
  installmentAmount?: number;
  installmentCount?: number;
  status: StatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

Loan.init(
  {
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
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    returnDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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
  },
  {
    sequelize,
    timestamps: true, // Sequelize automatically manages createdAt and updatedAt
    tableName: "loans",
  }
);


/* Loan.belongsTo(LoanTaker, {
  foreignKey: "loanTakerId",
  as: 'LoanTaker'
}); */
