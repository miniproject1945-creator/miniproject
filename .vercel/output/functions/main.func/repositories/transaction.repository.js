"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventWaiting = getEventWaiting;
exports.getEventSuccess = getEventSuccess;
exports.getEventSuccessByDate = getEventSuccessByDate;
exports.getEventransactions = getEventransactions;
exports.countEventtransactions = countEventtransactions;
exports.getTotalSalesGroupByUpdatedAt = getTotalSalesGroupByUpdatedAt;
exports.getTransactionStatusByUpdatedAt = getTransactionStatusByUpdatedAt;
exports.getTransactionHasUser = getTransactionHasUser;
exports.updateTransactionStatus = updateTransactionStatus;
exports.checkoutUser = checkoutUser;
exports.postPaidCheckout = postPaidCheckout;
exports.getDataCheckout = getDataCheckout;
const prisma_1 = __importDefault(require("../prisma"));
const transaction_type_1 = require("../types/transaction.type");
const client_1 = require("@prisma/client");
async function getEventWaiting(id) {
    return await prisma_1.default.transaction.findMany({
        where: {
            paymentStatus: transaction_type_1.PaymentStatus.WAITING,
            userId: id,
        },
        include: {
            event: {
                include: {
                    category: true,
                    location: true,
                },
            },
        },
    });
}
async function getEventSuccess(id) {
    const today = new Date().toISOString();
    return await prisma_1.default.transaction.findMany({
        where: {
            paymentStatus: transaction_type_1.PaymentStatus.SUCCESS,
            userId: id,
            event: {
                endDate: {
                    gte: today,
                },
            },
        },
        include: {
            event: {
                include: {
                    category: true,
                    location: true,
                },
            },
        },
    });
}
async function getEventSuccessByDate(id) {
    const today = new Date().toISOString();
    return await prisma_1.default.transaction.findMany({
        where: {
            paymentStatus: 'success',
            userId: id,
            event: {
                endDate: { lt: today },
            },
        },
        include: {
            event: {
                include: {
                    feedbacks: {
                        where: {
                            userId: id,
                        },
                    },
                    category: true,
                    location: true,
                },
            },
        },
    });
}
async function getEventransactions(id, query) {
    return await prisma_1.default.transaction.findMany({
        where: { event: { user: { id: id } } },
        include: {
            user: { select: { username: true } },
            event: { select: { name: true } },
            voucher: { select: { name: true } },
        },
        skip: (Number(query.page) - 1) * Number(query.limit),
        take: Number(query.limit),
        orderBy: { [query.sort_by]: query.order_by },
    });
}
async function countEventtransactions(id) {
    return await prisma_1.default.transaction.aggregate({
        _count: true,
        where: { event: { user: { id: id } } },
    });
}
async function getTotalSalesGroupByUpdatedAt(id, filter) {
    const query = client_1.Prisma.sql `
    SELECT DATE(transactions.updatedAt) as date,
      SUM(CASE WHEN transactions.discountedAmount IS NULL THEN transactions.originalAmount ELSE transactions.discountedAmount END) as revenue
    FROM transactions
    JOIN events ON events.id = transactions.eventId
    WHERE events.userId = ${id}
      AND transactions.paymentStatus = 'success'
      AND transactions.updatedAt BETWEEN ${filter.gte} AND ${filter.lte}
    GROUP BY date
    ORDER BY date ASC
    ;`;
    return await prisma_1.default.$queryRaw(query);
}
async function getTransactionStatusByUpdatedAt(id, filter) {
    const query = client_1.Prisma.sql `
    SELECT
      DATE(transactions.updatedAt) as date,
      SUM(CASE WHEN transactions.paymentStatus = 'waiting' THEN 1 ELSE 0 END) as waiting,
      SUM(CASE WHEN transactions.paymentStatus = 'paid' THEN 1 ELSE 0 END) as paid,
      SUM(CASE WHEN transactions.paymentStatus = 'success' THEN 1 ELSE 0 END) as success,
      SUM(CASE WHEN transactions.paymentStatus = 'failed' THEN 1 ELSE 0 END) as failed
    FROM transactions
    JOIN events ON events.id = transactions.eventId
    WHERE events.userId = ${id}
      AND transactions.updatedAt BETWEEN ${filter.gte} AND ${filter.lte}
    GROUP BY date
    ORDER BY date ASC
    ;`;
    return await prisma_1.default.$queryRaw(query);
}
async function getTransactionHasUser(transactionId) {
    return await prisma_1.default.transaction.findUnique({
        where: { id: transactionId },
        include: { event: { include: { user: true } } },
    });
}
async function updateTransactionStatus(transactionId, status) {
    return await prisma_1.default.transaction.update({
        where: { id: transactionId },
        data: { paymentStatus: status },
    });
}
async function checkoutUser(transactionId, file) {
    await prisma_1.default.transaction.update({
        where: { id: transactionId },
        data: {
            paymentStatus: transaction_type_1.PaymentStatus.PAID,
            paymentProof: `/assets/events/${file}`,
        },
    });
}
async function postPaidCheckout(transactionId, file) {
    await prisma_1.default.transaction.update({
        where: { id: Number(transactionId) },
        data: {
            paymentStatus: transaction_type_1.PaymentStatus.PAID,
            paymentProof: `/assets/transactions/${file.filename}`,
        },
    });
}
async function getDataCheckout(transactionId) {
    return await prisma_1.default.transaction.findUnique({
        where: { id: Number(transactionId) },
        include: { event: true },
    });
}
