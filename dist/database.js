"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var pg_1 = require("pg");
var dotenv_1 = __importDefault(require("dotenv"));
var client = new pg_1.Pool({});
dotenv_1["default"].config();
var _a = process.env, POSTGRES_HOST = _a.POSTGRES_HOST, POSTGRES_PORT = _a.POSTGRES_PORT, POSTGRES_DB = _a.POSTGRES_DB, POSTGRES_TEST_DB = _a.POSTGRES_TEST_DB, POSTGRES_USER = _a.POSTGRES_USER, POSTGRES_PASSWORD = _a.POSTGRES_PASSWORD, NODE_ENV = _a.NODE_ENV;
if (NODE_ENV === 'test') {
    client = new pg_1.Pool({
        host: POSTGRES_HOST,
        port: Number(POSTGRES_PORT),
        database: POSTGRES_TEST_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD
    });
}
if (NODE_ENV === 'dev') {
    client = new pg_1.Pool({
        host: POSTGRES_HOST,
        port: Number(POSTGRES_PORT),
        database: POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD
    });
}
exports["default"] = client;
