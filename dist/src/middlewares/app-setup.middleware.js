"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSetupMiddleware = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("./middleware");
// import fileUpload from "express-fileupload";
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const winston_1 = __importDefault(require("winston"));
const express_winston_1 = __importDefault(require("express-winston"));
const fs_1 = __importDefault(require("fs"));
class AppSetupMiddleware extends middleware_1.Middleware {
    constructor(app) {
        super(app);
        this.app = app;
        this.httpLogs();
    }
    handle() {
        const publicdir = path_1.default.join(__dirname, "../public");
        this.app.use(this.responseMiddleware);
        // here we are adding middleware to parse all incoming requests as JSON
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        console.log(publicdir);
        this.app.use(express_1.default.static(publicdir));
        // here we are adding middleware to allow cross-origin requests
        this.app.use((0, cors_1.default)());
        this.app.use((0, morgan_1.default)("dev"));
        this.app.use((0, cookie_parser_1.default)());
        //    this.app.use(fileUpload({
        //         useTempFiles: true,
        //         tempFileDir: './tmp/'
        //    }));
    }
    responseMiddleware(req, res, next) {
        res.Success = (message, data, respCode) => {
            respCode = respCode ? respCode : 200;
            res.status(respCode).json({
                success: true,
                message,
                data,
            });
        };
        res.Error = (message, data, respCode) => {
            respCode = respCode ? respCode : 200;
            res.status(respCode).json({
                success: false,
                message,
                data,
            });
        };
        next();
    }
    httpLogs() {
        // Ensure the log folder exists
        const logFolder = path_1.default.join(__dirname, "log");
        if (!fs_1.default.existsSync(logFolder)) {
            fs_1.default.mkdirSync(logFolder);
        }
        // Create a logger for request logs
        const requestLogger = winston_1.default.createLogger({
            level: "info",
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
            transports: [
                new winston_1.default.transports.File({
                    filename: path_1.default.join(logFolder, "request.log"),
                }),
            ],
        });
        // Create a logger for error logs
        const errorLogger = winston_1.default.createLogger({
            level: "error",
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
            transports: [
                new winston_1.default.transports.File({
                    filename: path_1.default.join(logFolder, "error.log"),
                }),
            ],
        });
        // Configure the expressWinston logging middleware to log HTTP requests
        this.app.use(express_winston_1.default.logger({
            winstonInstance: requestLogger,
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.json()),
        }));
        // Configure the expressWinston error-logging middleware to log errors
        this.app.use(express_winston_1.default.errorLogger({
            winstonInstance: errorLogger,
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.json()),
        }));
    }
}
exports.AppSetupMiddleware = AppSetupMiddleware;
// import express, { NextFunction } from "express";
// import * as bodyparser from "body-parser";
// import { Middleware } from "./middleware";
// // import fileUpload from "express-fileupload";
// import cookieParser from "cookie-parser";
// import morgon from "morgan";
// import cors from "cors";
// import path from "path";
// import winston from "winston";
// import expressWinston from "express-winston";
// import fs from "fs";
// import { ResponseHandler } from "../utils/respHandler";
// export class AppSetupMiddleware extends Middleware {
//   app: express.Application;
//   constructor(app: express.Application) {
//     super(app);
//     this.app = app;
//     this.httpLogs();
//   }
//   handle() {
//     const publicdir = path.join(__dirname, "../public");
//     this.app.use(this.responseMiddleware);
//     // here we are adding middleware to parse all incoming requests as JSON
//     this.app.use(express.json());
//     this.app.use(express.urlencoded({ extended: false }));
//     console.log(publicdir);
//     this.app.use(express.static(publicdir));
//     // here we are adding middleware to allow cross-origin requests
//     this.app.use(cors());
//     this.app.use(morgon("dev"));
//     this.app.use(cookieParser());
//     //    this.app.use(fileUpload({
//     //         useTempFiles: true,
//     //         tempFileDir: './tmp/'
//     //    }));
//   }
//   // responseMiddleware(req: express.Request, res: express.Response, next: any) {
//   //   res.Success = (message: string, data?: any, respCode?: number) => {
//   //     respCode = respCode ? respCode : 200;
//   //     res.status(respCode).json({
//   //       success: true,
//   //       message,
//   //       data,
//   //     });
//   //   };
//   //   res.Error = (message: string, data?: any, respCode?: number) => {
//   //     respCode = respCode ? respCode : 200;
//   //     res.status(respCode).json({
//   //       success: false,
//   //       message,
//   //       data,
//   //     });
//   //   };
//   //   next();
//   // }
//   responseMiddleware(req: express.Request, res: express.Response, next: NextFunction) {
//     res.locals.success = (message: string, data?: any, statusCode?: number) =>
//       ResponseHandler.success(res, message, data, statusCode);
//     res.locals.error = (message: string, statusCode?: number, errors?: any) =>
//       ResponseHandler.error(res, message, statusCode, errors);
//     next();
//   }
//   httpLogs() {
//     // Ensure the log folder exists
//     const logFolder = path.join(__dirname, "log");
//     if (!fs.existsSync(logFolder)) {
//       fs.mkdirSync(logFolder);
//     }
//     // Create a logger for request logs
//     const requestLogger = winston.createLogger({
//       level: "info", // Set the log level to "info" to log HTTP requests
//       format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.json()
//       ),
//       transports: [
//         new winston.transports.File({
//           filename: path.join(logFolder, "request.log"),
//         }),
//       ],
//     });
//     // Create a logger for error logs
//     const errorLogger = winston.createLogger({
//       level: "error", // Set the log level to "error" to log errors
//       format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.json()
//       ),
//       transports: [
//         new winston.transports.File({
//           filename: path.join(logFolder, "error.log"),
//         }),
//       ],
//     });
//     // Configure the expressWinston logging middleware to log HTTP requests
//     this.app.use(
//       expressWinston.logger({
//         winstonInstance: requestLogger,
//         format: winston.format.combine(
//           winston.format.colorize(),
//           winston.format.json()
//         ),
//       })
//     );
//     // Configure the expressWinston error-logging middleware to log errors
//     this.app.use(
//       expressWinston.errorLogger({
//         winstonInstance: errorLogger,
//         format: winston.format.combine(
//           winston.format.colorize(),
//           winston.format.json()
//         ),
//       })
//     );
//   }
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXNldHVwLm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWlkZGxld2FyZXMvYXBwLXNldHVwLm1pZGRsZXdhcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsc0RBQWdEO0FBRWhELDZDQUEwQztBQUMxQywrQ0FBK0M7QUFDL0Msa0VBQXlDO0FBQ3pDLG9EQUE0QjtBQUM1QixnREFBd0I7QUFDeEIsZ0RBQXdCO0FBQ3hCLHNEQUE4QjtBQUM5QixzRUFBNkM7QUFDN0MsNENBQW9CO0FBRXBCLE1BQWEsa0JBQW1CLFNBQVEsdUJBQVU7SUFHaEQsWUFBWSxHQUF3QjtRQUNsQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBRUQsTUFBTTtRQUNKLE1BQU0sU0FBUyxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3RDLHVFQUF1RTtRQUN2RSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RELE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN4QywrREFBK0Q7UUFFL0QsSUFBSSxDQUFDLEdB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