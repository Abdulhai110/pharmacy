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
import { Distributor } from "./distributor";
export class DailyClosing extends Model<
  InferAttributes<DailyClosing>,
  InferCreationAttributes<DailyClosing>
> {
  id: number | null;
  loanTakerId: number;
  distributorId: number;
  closingDate: Date;
  rsTen: number;
  rsTwenty: number;
  rsFifty: number;
  rsHundred: number;
  rs5hundred: number;
  rsThousand: number;
  rs5thousand: number;
  coins: number;
  rsTotal: number;
  jazzCash: number;
  easyPasa: number;
  bank: number;
  accountsTotal: number;
  todayGrandTotal: number;
  description: string;
  yesterdaySale?: number;
  yesterdayTotalAmount: number;
  todaySale: number;
  salesTotal: number;
  createdAt?: Date;
  updatedAt?: Date;
}


DailyClosing.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    loanTakerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: false,
    },
    distributorId: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: false,
    },
    closingDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    rsTen: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
    },
    rsTwenty: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    rsFifty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rsHundred: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rs5hundred: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rsThousand: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rs5thousand: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    coins: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rsTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jazzCash: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    easyPasa: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bank: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    accountsTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    todayGrandTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    yesterdaySale: {
      type: DataTypes.INTEGER,
    },
    yesterdayTotalAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    todaySale: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    salesTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    tableName: "daily_closings",
  }
);

DailyClosing.belongsTo(LoanTaker, { foreignKey: "loanTakerId" });
DailyClosing.belongsTo(Distributor, { foreignKey: "distributorId" });
