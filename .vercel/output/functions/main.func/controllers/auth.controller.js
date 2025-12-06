"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = registerController;
exports.loginController = loginController;
exports.keepLoginController = keepLoginController;
const auth_service_1 = require("../services/auth.service");
async function registerController(req, res, next) {
    try {
        const request = req.body;
        const response = await (0, auth_service_1.registerService)(request);
        return res.status(201).send(response);
    }
    catch (error) {
        next(error);
    }
}
async function loginController(req, res, next) {
    try {
        const request = req.body;
        const response = await (0, auth_service_1.loginService)(request);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
async function keepLoginController(req, res, next) {
    try {
        const decoded = res.locals.decoded;
        const response = await (0, auth_service_1.keepLoginService)(decoded);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
