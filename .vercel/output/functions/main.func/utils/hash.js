"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const configs_1 = require("../configs");
const bcrypt_1 = require("bcrypt");
const hashPassword = async (password) => {
    const generateSalt = await (0, bcrypt_1.genSalt)(Number(configs_1.SALT));
    return await (0, bcrypt_1.hash)(password, generateSalt);
};
exports.hashPassword = hashPassword;
const comparePassword = async (password, hashPassword) => {
    return await (0, bcrypt_1.compare)(password, hashPassword);
};
exports.comparePassword = comparePassword;
