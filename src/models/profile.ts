import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  ForeignKey,
  Sequelize,
} from "sequelize";
import { sequelize } from "../config/connection";
import { UserTypeEnum } from "../constants/enum";
import { enumKeys } from "../helpers/helper";
import { User } from "./user";
export class Profile extends Model<
  InferAttributes<Profile>,
  InferCreationAttributes<Profile>
> {
  id: number | null;
  userId: number;
  // photo_id: number | null;
  // photo_secure_url: string | null;
  phoneno: string;
  createdAt?: Date;
  updatedAt?: Date;

  // getFullname() {
  //     return [this.firstName, this.lastName].join(' ');
  // }
}

Profile.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    // photo_id: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // photo_secure_url: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    phoneno: {
      type: DataTypes.STRING(50),
      allowNull: true,
    }
  },
  {
    sequelize,
    timestamps: true,
    tableName: "profiles",
  }
);
