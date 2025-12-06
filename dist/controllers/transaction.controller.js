"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionController = createTransactionController;
exports.getEventTransactionsWaitingController = getEventTransactionsWaitingController;
exports.getEventTrasactionsSuccesController = getEventTrasactionsSuccesController;
exports.getEventTransactionsSuccessByDateController = getEventTransactionsSuccessByDateController;
exports.checkoutUserController = checkoutUserController;
const transaction_service_1 = require("../services/transaction.service");
async function createTransactionController(req, res, next) {
    try {
        const id = res.locals.decoded.id;
        const request = req.body;
        const response = await (0, transaction_service_1.createTransactionService)(id, request);
        return res.status(201).send(response);
    }
    catch (error) {
        next(error);
    }
}
async function getEventTransactionsWaitingController(req, res, next) {
    try {
        const id = res.locals.decoded.id;
        const response = await (0, transaction_service_1.getPaymentStatusWaitingService)(id);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
async function getEventTrasactionsSuccesController(req, res, next) {
    try {
        const id = res.locals.decoded.id;
        const response = await (0, transaction_service_1.getPaymentStatusSuccessService)(id);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
async function getEventTransactionsSuccessByDateController(req, res, next) {
    try {
        const id = res.locals.decoded.id;
        const response = await (0, transaction_service_1.getPaymentStatusSuccessByDateService)(id);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
async function checkoutUserController(req, res, next) {
    try {
        const id = res.locals.decoded.id;
        const transactionId = req.params.transactionId;
        const file = req.file;
        console.log("cek file name", file);
        const response = await (0, transaction_service_1.checkoutUserService)(id, transactionId, file);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
