import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  ForeignKey,
  Sequelize,
} from "sequelize";
import { sequelize } from "../config/connection";
import { TransactionTypeEnum, PaymentMethodEnum, StatusEnum, TransactionStatusEnum } from "../constants/enum";
import { enumKeys } from "../helpers/helper";
import { Account } from "../models/BankAccounts";
import { Expense } from "./Expense";
import { ExpenseCategory } from "./ExpenseCategory";

export class Transaction extends Model<
  InferAttributes<Transaction>,
  InferCreationAttributes<Transaction>
> {
  id: number | null;
  transactionType: TransactionTypeEnum;
  amount: number;
  description: string;
  paymentMethod: PaymentMethodEnum;
  refrenceNumber: string;
  accountId: ForeignKey<Account['id']>;
  expenseId: ForeignKey<Expense['id']> | null; // Add this
  categoryId: ForeignKey<ExpenseCategory['id']> | null; // Add this
  status: TransactionStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    transactionType: {
      type: DataTypes.ENUM(...enumKeys(TransactionTypeEnum)),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.ENUM(...enumKeys(PaymentMethodEnum)),
      allowNull: false,
    },
    refrenceNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    accountId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'accounts',
        key: 'id'
      }
    },
    expenseId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'expenses',
        key: 'id'
      }
    },
    categoryId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'expense_categories',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM(...enumKeys(StatusEnum)),
      defaultValue: TransactionStatusEnum.Completed,
    }
  },
  {
    sequelize,
    timestamps: true,
    tableName: "transactions",
  }
);

// Relationships
Transaction.belongsTo(Account, { foreignKey: 'accountId' });
Account.hasMany(Transaction, { foreignKey: 'accountId' });
Transaction.belongsTo(Expense, { foreignKey: 'expenseId' });
Transaction.belongsTo(ExpenseCategory, { foreignKey: 'categoryId' });