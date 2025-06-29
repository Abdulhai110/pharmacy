"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loan = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../config/connection");
const enum_1 = require("../constants/enum");
const helper_1 = require("../helpers/helper");
class Loan extends sequelize_1.Model {
}
exports.Loan = Loan;
Loan.init({
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
        defaultValue: sequelize_1.Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    returnDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize_1.Sequelize.literal("CURRENT_TIMESTAMP"),
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
}, {
    sequelize: connection_1.sequelize,
    timestamps: true,
    tableName: "loans",
});
/* Loan.belongsTo(LoanTaker, {
  foreignKey: "loanTakerId",
  as: 'LoanTaker'
}); */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2RlbHMvbG9hbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5Q0FPbUI7QUFDbkIscURBQWlEO0FBQ2pELDRDQUFnRjtBQUNoRiw4Q0FBNkM7QUFFN0MsTUFBYSxJQUFLLFNBQVEsaUJBR3pCO0NBZUE7QUFsQkQsb0JBa0JDO0FBRUQsSUFBSSxDQUFDLElBQUksQ0FDUDtJQUNFLEVBQUUsRUFBRTtRQUNGLElBQUksRUFBRSxxQkFBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRO1FBQy9CLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLGFBQWEsRUFBRSxJQUFJO0tBQ3BCO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLHFCQUFTLENBQUMsTUFBTSxDQUFDLFFBQVE7UUFDL0IsU0FBUyxFQUFFLEtBQUs7S0FDakI7SUFDRCxJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUscUJBQVMsQ0FBQyxJQUFJO1FBQ3BCLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLFlBQVksRUFBRSxxQkFBUyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQztLQUNyRDtJQUNELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRSxxQkFBUyxDQUFDLElBQUk7UUFDcEIsU0FBUyxFQUFFLElBQUk7UUFDZixZQUFZLEVBQUUscUJBQVMsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUM7S0FDckQ7SUFDRCxlQUFlLEVBQUU7UUFDZixJQUFJLEVBQUUscUJBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUTtRQUMvQixTQUFTLEVBQUUsSUFBSTtLQUNoQjtJQUNELFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSxxQkFBUyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUEsaUJBQVEsRUFBQyxtQkFBWSxDQUFDLENBQUM7UUFDL0MsU0FBUyxFQUFFLEtBQUs7UUFDaEIsWUFBWSxFQUFFLG1CQUFZLENBQUMsS0FBSztLQUNqQztJQUNELE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxxQkFBUyxDQUFDLE9BQU87UUFDdkIsU0FBUyxFQUFFLEtBQUs7S0FDakI7SUFDRCxpQkFBaUIsRUFBRTtRQUNqQixJQUFJLEVBQUUscUJBQVMsQ0FBQyxPQUFPO1FBQ3ZCLFlBQVksRUFBRSxDQUFDO1FBQ2YsU0FBUyxFQUFFLElBQUk7S0FDaEI7SUFDRCxnQkFBZ0IsRUFBRTtRQUNoQixJQUFJLEVBQUUscUJBQVMsQ0FBQyxPQUFPO1FBQ3ZCLFlBQVksRUFBRSxDQUFDO1FBQ2YsU0FBUyxFQUFFLElBQUk7S0FDaEI7SUFDRCxNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUscUJBQVMsQ0FBQyxPQUFPO1FBQ3ZCLFNBQVMsRUFBRSxJQUFJO0tBQ2hCO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLHFCQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztLQUM1QjtJQUNELE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxxQkFBUyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUEsaUJBQVEsRUFBQyxpQkFBVSxDQUFDLENBQUM7UUFDN0MsWUFBWSxFQUFFLGlCQUFVLENBQUMsTUFBTTtLQUNoQztDQUNGLEVBQ0Q7SUFDRSxTQUFTLEVBQVQsc0JBQVM7SUFDVCxVQUFVLEVBQUUsSUFBSTtJQUNoQixTQUFTLEVBQUUsT0FBTztDQUNuQixDQUNGLENBQUM7QUFHRjs7O01BR00ifQ==