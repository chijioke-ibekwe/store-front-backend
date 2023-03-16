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
var product_1 = require("../models/product");
var token_verifier_1 = __importDefault(require("./middleware/token_verifier"));
var productStore = new product_1.ProductStore();
var index = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var category, products, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                category = req.query.category;
                console.log(category);
                products = void 0;
                if (!(category === undefined || category === null)) return [3 /*break*/, 2];
                return [4 /*yield*/, productStore.findAll()];
            case 1:
                products = _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, productStore.findByCategory(category)];
            case 3:
                products = _a.sent();
                _a.label = 4;
            case 4:
                res.json(products);
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                res.status(500);
                res.json(error_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
var show = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var productId, product, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                productId = Number(req.params.productId);
                return [4 /*yield*/, productStore.findById(productId)];
            case 1:
                product = _a.sent();
                res.json(product);
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
var create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, savedProduct, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                product = {
                    name: req.body.name,
                    price: req.body.price,
                    category: req.body.category
                };
                return [4 /*yield*/, productStore.save(product)];
            case 1:
                savedProduct = _a.sent();
                res.json(savedProduct);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500);
                res.json(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var product_routes = function (app) {
    app.get('/api/v1/products', index);
    app.get('/api/v1/products/:productId', show);
    app.post('/api/v1/products', (0, token_verifier_1["default"])('role_admin'), create);
};
exports["default"] = product_routes;
