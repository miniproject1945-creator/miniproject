"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJWTToken = generateJWTToken;
exports.verifyJWTToken = verifyJWTToken;
const configs_1 = require("../configs");
const jsonwebtoken_1 = require("jsonwebtoken");
function generateJWTToken(payload) {
    return (0, jsonwebtoken_1.sign)(payload, configs_1.JWT_SECRET);
}
function verifyJWTToken(token) {
    return (0, jsonwebtoken_1.verify)(token, configs_1.JWT_SECRET);
}
