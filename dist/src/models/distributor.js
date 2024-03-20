"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Distributor = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../config/connection");
const enum_1 = require("../constants/enum");
const helper_1 = require("../helpers/helper");
const DistributorCredit_1 = require("./DistributorCredit");
const DistributorDebit_1 = require("./DistributorDebit");
class Distributor extends sequelize_1.Model {
}
exports.Distributor = Distributor;
Distributor.init({
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
    phoneNo: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    companyName: {
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
    tableName: "distributors",
});
Distributor.hasMany(DistributorCredit_1.DistributorCredit, {
    foreignKey: "distributor_id",
});
Distributor.hasMany(DistributorDebit_1.DistributorDebit, {
    foreignKey: "distributor_id",
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzdHJpYnV0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kZWxzL2Rpc3RyaWJ1dG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlDQU9tQjtBQUNuQixxREFBaUQ7QUFDakQsNENBQStDO0FBQy9DLDhDQUE2QztBQUM3QywyREFBd0Q7QUFDeEQseURBQXNEO0FBQ3RELE1BQWEsV0FBWSxTQUFRLGlCQUdoQztDQVlBO0FBZkQsa0NBZUM7QUFFRCxXQUFXLENBQUMsSUFBSSxDQUNkO0lBQ0UsRUFBRSxFQUFFO1FBQ0YsSUFBSSxFQUFFLHFCQUFTLENBQUMsTUFBTSxDQUFDLFFBQVE7UUFDL0IsVUFBVSxFQUFFLElBQUk7UUFDaEIsYUFBYSxFQUFFLElBQUk7S0FDcEI7SUFDRCxJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUscUJBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQzFCLFNBQVMsRUFBRSxLQUFLO0tBQ2pCO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLHFCQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztLQUM1QjtJQUNELE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxxQkFBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDMUIsU0FBUyxFQUFFLElBQUk7S0FDaEI7SUFDRCxXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUUscUJBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQzFCLFNBQVMsRUFBRSxLQUFLO0tBQ2pCO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLHFCQUFTLENBQUMsT0FBTztRQUN2QixZQUFZLEVBQUUsQ0FBQztRQUNmLFNBQVMsRUFBRSxLQUFLO0tBQ2pCO0lBQ0QsZ0JBQWdCLEVBQUU7UUFDaEIsSUFBSSxFQUFFLHFCQUFTLENBQUMsT0FBTztRQUN2QixZQUFZLEVBQUUsQ0FBQztRQUNmLFNBQVMsRUFBRSxJQUFJO0tBQ2hCO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLHFCQUFTLENBQUMsT0FBTztRQUN2QixZQUFZLEVBQUUsQ0FBQztRQUNmLFNBQVMsRUFBRSxJQUFJO0tBQ2hCO0lBQ0QsTUFBTSxFQUFFO1FBQ04sSUFBSSxFQUFFLHFCQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBQSxpQkFBUSxFQUFDLGlCQUFVLENBQUMsQ0FBQztRQUM3QyxZQUFZLEVBQUUsaUJBQVUsQ0FBQyxNQUFNO0tBQ2hDO0lBQ0QsU0FBUyxFQUFFO1FBQ1QsSUFBSSxFQUFFLFdBQVc7UUFDakIsWUFBWSxFQUFFLHFCQUFTLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDO1FBQ3BELFNBQVMsRUFBRSxLQUFLO0tBQ2pCO0lBQ0QsU0FBUyxFQUFFO1FBQ1QsSUFBSSxFQUFFLFdBQVc7UUFDakIsWUFBWSxFQUFFLHFCQUFTLENBQUMsT0FBTyxDQUM3QiwrQ0FBK0MsQ0FDaEQ7UUFDRCxTQUFTLEVBQUUsS0FBSztLQUNqQjtDQUNGLEVBQ0Q7SUFDRSxTQUFTLEVBQVQsc0JBQVM7SUFDVCxVQUFVLEVBQUUsS0FBSztJQUNqQixTQUFTLEVBQUUsY0FBYztDQUMxQixDQUNGLENBQUM7QUFFRixXQUFXLENBQUMsT0FBTyxDQUFDLHFDQUFpQixFQUFFO0lBQ3JDLFVBQVUsRUFBRSxnQkFBZ0I7Q0FDN0IsQ0FBQyxDQUFDO0FBQ0gsV0FBVyxDQUFDLE9BQU8sQ0FBQyxtQ0FBZ0IsRUFBRTtJQUNwQyxVQUFVLEVBQUUsZ0JBQWdCO0NBQzdCLENBQUMsQ0FBQyJ9