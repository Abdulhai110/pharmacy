"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const helper_1 = require("../../helpers/helper");
const enum_1 = require("../../constants/enum");
const sequelize_2 = __importDefault(require("sequelize"));
module.exports = {
    up: (queryInterface) => {
        return queryInterface.createTable("users", {
            id: {
                type: sequelize_1.DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            firstName: {
                type: sequelize_1.DataTypes.STRING(50),
                validate: {
                    min: 5,
                    max: 16,
                },
            },
            lastName: {
                type: sequelize_1.DataTypes.STRING(50),
            },
            email: {
                type: sequelize_1.DataTypes.STRING(150),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            role: {
                type: sequelize_1.DataTypes.ENUM(...(0, helper_1.enumKeys)(enum_1.UserTypeEnum)),
                defaultValue: enum_1.UserTypeEnum.Admin,
                allowNull: false,
            },
            password: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: false,
            },
            ForgotpasswordToken: {
                type: sequelize_1.DataTypes.STRING(200),
                allowNull: true,
            },
            ForgotpasswordExpires: {
                type: sequelize_1.DataTypes.DATE,
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
        return queryInterface.dropTable("users");
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMjAyMzAzMTkwNzE0MjEtYWRkLXVzZXItdGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZGF0YWJhc2UvbWlncmF0aW9ucy8yMDIzMDMxOTA3MTQyMS1hZGQtdXNlci10YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlDQUFrRTtBQUNsRSxpREFBZ0Q7QUFDaEQsK0NBQW9EO0FBQ3BELDBEQUFrQztBQUNsQyxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsRUFBRSxFQUFFLENBQUMsY0FBOEIsRUFBRSxFQUFFO1FBQ3JDLE9BQU8sY0FBYyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUU7WUFDekMsRUFBRSxFQUFFO2dCQUNGLElBQUksRUFBRSxxQkFBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRO2dCQUMvQixVQUFVLEVBQUUsSUFBSTtnQkFDaEIsYUFBYSxFQUFFLElBQUk7YUFDcEI7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsSUFBSSxFQUFFLHFCQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztnQkFDMUIsUUFBUSxFQUFFO29CQUNSLEdBQUcsRUFBRSxDQUFDO29CQUNOLEdBQUcsRUFBRSxFQUFFO2lCQUNSO2FBQ0Y7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLHFCQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQzthQUMzQjtZQUVELEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUUscUJBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO2dCQUMzQixTQUFTLEVBQUUsS0FBSztnQkFDaEIsTUFBTSxFQUFFLElBQUk7Z0JBQ1osUUFBUSxFQUFFO29CQUNSLE9BQU8sRUFBRSxJQUFJO2lCQUNkO2FBQ0Y7WUFDRCxJQUFJLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLHFCQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBQSxpQkFBUSxFQUFDLG1CQUFZLENBQUMsQ0FBQztnQkFDL0MsWUFBWSxFQUFFLG1CQUFZLENBQUMsS0FBSztnQkFDaEMsU0FBUyxFQUFFLEtBQUs7YUFDakI7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLHFCQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztnQkFDM0IsU0FBUyxFQUFFLEtBQUs7YUFDakI7WUFFRCxtQkFBbUIsRUFBRTtnQkFDbkIsSUFBSSxFQUFFLHFCQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztnQkFDM0IsU0FBUyxFQUFFLElBQUk7YUFDaEI7WUFDRCxxQkFBcUIsRUFBRTtnQkFDckIsSUFBSSxFQUFFLHFCQUFTLENBQUMsSUFBSTtnQkFDcEIsU0FBUyxFQUFFLElBQUk7YUFDaEI7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsSUFBSSxFQUFFLG1CQUFTLENBQUMsSUFBSTtnQkFDcEIsWUFBWSxFQUFFLHFCQUFTLENBQUMsR0FBRztnQkFDM0IsU0FBUyxFQUFFLEtBQUs7YUFDakI7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsSUFBSSxFQUFFLG1CQUFTLENBQUMsSUFBSTtnQkFDcEIsWUFBWSxFQUFFLHFCQUFTLENBQUMsR0FBRztnQkFDM0IsU0FBUyxFQUFFLEtBQUs7YUFDakI7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0QsSUFBSSxFQUFFLENBQUMsY0FBOEIsRUFBRSxTQUFjLEVBQUUsRUFBRTtRQUN2RCxPQUFPLGNBQWMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDM0MsQ0FBQztDQUNGLENBQUMifQ==