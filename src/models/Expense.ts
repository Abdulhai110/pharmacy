import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  Sequelize,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../config/connection";
import { StatusEnum, PaymentMethodEnum, RecurringIntervalEnum } from "../constants/enum";
import { enumKeys } from "../helpers/helper";
import { User } from "./user";
import { Account } from "./BankAccounts";
import { ExpenseCategory } from "../models/ExpenseCategory";

export class Expense extends Model<
  InferAttributes<Expense>,
  InferCreationAttributes<Expense>
> {
  id: number | null;
  amount!: number;
  description: string;
  date: Date;
  paymentMethod: PaymentMethodEnum;
  status: StatusEnum;
  userId: ForeignKey<User['id']>;
  accountId: ForeignKey<Account['id']>;
  categoryId: ForeignKey<ExpenseCategory['id']>;
  createdAt?: Date;
  updatedAt?: Date;
}

Expense.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    paymentMethod: {
      type: DataTypes.ENUM(...enumKeys(PaymentMethodEnum)),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...enumKeys(StatusEnum)),
      defaultValue: StatusEnum.Active,
    },
    accountId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'accounts',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'expense_categories',
        key: 'id'
      }
    },
  },
  {
    sequelize,
    timestamps: true,
    tableName: "expenses",
  }
);

// Relationships
Expense.belongsTo(User, { foreignKey: 'userId' });
Expense.belongsTo(Account, { foreignKey: 'accountId' });
Expense.belongsTo(ExpenseCategory, { foreignKey: 'categoryId' });
User.hasMany(Expense, { foreignKey: 'userId' });
Account.hasMany(Expense, { foreignKey: 'accountId' });
// ExpenseCategory.hasMany(Expense, { foreignKey: 'categoryId' });