import { Model, InferAttributes, InferCreationAttributes } from "sequelize";
import { StatusEnum } from "../constants/enum";
export declare class LoanTaker extends Model<InferAttributes<LoanTaker>, InferCreationAttributes<LoanTaker>> {
    id: number | null;
    name: string;
    phoneNumber: string;
    cnic: string;
    description: string;
    loanAmount?: number;
    remainingAmount?: number;
    paidAmount?: number;
    status: StatusEnum;
    createdAt?: Date;
    updatedAt?: Date;
}
