import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  ForeignKey,
  Sequelize,
} from "sequelize";
import { sequelize } from "../config/connection";
import bycrypt, { hash } from "bcryptjs";
import { UserTypeEnum } from "../constants/enum";
import { enumKeys } from "../helpers/helper";
import { Profile } from "./profile";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import moment from "moment";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  id: number | null;
  firstName: string;
  lastName: string;
  email: string;
  role: UserTypeEnum;
  password: string;
  ForgotpasswordToken: string;
  ForgotpasswordExpires: Date | number;
  createdAt?: Date;
  updatedAt?: Date;

  getFullname() {
    return [this.firstName, this.lastName].join(" ");
  }

  validPassword(password: any) {
    return bycrypt.compareSync(password, this.password);
  }

  getJwtToken() {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_ExpiresIn,
    });
  }

  getForgotpasswordToken() {
    const token = crypto.randomBytes(20).toString("hex");
    this.ForgotpasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    this.ForgotpasswordExpires = Date.now() + 10 * 60 * 1000;
    // console.log("innnnnn token" , token)
    // console.log(this.ForgotpasswordExpires)
    return token;
  }
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
    },
    lastName: {
      type: DataTypes.STRING(50),
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM(...enumKeys(UserTypeEnum)),
      defaultValue: UserTypeEnum.Admin,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    ForgotpasswordToken: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    ForgotpasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bycrypt.genSaltSync(10);
          user.password = bycrypt.hashSync(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.password) {
          const salt = await bycrypt.genSaltSync(10);
          user.password = bycrypt.hashSync(user.password, salt);
        }
      },
      beforeDestroy: async (user) => {
        console.log("userrrr deletedd");
        try {
          console.log(user);
          await Profile.destroy({ where: { userId: user.id } });
          console.log("profile deleted");
        } catch (err) {
          console.log("error in del profile");
        }
      },

      //end hooks
    },
    sequelize,
    timestamps: true,
    tableName: "users",
  }
);

User.hasOne(Profile, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Profile.belongsTo(User, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// User.hasMany(Contact,{
//     foreignKey:'userId'
// })

// Contact.belongsTo(User)

// User.hasOne(ProductReview , {
//   foreignKey: 'userId'
// })

// ProductReview.belongsTo(User,{
//   foreignKey: 'userId'
// })
