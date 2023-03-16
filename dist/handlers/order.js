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
var order_1 = require("../models/order");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var token_verifier_1 = __importDefault(require("./middleware/token_verifier"));
var orderStore = new order_1.OrderStore();
var TOKEN_SECRET = process.env.TOKEN_SECRET;
var tokenSecret = String(TOKEN_SECRET);
var getUserId = function (req) {
    try {
        var authorizationHeader = String(req.headers.authorization);
        var token = authorizationHeader.split(' ')[1];
        var decoded = jsonwebtoken_1["default"].verify(token, tokenSecret);
        return decoded.id;
    }
    catch (error) {
        throw error;
    }
};
var findMyActiveOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, order, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = getUserId(req);
                return [4 /*yield*/, orderStore.findMyActiveOrder(userId)];
            case 1:
                order = _a.sent();
                res.json(order);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500);
                res.json(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var findMyCompletedOrders = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, orders, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = getUserId(req);
                return [4 /*yield*/, orderStore.findMyCompletedOrders(userId)];
            case 1:
                orders = _a.sent();
                res.json(orders);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500);
                res.json(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var addProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, dto, order, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = getUserId(req);
                dto = {
                    quantity: req.body.quantity,
                    order_id: Number(req.params.orderId),
                    product_id: req.body.productId
                };
                return [4 /*yield*/, orderStore.addProduct(userId, dto)];
            case 1:
                order = _a.sent();
                res.json(order);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500);
                res.json({ message: "".concat(error_3) });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var order_routes = function (app) {
    app.get('/api/v1/orders/active', (0, token_verifier_1["default"])('role_customer'), findMyActiveOrder);
    app.get('/api/v1/orders/completed', (0, token_verifier_1["default"])('role_customer'), findMyCompletedOrders);
    app.post('/api/v1/orders/:orderId/products', (0, token_verifier_1["default"])('role_customer'), addProduct);
};
exports["default"] = order_routes;
