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
import { DistributorCredit } from "./DistributorCredit";
import { DistributorDebit } from "./DistributorDebit";
export class Distributor extends Model<
  InferAttributes<Distributor>,
  InferCreationAttributes<Distributor>
> {
  id: number | null;
  name: string;
  companyName: string;
  phoneNo: string;
  description: string;
  loanAmount?: number;
  remainingAmount?: number;
  paidAmount?: number;
  status: StatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

Distributor.init(
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
    phoneNo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    companyName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    loanAmount: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      allowNull: false,
    },
    remainingAmount: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      allowNull: true,
    },
    paidAmount: {
      type: DataTypes.BIGINT,
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
    tableName: "distributors",
  }
);

Distributor.hasMany(DistributorCredit, {
  foreignKey: "distributorId",
});
Distributor.hasMany(DistributorDebit, {
  foreignKey: "distributorId",
});
