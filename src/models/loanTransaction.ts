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
import { LoanTaker } from "./loanTaker";
export class LoanTransaction extends Model<
  InferAttributes<LoanTransaction>,
  InferCreationAttributes<LoanTransaction>
> {
  id: number | null;
  loanTakerId: number;
  //   loan_id: number;
  description: string;
  date: Date;
  amount: number;
  paymentSourceId: number;
  status: StatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

LoanTransaction.init(
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
    // loan_id: {
    //     type: DataTypes.BIGINT.UNSIGNED,
    //     allowNull: false,
    // },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    description: {
      type: DataTypes.STRING(100),
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
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
    tableName: "loan_transactions",
  }
);

/* LoanTaker.belongsTo(Loan, { foreignKey: 'loanTakerId' });

LoanTransaction.belongsTo(LoanTaker, {
  foreignKey: "loanTakerId",
  as: 'LoanTaker'
}); */
