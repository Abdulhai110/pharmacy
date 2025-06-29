"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanTaker = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../config/connection");
const enum_1 = require("../constants/enum");
const helper_1 = require("../helpers/helper");
const loan_1 = require("./loan");
const loanTransaction_1 = require("./loanTransaction");
class LoanTaker extends sequelize_1.Model {
}
exports.LoanTaker = LoanTaker;
LoanTaker.init({
    id: {
        type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING(100),
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    cnic: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    loanAmount: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    remainingAmount: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
    },
    paidAmount: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...(0, helper_1.enumKeys)(enum_1.StatusEnum)),
        defaultValue: enum_1.StatusEnum.Active,
    },
}, {
    sequelize: connection_1.sequelize,
    timestamps: true,
    tableName: "loan_takers",
});
LoanTaker.hasMany(loanTransaction_1.LoanTransaction, {
    foreignKey: "loanTakerId",
});
LoanTaker.hasMany(loan_1.Loan, {
    foreignKey: "loanTakerId",
});
// LoanTaker.belongsTo(Loan, { foreignKey: 'loanTakerId' });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hblRha2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZGVscy9sb2FuVGFrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUNBT21CO0FBQ25CLHFEQUFpRDtBQUNqRCw0Q0FBK0M7QUFDL0MsOENBQTZDO0FBQzdDLGlDQUE4QjtBQUM5Qix1REFBb0Q7QUFDcEQsTUFBYSxTQUFVLFNBQVEsaUJBRzlCO0NBWUE7QUFmRCw4QkFlQztBQUVELFNBQVMsQ0FBQyxJQUFJLENBQ1o7SUFDRSxFQUFFLEVBQUU7UUFDRixJQUFJLEVBQUUscUJBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUTtRQUMvQixVQUFVLEVBQUUsSUFBSTtRQUNoQixhQUFhLEVBQUUsSUFBSTtLQUNwQjtJQUNELElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxxQkFBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDMUIsU0FBUyxFQUFFLEtBQUs7S0FDakI7SUFDRCxXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUUscUJBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0tBQzVCO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLHFCQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUMxQixTQUFTLEVBQUUsSUFBSTtLQUNoQjtJQUNELElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxxQkFBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDMUIsU0FBUyxFQUFFLEtBQUs7S0FDakI7SUFDRCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUUscUJBQVMsQ0FBQyxPQUFPO1FBQ3ZCLFlBQVksRUFBRSxDQUFDO1FBQ2YsU0FBUyxFQUFFLEtBQUs7S0FDakI7SUFDRCxlQUFlLEVBQUU7UUFDZixJQUFJLEVBQUUscUJBQVMsQ0FBQyxPQUFPO1FBQ3ZCLFlBQVksRUFBRSxDQUFDO1FBQ2YsU0FBUyxFQUFFLElBQUk7S0FDaEI7SUFDRCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUUscUJBQVMsQ0FBQyxPQUFPO1FBQ3ZCLFlBQVksRUFBRSxDQUFDO1FBQ2YsU0FBUyxFQUFFLElBQUk7S0FDaEI7SUFDRCxNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUscUJBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFBLGlCQUFRLEVBQUMsaUJBQVUsQ0FBQyxDQUFDO1FBQzdDLFlBQVksRUFBRSxpQkFBVSxDQUFDLE1BQU07S0FDaEM7Q0FDRixFQUNEO0lBQ0UsU0FBUyxFQUFULHNCQUFTO0lBQ1QsVUFBVSxFQUFFLElBQUk7SUFDaEIsU0FBUyxFQUFFLGFBQWE7Q0FDekIsQ0FDRixDQUFDO0FBRUYsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBZSxFQUFFO0lBQ2pDLFVBQVUsRUFBRSxhQUFhO0NBQzFCLENBQUMsQ0FBQztBQUNILFNBQVMsQ0FBQyxPQUFPLENBQUMsV0FBSSxFQUFFO0lBQ3RCLFVBQVUsRUFBRSxhQUFhO0NBQzFCLENBQUMsQ0FBQztBQUVILDREQUE0RCJ9