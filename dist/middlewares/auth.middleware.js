"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userGuard = exports.adminGuard = exports.verifyToken = void 0;
const error_1 = require("../utils/error");
const jwt_1 = require("../utils/jwt");
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token)
        throw (0, error_1.createCustomError)(401, 'Unauthorized');
    const decoded = (0, jwt_1.verifyJWTToken)(token);
    if (decoded)
        res.locals.decoded = decoded;
    next();
};
exports.verifyToken = verifyToken;
const adminGuard = (req, res, next) => {
    var _a;
    if (!((_a = res.locals.decoded) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
        throw (0, error_1.createCustomError)(401, 'Unauthorized');
    }
    next();
};
exports.adminGuard = adminGuard;
const userGuard = (req, res, next) => {
    var _a;
    if ((_a = res.locals.decoded) === null || _a === void 0 ? void 0 : _a.isAdmin) {
        throw (0, error_1.createCustomError)(401, 'Unauthorized');
    }
    next();
};
exports.userGuard = userGuard;
