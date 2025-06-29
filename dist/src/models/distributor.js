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
    loanAmount: {
        type: sequelize_1.DataTypes.BIGINT,
        defaultValue: 0,
        allowNull: false,
    },
    remainingAmount: {
        type: sequelize_1.DataTypes.BIGINT,
        defaultValue: 0,
        allowNull: true,
    },
    paidAmount: {
        type: sequelize_1.DataTypes.BIGINT,
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
    tableName: "distributors",
});
Distributor.hasMany(DistributorCredit_1.DistributorCredit, {
    foreignKey: "distributorId",
});
Distributor.hasMany(DistributorDebit_1.DistributorDebit, {
    foreignKey: "distributorId",
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzdHJpYnV0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kZWxzL2Rpc3RyaWJ1dG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlDQU9tQjtBQUNuQixxREFBaUQ7QUFDakQsNENBQStDO0FBQy9DLDhDQUE2QztBQUM3QywyREFBd0Q7QUFDeEQseURBQXNEO0FBQ3RELE1BQWEsV0FBWSxTQUFRLGlCQUdoQztDQVlBO0FBZkQsa0NBZUM7QUFFRCxXQUFXLENBQUMsSUFBSSxDQUNkO0lBQ0UsRUFBRSxFQUFFO1FBQ0YsSUFBSSxFQUFFLHFCQUFTLENBQUMsTUFBTSxDQUFDLFFBQVE7UUFDL0IsVUFBVSxFQUFFLElBQUk7UUFDaEIsYUFBYSxFQUFFLElBQUk7S0FDcEI7SUFDRCxJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUscUJBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQzFCLFNBQVMsRUFBRSxLQUFLO0tBQ2pCO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLHFCQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztLQUM1QjtJQUNELE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxxQkFBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDMUIsU0FBUyxFQUFFLElBQUk7S0FDaEI7SUFDRCxXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUUscUJBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQzFCLFNBQVMsRUFBRSxLQUFLO0tBQ2pCO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFLHFCQUFTLENBQUMsTUFBTTtRQUN0QixZQUFZLEVBQUUsQ0FBQztRQUNmLFNBQVMsRUFBRSxLQUFLO0tBQ2pCO0lBQ0QsZUFBZSxFQUFFO1FBQ2YsSUFBSSxFQUFFLHFCQUFTLENBQUMsTUFBTTtRQUN0QixZQUFZLEVBQUUsQ0FBQztRQUNmLFNBQVMsRUFBRSxJQUFJO0tBQ2hCO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFLHFCQUFTLENBQUMsTUFBTTtRQUN0QixZQUFZLEVBQUUsQ0FBQztRQUNmLFNBQVMsRUFBRSxJQUFJO0tBQ2hCO0lBQ0QsTUFBTSxFQUFFO1FBQ04sSUFBSSxFQUFFLHFCQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBQSxpQkFBUSxFQUFDLGlCQUFVLENBQUMsQ0FBQztRQUM3QyxZQUFZLEVBQUUsaUJBQVUsQ0FBQyxNQUFNO0tBQ2hDO0NBRUYsRUFDRDtJQUNFLFNBQVMsRUFBVCxzQkFBUztJQUNULFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFNBQVMsRUFBRSxjQUFjO0NBQzFCLENBQ0YsQ0FBQztBQUVGLFdBQVcsQ0FBQyxPQUFPLENBQUMscUNBQWlCLEVBQUU7SUFDckMsVUFBVSxFQUFFLGVBQWU7Q0FDNUIsQ0FBQyxDQUFDO0FBQ0gsV0FBVyxDQUFDLE9BQU8sQ0FBQyxtQ0FBZ0IsRUFBRTtJQUNwQyxVQUFVLEVBQUUsZUFBZTtDQUM1QixDQUFDLENBQUMifQ==