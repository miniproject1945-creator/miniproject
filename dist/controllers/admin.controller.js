"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminEventsController = getAdminEventsController;
exports.getEventTransactionsController = getEventTransactionsController;
exports.getTotalSalesController = getTotalSalesController;
exports.getTransactionStatusController = getTransactionStatusController;
exports.updateTransactionStatusController = updateTransactionStatusController;
exports.getEventParticipationsController = getEventParticipationsController;
exports.getTransactionController = getTransactionController;
exports.getTransactionDetailsController = getTransactionDetailsController;
exports.getEventController = getEventController;
const admin_service_1 = require("../services/admin.service");
async function getAdminEventsController(req, res, next) {
    try {
        const id = res.locals.decoded.id;
        const query = req.query;
        const response = await (0, admin_service_1.getAdminEventsService)(id, query);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
async function getEventTransactionsController(req, res, next) {
    try {
        const id = res.locals.decoded.id;
        const query = req.query;
        const response = await (0, admin_service_1.getAdminEventTransactionsService)(id, query);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
async function getTotalSalesController(req, res, next) {
    try {
        const id = res.locals.decoded.id;
        const query = req.query;
        const response = await (0, admin_service_1.getAdminTotalSalesService)(id, query);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
async function getTransactionStatusController(req, res, next) {
    try {
        const id = res.locals.decoded.id;
        const query = req.query;
        const response = await (0, admin_service_1.getAdminTransactionStatusService)(id, query);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
async function updateTransactionStatusController(req, res, next) {
    try {
        const id = res.locals.decoded.id;
        const transactionId = req.params.transactionId;
        const request = req.body;
        const response = await (0, admin_service_1.updateAdminTransactionStatusService)(id, transactionId, request);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
async function getEventParticipationsController(req, res, next) {
    try {
        const id = res.locals.decoded.id;
        const eventId = req.params.eventId;
        const query = req.query;
        const response = await (0, admin_service_1.getAdminEventParticipationsService)(id, eventId, query);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
async function getTransactionController(req, res, next) {
    try {
        const id = res.locals.decoded.id;
        const transactionId = req.params.transactionId;
        const response = await (0, admin_service_1.getTransactionService)(id, transactionId);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
async function getTransactionDetailsController(req, res, next) {
    try {
        const id = res.locals.decoded.id;
        const transactionId = req.params.transactionId;
        const response = await (0, admin_service_1.getTransactionDetailsService)(id, transactionId);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
async function getEventController(req, res, next) {
    try {
        const id = res.locals.decoded.id;
        const eventId = req.params.eventId;
        const response = await (0, admin_service_1.getEventService)(id, eventId);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
