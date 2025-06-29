"use strict";
// import express, { NextFunction } from 'express';
// import { Middleware, callback } from './middleware';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import { User } from '../models/user';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const middleware_1 = require("./middleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
class AuthMiddleware extends middleware_1.Middleware {
    constructor(app) {
        super(app);
    }
    handle(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log("hii auth middleware");
            const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) || (typeof req.headers['authorization'] === 'string' ? req.headers['authorization'].replace('Bearer ', '') : '');
            if (!token) {
                return res.status(401).json({ message: "You are not a valid user" });
            }
            try {
                const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                const user = yield user_1.User.findByPk(decode.id, {
                    attributes: ['id', 'firstName', 'email', 'role']
                });
                if (!user) {
                    return res.status(401).json({ message: "You are not a valid user" });
                }
                req.user = user; // Ensure req.user exists in your type definition
                next(); // Proceed to the next middleware
            }
            catch (err) {
                console.error("Error in authentication:", err);
                return res.status(401).json({ message: "Error in authentication" });
            }
        });
    }
}
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC1taWRkbGV3YXJlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9taWRkbGV3YXJlcy9hdXRoLW1pZGRsZXdhcmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtREFBbUQ7QUFDbkQsdURBQXVEO0FBQ3ZELGtEQUFrRDtBQUNsRCx5Q0FBeUM7Ozs7Ozs7Ozs7Ozs7OztBQStCekMsNkNBQTBDO0FBQzFDLGdFQUErQztBQUMvQyx5Q0FBc0M7QUFFdEMsTUFBYSxjQUFlLFNBQVEsdUJBQVU7SUFDMUMsWUFBWSxHQUF3QjtRQUNoQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZixDQUFDO0lBRUssTUFBTSxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7OztZQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFFbkMsTUFBTSxLQUFLLEdBQUcsQ0FBQSxNQUFBLEdBQUcsQ0FBQyxPQUFPLDBDQUFFLEtBQUssS0FBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFbEosSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDUixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLDBCQUEwQixFQUFFLENBQUMsQ0FBQzthQUN4RTtZQUVELElBQUk7Z0JBQ0EsTUFBTSxNQUFNLEdBQUcsc0JBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBb0IsQ0FBZSxDQUFDO2dCQUNqRixNQUFNLElBQUksR0FBRyxNQUFNLFdBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRTtvQkFDeEMsVUFBVSxFQUFFLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDO2lCQUNuRCxDQUFDLENBQUM7Z0JBRUgsSUFBSSxDQUFDLElBQUksRUFBRTtvQkFDUCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLDBCQUEwQixFQUFFLENBQUMsQ0FBQztpQkFDeEU7Z0JBRUQsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxpREFBaUQ7Z0JBQ2xFLElBQUksRUFBRSxDQUFDLENBQUMsaUNBQWlDO2FBQzVDO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQywwQkFBMEIsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDL0MsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxDQUFDLENBQUM7YUFDdkU7O0tBQ0o7Q0FDSjtBQS9CRCx3Q0ErQkMifQ==