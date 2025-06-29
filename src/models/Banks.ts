import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  Sequelize,
} from "sequelize";
import { sequelize } from "../config/connection";
import { StatusEnum } from "../constants/enum";
import { enumKeys } from "../helpers/helper";

export class Bank extends Model<
  InferAttributes<Bank>,
  InferCreationAttributes<Bank>
> {
  id: number | null;
  name: string;
  code: string;
  branch: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  status: StatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

Bank.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    branch: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    website: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    status: {
      type: DataTypes.ENUM(...enumKeys(StatusEnum)),
      defaultValue: StatusEnum.Active,
    }
  },
  {
    sequelize,
    timestamps: true,
    tableName: "banks",
  }
);

// Relationships are defined in the Account model
