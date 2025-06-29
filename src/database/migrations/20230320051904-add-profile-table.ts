import { User } from "../../models/user";
import { QueryInterface, DataTypes, QueryTypes } from "sequelize";
import Sequelize from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("profiles", {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        allowNull: false,
        type: DataTypes.BIGINT.UNSIGNED,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
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
    return queryInterface.dropTable("profiles");
  },
};
