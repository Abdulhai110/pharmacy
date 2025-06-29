"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const app_bootstrap_1 = require("./src/bootstrap/app.bootstrap");
const express_1 = __importDefault(require("express"));
/* --------------------------
 * Application Configurations
 * -------------------------- */
exports.app = new app_bootstrap_1.App((0, express_1.default)());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGlFQUFvRDtBQUNwRCxzREFBOEI7QUFFOUI7O2dDQUVnQztBQUNuQixRQUFBLEdBQUcsR0FBRyxJQUFJLG1CQUFHLENBQUMsSUFBQSxpQkFBTyxHQUFFLENBQUMsQ0FBQyJ9