"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
var jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
var custom_errors_1 = require("../../errors/custom_errors");
var TOKEN_SECRET = process.env.TOKEN_SECRET;
var tokenSecret = String(TOKEN_SECRET);
var verifyToken = function (role) {
    return function (req, res, next) {
        try {
            var authorizationHeader = String(req.headers.authorization);
            var token = authorizationHeader.split(' ')[1];
            var payload = jsonwebtoken_1["default"].verify(token, tokenSecret);
            if (payload.role.name !== role)
                throw new custom_errors_1.InvalidAuthorizationError('Invalid role');
            next();
        }
        catch (error) {
            res.status(401);
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                res.json({ message: 'Token expired' });
            }
            else if (error instanceof custom_errors_1.InvalidAuthorizationError) {
                res.json({ message: 'You are not authorized to access this API' });
            }
            else {
                res.json({ message: 'Invalid token' });
            }
        }
    };
};
exports["default"] = verifyToken;
