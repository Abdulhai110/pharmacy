"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("sequelize"));
const enum_1 = require("../../constants/enum");
const helper_1 = require("../../helpers/helper");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.createTable("loans", {
            id: {
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            loanTakerId: {
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            date: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW
            },
            returnDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
                defaultValue: sequelize_1.DataTypes.NOW
            },
            paymentSourceId: {
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
            },
            loanType: {
                type: sequelize_1.DataTypes.ENUM(...(0, helper_1.enumKeys)(enum_1.LoanTypeEnum)),
                allowNull: false,
                defaultValue: enum_1.LoanTypeEnum.money,
            },
            amount: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            installmentAmount: {
                type: sequelize_1.DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: true,
            },
            installmentCount: {
                type: sequelize_1.DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: true,
            },
            billNo: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            description: {
                type: sequelize_1.DataTypes.STRING(100),
            },
            status: {
                type: sequelize_1.DataTypes.ENUM(...(0, helper_1.enumKeys)(enum_1.StatusEnum)),
                defaultValue: enum_1.StatusEnum.Active,
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
    down: (queryInterface) => {
        return queryInterface.dropTable("loans");
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMjAyMzA3MjUwNjU1MjQtYWRkLWxvYW4tdGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZGF0YWJhc2UvbWlncmF0aW9ucy8yMDIzMDcyNTA2NTUyNC1hZGQtbG9hbi10YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlDQUFrRTtBQUNsRSwwREFBa0M7QUFDbEMsK0NBQWdFO0FBQ2hFLGlEQUFnRDtBQUNoRCxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsRUFBRSxFQUFFLENBQUMsY0FBOEIsRUFBRSxFQUFFO1FBQ3JDLE9BQU8sY0FBYyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUU7WUFDekMsRUFBRSxFQUFFO2dCQUNGLElBQUksRUFBRSxxQkFBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRO2dCQUMvQixVQUFVLEVBQUUsSUFBSTtnQkFDaEIsYUFBYSxFQUFFLElBQUk7YUFDcEI7WUFDRCxXQUFXLEVBQUU7Z0JBQ1gsSUFBSSxFQUFFLHFCQUFTLENBQUMsTUFBTSxDQUFDLFFBQVE7Z0JBQy9CLFNBQVMsRUFBRSxLQUFLO2FBQ2pCO1lBQ0QsSUFBSSxFQUFFO2dCQUNKLElBQUksRUFBRSxxQkFBUyxDQUFDLElBQUk7Z0JBQ3BCLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixZQUFZLEVBQUUscUJBQVMsQ0FBQyxHQUFHO2FBQzVCO1lBQ0QsVUFBVSxFQUFFO2dCQUNWLElBQUksRUFBRSxxQkFBUyxDQUFDLElBQUk7Z0JBQ3BCLFNBQVMsRUFBRSxJQUFJO2dCQUNmLFlBQVksRUFBRSxxQkFBUyxDQUFDLEdBQUc7YUFDNUI7WUFDRCxlQUFlLEVBQUU7Z0JBQ2YsSUFBSSxFQUFFLHFCQUFTLENBQUMsTUFBTSxDQUFDLFFBQVE7Z0JBQy9CLFNBQVMsRUFBRSxJQUFJO2FBQ2hCO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLElBQUksRUFBRSxxQkFBUyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUEsaUJBQVEsRUFBQyxtQkFBWSxDQUFDLENBQUM7Z0JBQy9DLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixZQUFZLEVBQUUsbUJBQVksQ0FBQyxLQUFLO2FBQ2pDO1lBQ0QsTUFBTSxFQUFFO2dCQUNOLElBQUksRUFBRSxxQkFBUyxDQUFDLE9BQU87Z0JBQ3ZCLFNBQVMsRUFBRSxLQUFLO2FBQ2pCO1lBQ0QsaUJBQWlCLEVBQUU7Z0JBQ2pCLElBQUksRUFBRSxxQkFBUyxDQUFDLE9BQU87Z0JBQ3ZCLFlBQVksRUFBRSxDQUFDO2dCQUNmLFNBQVMsRUFBRSxJQUFJO2FBQ2hCO1lBQ0QsZ0JBQWdCLEVBQUU7Z0JBQ2hCLElBQUksRUFBRSxxQkFBUyxDQUFDLE9BQU87Z0JBQ3ZCLFlBQVksRUFBRSxDQUFDO2dCQUNmLFNBQVMsRUFBRSxJQUFJO2FBQ2hCO1lBQ0QsTUFBTSxFQUFFO2dCQUNOLElBQUksRUFBRSxxQkFBUyxDQUFDLE9BQU87Z0JBQ3ZCLFNBQVMsRUFBRSxJQUFJO2FBQ2hCO1lBQ0QsV0FBVyxFQUFFO2dCQUNYLElBQUksRUFBRSxxQkFBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDNUI7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sSUFBSSxFQUFFLHFCQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBQSxpQkFBUSxFQUFDLGlCQUFVLENBQUMsQ0FBQztnQkFDN0MsWUFBWSxFQUFFLGlCQUFVLENBQUMsTUFBTTthQUNoQztZQUNELFNBQVMsRUFBRTtnQkFDVCxJQUFJLEVBQUUsbUJBQVMsQ0FBQyxJQUFJO2dCQUNwQixZQUFZLEVBQUUscUJBQVMsQ0FBQyxHQUFHO2dCQUMzQixTQUFTLEVBQUUsS0FBSzthQUNqQjtZQUNELFNBQVMsRUFBRTtnQkFDVCxJQUFJLEVBQUUsbUJBQVMsQ0FBQyxJQUFJO2dCQUNwQixZQUFZLEVBQUUscUJBQVMsQ0FBQyxHQUFHO2dCQUMzQixTQUFTLEVBQUUsS0FBSzthQUNqQjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDRCxJQUFJLEVBQUUsQ0FBQyxjQUE4QixFQUFFLEVBQUU7UUFDdkMsT0FBTyxjQUFjLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzNDLENBQUM7Q0FDRixDQUFDIn0=