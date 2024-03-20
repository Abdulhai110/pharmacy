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
  loan_amount?: number;
  remaining_amount?: number;
  paid_amount?: number;
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
    tableName: "distributors",
  }
);

Distributor.hasMany(DistributorCredit, {
  foreignKey: "distributor_id",
});
Distributor.hasMany(DistributorDebit, {
  foreignKey: "distributor_id",
});
