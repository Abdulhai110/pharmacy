import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  ForeignKey,
  Sequelize,
} from "sequelize";
import { sequelize } from "../config/connection";
import { StatusEnum } from "../constants/enum";
import { enumKeys } from "../helpers/helper";
import { Loan } from "./loan";
import { LoanTransaction } from "./loanTransaction";
export class LoanTaker extends Model<
  InferAttributes<LoanTaker>,
  InferCreationAttributes<LoanTaker>
> {
  id: number | null;
  name: string;
  phoneNumber: string;
  cnic: string;
  description: string;
  loanAmount?: number;
  remainingAmount?: number;
  paidAmount?: number;
  status: StatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

LoanTaker.init(
  {
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
    phoneNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    cnic: {
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
  },
  {
    sequelize,
    timestamps: true,
    tableName: "loan_takers",
  }
);

LoanTaker.hasMany(LoanTransaction, {
  foreignKey: "loanTakerId",
});
LoanTaker.hasMany(Loan, {
  foreignKey: "loanTakerId",
});

// LoanTaker.belongsTo(Loan, { foreignKey: 'loanTakerId' });
