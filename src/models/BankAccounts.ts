import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  Sequelize,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../config/connection";
import { AccountTypeEnum, StatusEnum } from "../constants/enum";
import { enumKeys } from "../helpers/helper";
import { User } from "./user"; // Assuming you have a User model
import { Bank } from "./Banks";

export class Account extends Model<
  InferAttributes<Account>,
  InferCreationAttributes<Account>
> {
  id: number | null;
  bankId!: number;
  accountNumber: string;
  accountTitle: string;
  accountType: AccountTypeEnum;
  balance: number;
  openingBalance: number;
  status: StatusEnum;
  userId: ForeignKey<User['id']>;
  createdAt?: Date;
  updatedAt?: Date;
}

Account.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    bankId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'banks',
        key: 'id'
      }
    },
    accountNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    accountTitle: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    accountType: {
      type: DataTypes.ENUM(...enumKeys(AccountTypeEnum)),
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      allowNull: false,
    },
    openingBalance: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...enumKeys(StatusEnum)),
      defaultValue: StatusEnum.Active,
    }
  },
  {
    sequelize,
    timestamps: true,
    tableName: "accounts",
  }
);

// Relationships
Account.belongsTo(Bank, { foreignKey: 'bankId' });
Account.belongsTo(User, { foreignKey: 'userId' });
Bank.hasMany(Account, { foreignKey: 'bankId' });
User.hasMany(Account, { foreignKey: 'userId' });