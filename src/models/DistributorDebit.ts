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
export class DistributorDebit extends Model<
  InferAttributes<DistributorDebit>,
  InferCreationAttributes<DistributorDebit>
> {
  id: number | null;
  distributorId: number;
  description: string;
  amount: number;
  billNo: number;
  date?: Date;
  installmentAmount?: number;
  installmentCount?: number;
  status: StatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

DistributorDebit.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    distributorId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    installmentAmount: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      allowNull: true,
    },
    installmentCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    billNo: {
      type: DataTypes.STRING(20),
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
    tableName: "distributor-debits",
  }
);
