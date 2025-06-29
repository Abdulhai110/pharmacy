import { QueryInterface, DataTypes, QueryTypes } from "sequelize";
import { enumKeys } from "../../helpers/helper";
import { UserTypeEnum } from "../../constants/enum";
import Sequelize from "sequelize";
module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("users", {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING(50),
        validate: {
          min: 5,
          max: 16,
        },
      },
      lastName: {
        type: DataTypes.STRING(50),
      },

      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      role: {
        type: DataTypes.ENUM(...enumKeys(UserTypeEnum)),
        defaultValue: UserTypeEnum.Admin,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      ForgotpasswordToken: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      ForgotpasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    });
  },
  down: (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.dropTable("users");
  },
};
