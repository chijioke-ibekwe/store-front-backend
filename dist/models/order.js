"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.OrderStore = exports.OrderStatus = void 0;
var database_1 = __importDefault(require("../database"));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus[OrderStatus["ACTIVE"] = 0] = "ACTIVE";
    OrderStatus[OrderStatus["COMPLETED"] = 1] = "COMPLETED";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
var OrderStore = /** @class */ (function () {
    function OrderStore() {
    }
    OrderStore.prototype.findMyActiveOrder = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql_one, result_one, newOrder, sql_two_1, result_two_1, order, sql_two, result_two, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql_one = 'SELECT * FROM orders WHERE status = ($1) AND user_id = ($2)';
                        return [4 /*yield*/, conn.query(sql_one, ['ACTIVE', userId])];
                    case 2:
                        result_one = _a.sent();
                        if (!(result_one.rowCount === 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.save(userId)];
                    case 3:
                        newOrder = _a.sent();
                        sql_two_1 = 'SELECT p.id, op.quantity FROM products p JOIN orders_products op ON p.id = op.product_id WHERE op.order_id = ($1)';
                        return [4 /*yield*/, conn.query(sql_two_1, [newOrder.id])];
                    case 4:
                        result_two_1 = _a.sent();
                        newOrder.products = result_two_1.rows;
                        conn.release();
                        return [2 /*return*/, newOrder];
                    case 5:
                        order = result_one.rows[0];
                        sql_two = 'SELECT p.id, op.quantity FROM products p JOIN orders_products op ON p.id = op.product_id WHERE op.order_id = ($1)';
                        return [4 /*yield*/, conn.query(sql_two, [order.id])];
                    case 6:
                        result_two = _a.sent();
                        order.products = result_two.rows;
                        conn.release();
                        return [2 /*return*/, order];
                    case 7:
                        error_1 = _a.sent();
                        throw new Error("Cannot find your active order: ".concat(error_1));
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    OrderStore.prototype.addProduct = function (userId, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, order, error_2, conn, sql_one, sql_two, result_two, order, sql_three, result_three, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql = 'SELECT * FROM orders WHERE id = ($1) AND user_id = ($2)';
                        return [4 /*yield*/, conn.query(sql, [dto.order_id, userId])];
                    case 2:
                        result = _a.sent();
                        if (result.rowCount === 0) {
                            throw new Error("Order not found");
                        }
                        order = result.rows[0];
                        if (order.status != 'ACTIVE') {
                            throw new Error("Order with id ".concat(dto.order_id, " is not active"));
                        }
                        conn.release();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        throw error_2;
                    case 4:
                        _a.trys.push([4, 9, , 10]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 5:
                        conn = _a.sent();
                        sql_one = 'INSERT INTO orders_products (quantity, order_id, product_id) VALUES ($1, $2, $3)';
                        return [4 /*yield*/, conn.query(sql_one, [dto.quantity, dto.order_id, dto.product_id])];
                    case 6:
                        _a.sent();
                        sql_two = 'SELECT * FROM orders WHERE id = ($1)';
                        return [4 /*yield*/, conn.query(sql_two, [dto.order_id])];
                    case 7:
                        result_two = _a.sent();
                        order = result_two.rows[0];
                        sql_three = 'SELECT p.id, op.quantity FROM products p JOIN orders_products op ON p.id = op.product_id WHERE op.order_id = ($1)';
                        return [4 /*yield*/, conn.query(sql_three, [order.id])];
                    case 8:
                        result_three = _a.sent();
                        order.products = result_three.rows;
                        conn.release();
                        return [2 /*return*/, order];
                    case 9:
                        error_3 = _a.sent();
                        throw new Error("Cannot add product with id ".concat(dto.product_id, " to order with id ").concat(dto.order_id, ": ").concat(error_3));
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    OrderStore.prototype.findMyCompletedOrders = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql_one, result_one, orders, i, sql_two, result_two, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql_one = 'SELECT * FROM orders WHERE status = ($1) AND user_id = ($2)';
                        return [4 /*yield*/, conn.query(sql_one, ['COMPLETED', userId])];
                    case 2:
                        result_one = _a.sent();
                        orders = result_one.rows;
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < orders.length)) return [3 /*break*/, 6];
                        sql_two = 'SELECT p.id, op.quantity FROM products p JOIN orders_products op ON p.id = op.product_id WHERE op.order_id = ($1)';
                        return [4 /*yield*/, conn.query(sql_two, [orders[i].id])];
                    case 4:
                        result_two = _a.sent();
                        orders[i].products = result_two.rows;
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6:
                        conn.release();
                        return [2 /*return*/, orders];
                    case 7:
                        error_4 = _a.sent();
                        throw new Error("Cannot fetch your completed orders: ".concat(error_4));
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    OrderStore.prototype.save = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql = 'INSERT INTO orders (status, user_id) VALUES ($1, $2) RETURNING *';
                        return [4 /*yield*/, conn.query(sql, ['ACTIVE', userId])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        return [2 /*return*/, result.rows[0]];
                    case 3:
                        error_5 = _a.sent();
                        throw new Error("Cannot add order: ".concat(error_5));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return OrderStore;
}());
exports.OrderStore = OrderStore;
