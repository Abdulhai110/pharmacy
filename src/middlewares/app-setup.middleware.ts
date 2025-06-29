import express, { NextFunction } from "express";
import * as bodyparser from "body-parser";
import { Middleware } from "./middleware";
// import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import morgon from "morgan";
import cors from "cors";
import path from "path";
import winston from "winston";
import expressWinston from "express-winston";
import fs from "fs";

export class AppSetupMiddleware extends Middleware {
  app: express.Application;

  constructor(app: express.Application) {
    super(app);
    this.app = app;
    this.httpLogs();
  }

  handle() {
    const publicdir = path.join(__dirname, "../public");
    this.app.use(this.responseMiddleware);
    // here we are adding middleware to parse all incoming requests as JSON
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    console.log(publicdir);
    this.app.use(express.static(publicdir));
    // here we are adding middleware to allow cross-origin requests

    this.app.use(cors());
    this.app.use(morgon("dev"));
    this.app.use(cookieParser());

    //    this.app.use(fileUpload({
    //         useTempFiles: true,
    //         tempFileDir: './tmp/'
    //    }));
  }

  responseMiddleware(req: express.Request, res: express.Response, next: any) {
    res.Success = (message: string, data?: any, respCode?: number) => {
      respCode = respCode ? respCode : 200;
      res.status(respCode).json({
        success: true,
        message,
        data,
      });
    };

    res.Error = (message: string, data?: any, respCode?: number) => {
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
    const logFolder = path.join(__dirname, "log");
    if (!fs.existsSync(logFolder)) {
      fs.mkdirSync(logFolder);
    }

    // Create a logger for request logs
    const requestLogger = winston.createLogger({
      level: "info", // Set the log level to "info" to log HTTP requests
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({
          filename: path.join(logFolder, "request.log"),
        }),
      ],
    });

    // Create a logger for error logs
    const errorLogger = winston.createLogger({
      level: "error", // Set the log level to "error" to log errors
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({
          filename: path.join(logFolder, "error.log"),
        }),
      ],
    });

    // Configure the expressWinston logging middleware to log HTTP requests
    this.app.use(
      expressWinston.logger({
        winstonInstance: requestLogger,
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.json()
        ),
      })
    );

    // Configure the expressWinston error-logging middleware to log errors
    this.app.use(
      expressWinston.errorLogger({
        winstonInstance: errorLogger,
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.json()
        ),
      })
    );
  }
}


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
