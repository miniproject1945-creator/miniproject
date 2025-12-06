"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVoucherController = createVoucherController;
exports.getVoucherByIdController = getVoucherByIdController;
exports.getVouchersByCreatorController = getVouchersByCreatorController;
const voucher_service_1 = require("../services/voucher.service");
async function createVoucherController(req, res, next) {
    try {
        const id = res.locals.decoded.id;
        const body = req.body;
        const response = await (0, voucher_service_1.createVoucherService)(id, body);
        return res.status(201).send(response);
    }
    catch (error) {
        next(error);
    }
}
async function getVoucherByIdController(req, res, next) {
    try {
        const id = res.locals.decoded.id;
        const eventId = Number(req.params.eventId);
        const response = await (0, voucher_service_1.getVouchersByIdService)(id, eventId);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
async function getVouchersByCreatorController(req, res, next) {
    try {
        const eventId = Number(req.params.eventId);
        const response = await (0, voucher_service_1.getVouchersByCreatorService)(eventId);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
