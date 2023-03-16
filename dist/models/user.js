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
exports.UserStore = void 0;
var database_1 = __importDefault(require("../database"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var _a = process.env, SALT_ROUNDS = _a.SALT_ROUNDS, BCRYPT_PASSWORD = _a.BCRYPT_PASSWORD, TOKEN_SECRET = _a.TOKEN_SECRET;
var pepper = String(BCRYPT_PASSWORD);
var saltRounds = String(SALT_ROUNDS);
var tokenSecret = String(TOKEN_SECRET);
var UserStore = /** @class */ (function () {
    function UserStore() {
    }
    UserStore.prototype.findAll = function (limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql_one, result_one, users, userDTOs, i, sql_two, result_two, role, userDTO, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql_one = 'SELECT * FROM users ORDER BY id LIMIT ($1) OFFSET ($2)';
                        return [4 /*yield*/, conn.query(sql_one, [limit, offset])];
                    case 2:
                        result_one = _a.sent();
                        users = result_one.rows;
                        userDTOs = [];
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < users.length)) return [3 /*break*/, 6];
                        sql_two = 'SELECT * FROM roles WHERE id = ($1)';
                        return [4 /*yield*/, conn.query(sql_two, [users[i].role_id])];
                    case 4:
                        result_two = _a.sent();
                        role = result_two.rows[0];
                        userDTO = this.mapUserToUserDTO(users[i], role);
                        userDTOs.push(userDTO);
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6:
                        conn.release();
                        return [2 /*return*/, userDTOs];
                    case 7:
                        error_1 = _a.sent();
                        throw new Error("Cannot get users: ".concat(error_1));
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    UserStore.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql_one, result_one, user, sql_two, result_two, role, userDTO, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql_one = 'SELECT * FROM users WHERE id = ($1)';
                        return [4 /*yield*/, conn.query(sql_one, [id])];
                    case 2:
                        result_one = _a.sent();
                        user = result_one.rows[0];
                        sql_two = 'SELECT * FROM roles WHERE id = ($1)';
                        return [4 /*yield*/, conn.query(sql_two, [user.role_id])];
                    case 3:
                        result_two = _a.sent();
                        role = result_two.rows[0];
                        userDTO = this.mapUserToUserDTO(user, role);
                        conn.release();
                        return [2 /*return*/, userDTO];
                    case 4:
                        error_2 = _a.sent();
                        throw new Error("Cannot get user with id ".concat(id, ": ").concat(error_2));
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserStore.prototype.save = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql_one, hash, result_one, savedUser, sql_two, result_two, role, userDTO, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql_one = 'INSERT INTO users (first_name, last_name, username, password, phone_number, role_id) VALUES ($1, $2, $3, $4, $5, $6) ' +
                            'RETURNING *';
                        hash = bcrypt_1["default"].hashSync(user.password + pepper, parseInt(saltRounds));
                        return [4 /*yield*/, conn.query(sql_one, [user.first_name, user.last_name, user.username, hash, user.phone_number, user.role_id])];
                    case 2:
                        result_one = _a.sent();
                        savedUser = result_one.rows[0];
                        sql_two = 'SELECT * FROM roles WHERE id = ($1)';
                        return [4 /*yield*/, conn.query(sql_two, [savedUser.role_id])];
                    case 3:
                        result_two = _a.sent();
                        role = result_two.rows[0];
                        userDTO = this.mapUserToUserDTO(savedUser, role);
                        conn.release();
                        return [2 /*return*/, userDTO];
                    case 4:
                        error_3 = _a.sent();
                        throw new Error("Cannot create user: ".concat(error_3));
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserStore.prototype.authenticate = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql_one, result_one, user, sql_two, result_two, role, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql_one = 'SELECT * FROM users WHERE username = ($1)';
                        return [4 /*yield*/, conn.query(sql_one, [username])];
                    case 2:
                        result_one = _a.sent();
                        if (!result_one.rows.length) return [3 /*break*/, 4];
                        user = result_one.rows[0];
                        sql_two = 'SELECT * FROM roles WHERE id = ($1)';
                        return [4 /*yield*/, conn.query(sql_two, [user.role_id])];
                    case 3:
                        result_two = _a.sent();
                        role = result_two.rows[0];
                        if (bcrypt_1["default"].compareSync(password + pepper, user.password)) {
                            return [2 /*return*/, jsonwebtoken_1["default"].sign({ id: user.id, username: user.username, verified: user.verified, role: role }, tokenSecret, { expiresIn: '24h' })];
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/, null];
                    case 5:
                        error_4 = _a.sent();
                        throw new Error("Authentication failed: ".concat(error_4));
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserStore.prototype.usersCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql = 'SELECT COUNT(*) FROM users';
                        return [4 /*yield*/, conn.query(sql)];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        return [2 /*return*/, result.rows[0]];
                    case 3:
                        error_5 = _a.sent();
                        throw new Error("Users count failed: ".concat(error_5));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserStore.prototype.mapUserToUserDTO = function (user, role) {
        return {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            phone_number: user.phone_number,
            verified: user.verified,
            role: role
        };
    };
    return UserStore;
}());
exports.UserStore = UserStore;
