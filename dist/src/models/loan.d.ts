import { Model, InferAttributes, InferCreationAttributes } from "sequelize";
import { StatusEnum } from "../constants/enum";
export declare class Loan extends Model<InferAttributes<Loan>, InferCreationAttributes<Loan>> {
    id: number | null;
    loanTakerId: number;
    loanType: string;
    description: string;
    amount: number;
    billNo: number;
    date?: Date;
    returnDate?: Date;
    paymentSourceId: number;
    installmentAmount?: number;
    installmentCount?: number;
    status: StatusEnum;
    createdAt?: Date;
    updatedAt?: Date;
}
