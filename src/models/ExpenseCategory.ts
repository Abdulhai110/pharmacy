import { Model, DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../config/connection";
import { StatusEnum } from "../constants/enum";
import { enumKeys } from "../helpers/helper";
import { Expense } from "./Expense";

export class ExpenseCategory extends Model {
  static associate?: (db: any) => void;
  id: number | null;
  name!: string;
  description: string | null;
  status: StatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

ExpenseCategory.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
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
    tableName: "expense_categories",
  }
);

ExpenseCategory.associate = (db: any) => {
  ExpenseCategory.hasMany(db.Expense, { foreignKey: 'categoryId' });
};
// ExpenseCategory.hasMany(Expense, { foreignKey: 'categoryId' })