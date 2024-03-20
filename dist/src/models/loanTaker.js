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
    phone_number: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    cnic: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    loan_amount: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    remaining_amount: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
    },
    paid_amount: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...(0, helper_1.enumKeys)(enum_1.StatusEnum)),
        defaultValue: enum_1.StatusEnum.Active,
    },
    createdAt: {
        type: "TIMESTAMP",
        defaultValue: sequelize_1.Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
    },
    updatedAt: {
        type: "TIMESTAMP",
        defaultValue: sequelize_1.Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
        allowNull: false,
    },
}, {
    sequelize: connection_1.sequelize,
    timestamps: false,
    tableName: "loan_takers",
});
LoanTaker.hasMany(loanTransaction_1.LoanTransaction, {
    foreignKey: "loan_taker_id",
});
LoanTaker.hasMany(loan_1.Loan, {
    foreignKey: "loan_taker_id",
});
// LoanTaker.belongsTo(Loan, { foreignKey: 'loan_taker_id' });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hblRha2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZGVscy9sb2FuVGFrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUNBT21CO0FBQ25CLHFEQUFpRDtBQUNqRCw0Q0FBK0M7QUFDL0MsOENBQTZDO0FBQzdDLGlDQUE4QjtBQUM5Qix1REFBb0Q7QUFDcEQsTUFBYSxTQUFVLFNBQVEsaUJBRzlCO0NBWUE7QUFmRCw4QkFlQztBQUVELFNBQVMsQ0FBQyxJQUFJLENBQ1o7SUFDRSxFQUFFLEVBQUU7UUFDRixJQUFJLEVBQUUscUJBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUTtRQUMvQixVQUFVLEVBQUUsSUFBSTtRQUNoQixhQUFhLEVBQUUsSUFBSTtLQUNwQjtJQUNELElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxxQkFBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDMUIsU0FBUyxFQUFFLEtBQUs7S0FDakI7SUFDRCxXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUUscUJBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0tBQzVCO0lBQ0QsWUFBWSxFQUFFO1FBQ1osSUFBSSxFQUFFLHFCQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUMxQixTQUFTLEVBQUUsSUFBSTtLQUNoQjtJQUNELElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxxQkFBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDMUIsU0FBUyxFQUFFLEtBQUs7S0FDakI7SUFDRCxXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUUscUJBQVMsQ0FBQyxPQUFPO1FBQ3ZCLFlBQVksRUFBRSxDQUFDO1FBQ2YsU0FBUyxFQUFFLEtBQUs7S0FDakI7SUFDRCxnQkFBZ0IsRUFBRTtRQUNoQixJQUFJLEVBQUUscUJBQVMsQ0FBQyxPQUFPO1FBQ3ZCLFlBQVksRUFBRSxDQUFDO1FBQ2YsU0FBUyxFQUFFLElBQUk7S0FDaEI7SUFDRCxXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUUscUJBQVMsQ0FBQyxPQUFPO1FBQ3ZCLFlBQVksRUFBRSxDQUFDO1FBQ2YsU0FBUyxFQUFFLElBQUk7S0FDaEI7SUFDRCxNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUscUJBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFBLGlCQUFRLEVBQUMsaUJBQVUsQ0FBQyxDQUFDO1FBQzdDLFlBQVksRUFBRSxpQkFBVSxDQUFDLE1BQU07S0FDaEM7SUFDRCxTQUFTLEVBQUU7UUFDVCxJQUFJLEVBQUUsV0FBVztRQUNqQixZQUFZLEVBQUUscUJBQVMsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUM7UUFDcEQsU0FBUyxFQUFFLEtBQUs7S0FDakI7SUFDRCxTQUFTLEVBQUU7UUFDVCxJQUFJLEVBQUUsV0FBVztRQUNqQixZQUFZLEVBQUUscUJBQVMsQ0FBQyxPQUFPLENBQzdCLCtDQUErQyxDQUNoRDtRQUNELFNBQVMsRUFBRSxLQUFLO0tBQ2pCO0NBQ0YsRUFDRDtJQUNFLFNBQVMsRUFBVCxzQkFBUztJQUNULFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFNBQVMsRUFBRSxhQUFhO0NBQ3pCLENBQ0YsQ0FBQztBQUVGLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQWUsRUFBRTtJQUNqQyxVQUFVLEVBQUUsZUFBZTtDQUM1QixDQUFDLENBQUM7QUFDSCxTQUFTLENBQUMsT0FBTyxDQUFDLFdBQUksRUFBRTtJQUN0QixVQUFVLEVBQUUsZUFBZTtDQUM1QixDQUFDLENBQUM7QUFFSCw4REFBOEQifQ==