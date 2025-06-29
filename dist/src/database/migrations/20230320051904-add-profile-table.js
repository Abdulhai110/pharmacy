"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("sequelize"));
module.exports = {
    up: (queryInterface) => {
        return queryInterface.createTable("profiles", {
            id: {
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                allowNull: false,
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
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
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: true,
            },
            createdAt: {
                type: sequelize_2.default.DATE,
                defaultValue: sequelize_1.DataTypes.NOW,
                allowNull: false,
            },
            updatedAt: {
                type: sequelize_2.default.DATE,
                defaultValue: sequelize_1.DataTypes.NOW,
                allowNull: false,
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("profiles");
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMjAyMzAzMjAwNTE5MDQtYWRkLXByb2ZpbGUtdGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZGF0YWJhc2UvbWlncmF0aW9ucy8yMDIzMDMyMDA1MTkwNC1hZGQtcHJvZmlsZS10YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLHlDQUFrRTtBQUNsRSwwREFBa0M7QUFFbEMsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNmLEVBQUUsRUFBRSxDQUFDLGNBQThCLEVBQUUsRUFBRTtRQUNyQyxPQUFPLGNBQWMsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFO1lBQzVDLEVBQUUsRUFBRTtnQkFDRixJQUFJLEVBQUUscUJBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUTtnQkFDL0IsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLGFBQWEsRUFBRSxJQUFJO2FBQ3BCO1lBQ0QsTUFBTSxFQUFFO2dCQUNOLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixJQUFJLEVBQUUscUJBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUTtnQkFDL0IsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO2dCQUN6QyxRQUFRLEVBQUUsU0FBUzthQUNwQjtZQUNELGNBQWM7WUFDZCw0QkFBNEI7WUFDNUIscUJBQXFCO1lBQ3JCLEtBQUs7WUFDTCxzQkFBc0I7WUFDdEIsNEJBQTRCO1lBQzVCLHFCQUFxQjtZQUNyQixLQUFLO1lBQ0wsT0FBTyxFQUFFO2dCQUNQLElBQUksRUFBRSxxQkFBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7Z0JBQzFCLFNBQVMsRUFBRSxJQUFJO2FBQ2hCO1lBQ0QsU0FBUyxFQUFFO2dCQUNULElBQUksRUFBRSxtQkFBUyxDQUFDLElBQUk7Z0JBQ3BCLFlBQVksRUFBRSxxQkFBUyxDQUFDLEdBQUc7Z0JBQzNCLFNBQVMsRUFBRSxLQUFLO2FBQ2pCO1lBQ0QsU0FBUyxFQUFFO2dCQUNULElBQUksRUFBRSxtQkFBUyxDQUFDLElBQUk7Z0JBQ3BCLFlBQVksRUFBRSxxQkFBUyxDQUFDLEdBQUc7Z0JBQzNCLFNBQVMsRUFBRSxLQUFLO2FBQ2pCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNELElBQUksRUFBRSxDQUFDLGNBQThCLEVBQUUsU0FBYyxFQUFFLEVBQUU7UUFDdkQsT0FBTyxjQUFjLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7Q0FDRixDQUFDIn0=