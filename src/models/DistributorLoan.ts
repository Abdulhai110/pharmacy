import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  ForeignKey,
  Sequelize,
} from "sequelize";
import { sequelize } from "../config/connection";
import { LoanTypeEnum, StatusEnum } from "../constants/enum";
import { enumKeys } from "../helpers/helper";
export class DistributorLoan extends Model<
  InferAttributes<DistributorLoan>,
  InferCreationAttributes<DistributorLoan>
> {
  id: number | null;
  loanTakerId: number;
  loanType: string;
  description: string;
  amount: number;
  billNo: number;
  date?: Date;
  returnDate?: Date;
  installmentAmount?: number;
  installmentCount?: number;
  status: StatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

DistributorLoan.init(
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
    timestamps: true,
    tableName: "distributor_loans",
  }
);
