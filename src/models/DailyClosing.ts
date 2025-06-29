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
import { Expense } from "./Expense";
export class DailyClosing extends Model<
  InferAttributes<DailyClosing>,
  InferCreationAttributes<DailyClosing>
> {
  id: number;
  closing_date: Date;
  loanTakerId: number;
  distributorId: number;
  ten: number;
  twenty: number;
  fifty: number;
  hundred: number;
  fiveHundred: number;
  thousand: number;
  fiveThousand: number;
  coins: number;
  physicalCashTotal: number;
  bankAmount: number;
  todayGrandTotal: number;
  yesterdaySale: number;
  todaySale: number;
  salesTotal: number;
  distributorsDebit: number;
  distributorsCredit: number;
  loanTakersDebit: number;
  loanTakersCredit: number;
  expenses: number;
  dayTotal: number;
  dayClosingGap: number;
  description: string;
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
    closing_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    ten: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    twenty: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    fifty: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    hundred: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fiveHundred: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    thousand: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fiveThousand: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    coins: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    physicalCashTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bankAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    todayGrandTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    todaySale: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    yesterdaySale: {
      type: DataTypes.INTEGER,
    },
    salesTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    distributorsDebit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    distributorsCredit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    loanTakersCredit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    loanTakersDebit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expenses: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dayTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dayClosingGap: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
    },
  },

  {
    sequelize,
    timestamps: true,
    tableName: "daily_closings",
  }
);

DailyClosing.belongsTo(LoanTaker, { foreignKey: "loanTakerId" });
DailyClosing.belongsTo(Distributor, { foreignKey: "distributorId" });
// DailyClosing.hasMany(Expense, { foreignKey: 'closing_id' });
// DailyClosing.hasMany(LoanTaker, {
//   foreignKey: "loanTakerId",
// });
// DailyClosing.hasMany(Distributor, {
//   foreignKey: "distributorId",
// });

// models/dayEndClosing.ts
/* import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
} from "sequelize";
import { sequelize } from "../config/connection";
import { Loan } from "./loan";
import { LoanTransaction } from "./loanTransaction";
import { Expense } from "./Expense";
import { LoanTaker } from "./loanTaker";
import { Distributor } from "./distributor";

export class DailyClosing extends Model<
  InferAttributes<DailyClosing>,
  InferCreationAttributes<DailyClosing>
> {
  id: number;
  closing_date: Date;
  loanTakerId: number;
  distributorId: number;
  ten: number;
  twenty: number;
  fifty: number;
  hundred: number;
  fiveHundred: number;
  thousand: number;
  fiveThousand: number;
  coins: number;
  physicalCashTotal: number;
  bankAmount: number;
  todayGrandTotal: number;
  yesterdaySale: number;
  yesterday_total_amount: number;
  todaySale: number;
  salesTotal: number;
  distributorsDebit: number;
  loanTakersDebit: number;
  loanTakersCredit: number;
  expenses: number;
  createdAt?: Date;
  updatedAt?: Date;
}

DailyClosing.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    closing_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    loanTakerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: false,
    },
    distributorId: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: false,
    },
    ten: DataTypes.INTEGER,
    twenty: DataTypes.INTEGER,
    fifty: DataTypes.INTEGER,
    hundred: DataTypes.INTEGER,
    fiveHundred: DataTypes.INTEGER,
    thousand: DataTypes.INTEGER,
    fiveThousand: DataTypes.INTEGER,
    coins: DataTypes.INTEGER,
    physicalCashTotal: DataTypes.INTEGER,
    bankAmount: DataTypes.INTEGER,
    todayGrandTotal: DataTypes.INTEGER,
    yesterdaySale: DataTypes.INTEGER,
    yesterday_total_amount: DataTypes.INTEGER,
    todaySale: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    salesTotal: DataTypes.INTEGER,
    distributorsDebit: DataTypes.INTEGER,
    loanTakersDebit: DataTypes.INTEGER,
    loanTakersCredit: DataTypes.INTEGER,
    expenses: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "daily_closings",
    timestamps: true,
  }
);

DailyClosing.belongsTo(LoanTaker, { foreignKey: "loanTakerId" });
DailyClosing.belongsTo(Distributor, { foreignKey: "distributorId" });
DailyClosing.hasMany(Loan, { foreignKey: 'date', sourceKey: 'closing_date' });
DailyClosing.hasMany(LoanTransaction, { foreignKey: 'date', sourceKey: 'closing_date' });
DailyClosing.hasMany(Expense, { foreignKey: 'date', sourceKey: 'closing_date' });
 */