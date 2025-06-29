import { Model, InferAttributes, InferCreationAttributes } from "sequelize";
import { StatusEnum } from "../constants/enum";
export declare class Distributor extends Model<InferAttributes<Distributor>, InferCreationAttributes<Distributor>> {
    id: number | null;
    name: string;
    companyName: string;
    phoneNo: string;
    description: string;
    loanAmount?: number;
    remainingAmount?: number;
    paidAmount?: number;
    status: StatusEnum;
    createdAt?: Date;
    updatedAt?: Date;
}
