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
  phone_number: string;
  cnic: string;
  description: string;
  loan_amount?: number;
  remaining_amount?: number;
  paid_amount?: number;
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
    phone_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    cnic: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    loan_amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    remaining_amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    paid_amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
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
  },
  {
    sequelize,
    timestamps: false,
    tableName: "loan_takers",
  }
);

LoanTaker.hasMany(LoanTransaction, {
  foreignKey: "loan_taker_id",
});
LoanTaker.hasMany(Loan, {
  foreignKey: "loan_taker_id",
});

// LoanTaker.belongsTo(Loan, { foreignKey: 'loan_taker_id' });
