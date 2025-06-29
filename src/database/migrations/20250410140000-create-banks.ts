import { QueryInterface, DataTypes } from 'sequelize';
import { StatusEnum } from '../../constants/enum';
import { enumKeys } from '../../helpers/helper';
import Sequelize from "sequelize";

export = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('banks', {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
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
      },
      website: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...enumKeys(StatusEnum)),
        defaultValue: StatusEnum.Active,
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

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('banks');
  },
};