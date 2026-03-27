"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminEventsService = getAdminEventsService;
exports.getAdminEventTransactionsService = getAdminEventTransactionsService;
exports.getAdminTotalSalesService = getAdminTotalSalesService;
exports.getAdminTransactionStatusService = getAdminTransactionStatusService;
exports.updateAdminTransactionStatusService = updateAdminTransactionStatusService;
exports.getAdminEventParticipationsService = getAdminEventParticipationsService;
exports.getTransactionService = getTransactionService;
exports.getTransactionDetailsService = getTransactionDetailsService;
exports.getEventService = getEventService;
const prisma_1 = __importDefault(require("../prisma"));
const event_repository_1 = require("../repositories/event.repository");
const transaction_repository_1 = require("../repositories/transaction.repository");
const user_repository_1 = require("../repositories/user.repository");
const error_1 = require("../utils/error");
const generateDate_1 = require("../utils/generateDate");
const response_1 = require("../utils/response");
const admin_valiation_1 = require("../validations/admin.valiation");
const event_validation_1 = require("../validations/event_validation");
const transaction_validation_1 = require("../validations/transaction.validation");
const validation_1 = require("../validations/validation");
async function getAdminEventsService(id, query) {
    const adminEventQuery = validation_1.Validation.validate(admin_valiation_1.AdminValidation.EVENT_QUERY, query);
    if (!adminEventQuery.page)
        adminEventQuery.page = 1;
    if (!adminEventQuery.limit)
        adminEventQuery.limit = 10;
    if (!adminEventQuery.sort_by)
        adminEventQuery.sort_by = 'createdAt';
    if (!adminEventQuery.order_by)
        adminEventQuery.order_by = 'desc';
    const user = await (0, user_repository_1.getAdminEvents)(id, adminEventQuery);
    const allEvents = await (0, user_repository_1.countAdminEvents)(id, adminEventQuery);
    const events = user === null || user === void 0 ? void 0 : user.events.map(({ userId, categoryId, locationId, ...rest }) => rest);
    return (0, response_1.responseDataWithPagination)(200, 'Get admin events successfully', events, Number(adminEventQuery.page), Number(adminEventQuery.limit), (allEvents === null || allEvents === void 0 ? void 0 : allEvents._count.events) || 0);
}
async function getAdminEventTransactionsService(id, query) {
    var _a, _b;
    const eventQuery = validation_1.Validation.validate(admin_valiation_1.AdminValidation.EVENT_TRANSACTION_QUERY, query);
    if (!eventQuery.page)
        eventQuery.page = 1;
    if (!eventQuery.limit)
        eventQuery.limit = 10;
    if (!eventQuery.sort_by)
        eventQuery.sort_by = 'createdAt';
    if (!eventQuery.order_by)
        eventQuery.order_by = 'desc';
    const eventTransactions = await (0, transaction_repository_1.getEventransactions)(id, eventQuery);
    const allTransactions = await (0, event_repository_1.countEventTransactions)(id);
    const transactions = eventTransactions === null || eventTransactions === void 0 ? void 0 : eventTransactions.map(({ userId, eventId, voucherId, ...rest }) => rest);
    return (0, response_1.responseDataWithPagination)(200, 'Get admin event transactions successfully', transactions, Number(eventQuery.page), Number(eventQuery.limit), (_b = (_a = allTransactions === null || allTransactions === void 0 ? void 0 : allTransactions._count) === null || _a === void 0 ? void 0 : _a.transactions) !== null && _b !== void 0 ? _b : 0);
}
async function getAdminTotalSalesService(id, query) {
    const { start_date: startDate, end_date: endDate } = validation_1.Validation.validate(admin_valiation_1.AdminValidation.FILTER_QUERY, query);
    // handle date
    const currentDate = new Date();
    let lte = (0, generateDate_1.increamentDate)(currentDate, 1);
    if (endDate)
        lte = (0, generateDate_1.increamentDate)(new Date(endDate), 1);
    // 7 days ago
    const past7Days = (0, generateDate_1.decreamentDate)(currentDate, 7);
    const transactions = await (0, transaction_repository_1.getTotalSalesGroupByUpdatedAt)(id, {
        gte: startDate !== null && startDate !== void 0 ? startDate : past7Days,
        lte,
    });
    return (0, response_1.responseWithData)(200, true, 'Get admin total sales successfully', transactions);
}
async function getAdminTransactionStatusService(id, query) {
    const { start_date: startDate, end_date: endDate } = validation_1.Validation.validate(admin_valiation_1.AdminValidation.FILTER_QUERY, query);
    // handle date
    const currentDate = new Date();
    let lte = (0, generateDate_1.increamentDate)(currentDate, 1);
    if (endDate)
        lte = (0, generateDate_1.increamentDate)(new Date(endDate), 1);
    // 7 days ago
    const past7Days = (0, generateDate_1.decreamentDate)(currentDate, 7);
    const statuses = await (0, transaction_repository_1.getTransactionStatusByUpdatedAt)(id, {
        gte: startDate !== null && startDate !== void 0 ? startDate : past7Days,
        lte,
    });
    return (0, response_1.responseWithData)(200, true, 'Get admin transaction status', statuses);
}
async function updateAdminTransactionStatusService(id, transactionId, request) {
    const newTransactionId = validation_1.Validation.validate(transaction_validation_1.TransactionValidation.TRANSACTION_ID, transactionId);
    const { status } = validation_1.Validation.validate(admin_valiation_1.AdminValidation.UPDATE_TRANSACTION_STATUS, request);
    const transaction = await (0, transaction_repository_1.getTransactionHasUser)(Number(newTransactionId));
    if (!transaction)
        throw (0, error_1.createCustomError)(404, 'Transaction not found!');
    if (transaction.event.user.id !== id) {
        throw (0, error_1.createCustomError)(401, 'This event is not yours!');
    }
    await (0, transaction_repository_1.updateTransactionStatus)(Number(newTransactionId), status);
    return (0, response_1.responseWithoutData)(200, true, 'Update transaction status successfully');
}
async function getAdminEventParticipationsService(id, eventId, query) {
    const newEventId = validation_1.Validation.validate(event_validation_1.EventValidation.EVENT_ID, eventId);
    const adminEventQuery = validation_1.Validation.validate(admin_valiation_1.AdminValidation.EVENT_QUERY, query);
    if (!adminEventQuery.page)
        adminEventQuery.page = 1;
    if (!adminEventQuery.limit)
        adminEventQuery.limit = 10;
    if (!adminEventQuery.sort_by)
        adminEventQuery.sort_by = 'createdAt';
    if (!adminEventQuery.order_by)
        adminEventQuery.order_by = 'desc';
    const event = await (0, event_repository_1.getEventIncludeTransactionWithPagination)(Number(newEventId), {
        limit: Number(adminEventQuery.limit),
        page: Number(adminEventQuery.page),
        sort_by: adminEventQuery.sort_by,
        order_by: adminEventQuery.order_by,
    });
    if (!event) {
        return (0, response_1.responseWithData)(200, true, "Event don't have participations", []);
    }
    if (event.userId !== id) {
        throw (0, error_1.createCustomError)(401, 'This event is not yours!');
    }
    const transactions = event.transactions.map((transaction) => {
        return {
            transactionId: transaction.id,
            username: transaction.user.username,
            email: transaction.user.email,
            quantity: transaction.quantity,
            paymentStatus: transaction.paymentStatus,
            createdAt: transaction.createdAt,
        };
    });
    const allEventTransactions = await (0, event_repository_1.countEventTransactions)(Number(eventId));
    return (0, response_1.responseDataWithPagination)(200, 'Get admin event participations successfully', transactions, Number(adminEventQuery.page), Number(adminEventQuery.limit), (allEventTransactions === null || allEventTransactions === void 0 ? void 0 : allEventTransactions._count.transactions) || 0);
}
async function getTransactionService(id, transactionId) {
    const newTransactionId = validation_1.Validation.validate(transaction_validation_1.TransactionValidation.TRANSACTION_ID, transactionId);
    const transaction = await (0, transaction_repository_1.getTransactionHasUser)(Number(newTransactionId));
    if (!transaction)
        throw (0, error_1.createCustomError)(404, 'Transaction not found!');
    if (transaction.event.user.id !== id) {
        throw (0, error_1.createCustomError)(401, 'This transaction is not yours!');
    }
    const { event, ...newTransaction } = transaction;
    return (0, response_1.responseWithData)(200, true, 'Success get transaction', newTransaction);
}
async function getTransactionDetailsService(id, transactionId) {
    const newTransactionId = validation_1.Validation.validate(transaction_validation_1.TransactionValidation.TRANSACTION_ID, transactionId);
    const transaction = await prisma_1.default.transaction.findUnique({
        where: { id: Number(newTransactionId) },
        include: { details: true, event: { include: { user: true } } },
    });
    if (!transaction)
        throw (0, error_1.createCustomError)(404, 'Transaction not found!');
    if (transaction.event.user.id !== id) {
        throw (0, error_1.createCustomError)(401, 'This transaction is not yours!');
    }
    const { details } = transaction;
    return (0, response_1.responseWithData)(200, true, 'Success get transaction details', details);
}
async function getEventService(id, eventId) {
    const newEventId = validation_1.Validation.validate(event_validation_1.EventValidation.EVENT_ID, eventId);
    const event = await (0, event_repository_1.getEventIncludeCategoryLocation)(Number(newEventId));
    if (!event)
        throw (0, error_1.createCustomError)(404, 'Event not found!');
    if (event.userId !== id) {
        throw (0, error_1.createCustomError)(401, 'This event is not yours!');
    }
    return (0, response_1.responseWithData)(200, true, 'Success get event', event);
}
