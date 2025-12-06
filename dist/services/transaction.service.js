"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionService = createTransactionService;
exports.getPaymentStatusWaitingService = getPaymentStatusWaitingService;
exports.getPaymentStatusSuccessService = getPaymentStatusSuccessService;
exports.getPaymentStatusSuccessByDateService = getPaymentStatusSuccessByDateService;
exports.checkoutUserService = checkoutUserService;
const prisma_1 = __importDefault(require("../prisma"));
const event_repository_1 = require("../repositories/event.repository");
const transaction_repository_1 = require("../repositories/transaction.repository");
const user_repository_1 = require("../repositories/user.repository");
const voucher_repository_1 = require("../repositories/voucher.repository");
const error_1 = require("../utils/error");
const randomGenerator_1 = require("../utils/randomGenerator");
const response_1 = require("../utils/response");
const transaction_validation_1 = require("../validations/transaction.validation");
const validation_1 = require("../validations/validation");
const transaction_type_1 = require("../types/transaction.type");
async function createTransactionService(id, request) {
    const { eventId, seatRequests, redeemedPoints, voucherId } = validation_1.Validation.validate(transaction_validation_1.TransactionValidation.CREATE, request);
    const event = await (0, event_repository_1.getEventByIdWithTransaction)(eventId, id);
    if (!event)
        throw (0, error_1.createCustomError)(404, 'Event not found!');
    if (seatRequests > event.limitCheckout) {
        throw (0, error_1.createCustomError)(400, 'Seat requests exceeds limit checkout!');
    }
    if (event.availableSeats < seatRequests) {
        throw (0, error_1.createCustomError)(400, 'Not enough seats available!');
    }
    if (new Date(event.endDate).getTime() < new Date().getTime()) {
        throw (0, error_1.createCustomError)(400, 'Event has ended!');
    }
    if (event.transactions.length) {
        const userTransactions = event.transactions.reduce((acc, curr) => {
            return acc + curr.quantity;
        }, 0);
        if (userTransactions >= event.limitCheckout) {
            throw (0, error_1.createCustomError)(400, 'You have reached limit checkout!');
        }
        if (userTransactions + seatRequests > event.limitCheckout) {
            throw (0, error_1.createCustomError)(400, 'Seat requests exceeds limit checkout!');
        }
    }
    let voucher = null;
    if (voucherId) {
        voucher = await (0, voucher_repository_1.findVouchersById)(voucherId);
        if (!voucher)
            throw (0, error_1.createCustomError)(404, 'Voucher not found!');
        if (voucher.userId !== id && voucher.eventId !== eventId) {
            throw (0, error_1.createCustomError)(400, 'Voucher cannot be used!');
        }
        if (!voucher.eventId &&
            new Date(voucher.expiryDate).getTime() < new Date().getTime()) {
            throw (0, error_1.createCustomError)(400, 'Voucher has expired!');
        }
        if (voucher.usage >= voucher.maxUsage) {
            throw (0, error_1.createCustomError)(400, 'Voucher has reached its limit!');
        }
    }
    const user = await (0, user_repository_1.findUserByIdIncludePoint)(id);
    if (redeemedPoints) {
        if (!(user === null || user === void 0 ? void 0 : user.point))
            throw (0, error_1.createCustomError)(400, 'User has no points!');
        if (redeemedPoints > user.point.balance) {
            throw (0, error_1.createCustomError)(400, 'Redeemed points exceeds balance!');
        }
        if (new Date(user.point.expiryDate).getTime() < new Date().getTime()) {
            throw (0, error_1.createCustomError)(400, 'Point has expired!');
        }
    }
    if (!event.price && (redeemedPoints || voucherId)) {
        throw (0, error_1.createCustomError)(400, 'Event is free!');
    }
    // transaction for event is free
    if (!event.price) {
        await prisma_1.default.$transaction(async (tx) => {
            await tx.event.update({
                data: {
                    availableSeats: event.availableSeats - seatRequests,
                },
                where: { id: event.id },
            });
            const transaction = await tx.transaction.create({
                data: {
                    amount: event.price,
                    quantity: seatRequests,
                    originalAmount: 0,
                    paymentStatus: 'success',
                    user: { connect: { id } },
                    event: { connect: { id: eventId } },
                },
            });
            const prefixTicketCode = event.name.slice(0, 3).toUpperCase();
            for (let index = 0; index < seatRequests; index++) {
                await tx.transactionDetail.create({
                    data: {
                        ticketCode: (0, randomGenerator_1.generateTicketCode)(prefixTicketCode),
                        transaction: { connect: { id: transaction.id } },
                    },
                });
            }
        });
        return (0, response_1.responseWithoutData)(201, true, 'Transaction created!');
    }
    // transaction for event is not free
    await prisma_1.default.$transaction(async (tx) => {
        var _a, _b, _c, _d;
        await tx.event.update({
            data: {
                availableSeats: event.availableSeats - seatRequests,
            },
            where: { id: event.id },
        });
        let transaction = null;
        if (voucherId && redeemedPoints) {
            const originalAmount = event.price * seatRequests;
            const totalDiscount = (originalAmount * voucher.discount) / 100;
            const amountAfterDiscount = originalAmount - totalDiscount;
            await tx.voucher.update({
                where: { id: voucherId },
                data: { usage: { increment: 1 } },
            });
            if (amountAfterDiscount <= redeemedPoints) {
                await tx.point.update({
                    where: { id: (_a = user === null || user === void 0 ? void 0 : user.point) === null || _a === void 0 ? void 0 : _a.id },
                    data: { balance: { decrement: amountAfterDiscount } },
                });
                transaction = await tx.transaction.create({
                    data: {
                        amount: event.price,
                        quantity: seatRequests,
                        originalAmount,
                        discountedAmount: 0,
                        paymentStatus: 'success',
                        user: { connect: { id } },
                        event: { connect: { id: eventId } },
                        voucher: { connect: { id: voucherId } },
                        redeemedPoints: amountAfterDiscount,
                    },
                });
            }
            else {
                const totalAmount = amountAfterDiscount - redeemedPoints;
                await tx.point.update({
                    where: { id: (_b = user === null || user === void 0 ? void 0 : user.point) === null || _b === void 0 ? void 0 : _b.id },
                    data: { balance: { decrement: redeemedPoints } },
                });
                transaction = await tx.transaction.create({
                    data: {
                        amount: event.price,
                        quantity: seatRequests,
                        originalAmount,
                        discountedAmount: totalAmount,
                        paymentStatus: 'waiting',
                        user: { connect: { id } },
                        event: { connect: { id: eventId } },
                        voucher: { connect: { id: voucherId } },
                        redeemedPoints,
                    },
                });
            }
        }
        else if (voucherId) {
            const originalAmount = event.price * seatRequests;
            const totalDiscount = (originalAmount * voucher.discount) / 100;
            const amountAfterDiscount = originalAmount - totalDiscount;
            await tx.voucher.update({
                where: { id: voucherId },
                data: { usage: { increment: 1 } },
            });
            transaction = await tx.transaction.create({
                data: {
                    amount: event.price,
                    quantity: seatRequests,
                    originalAmount,
                    discountedAmount: amountAfterDiscount,
                    paymentStatus: amountAfterDiscount === 0 ? 'success' : 'waiting',
                    user: { connect: { id } },
                    event: { connect: { id: eventId } },
                    voucher: { connect: { id: voucherId } },
                },
            });
        }
        else if (redeemedPoints) {
            const originalAmount = event.price * seatRequests;
            if (originalAmount <= redeemedPoints) {
                await tx.point.update({
                    where: { id: (_c = user === null || user === void 0 ? void 0 : user.point) === null || _c === void 0 ? void 0 : _c.id },
                    data: { balance: { decrement: originalAmount } },
                });
                transaction = await tx.transaction.create({
                    data: {
                        amount: event.price,
                        quantity: seatRequests,
                        originalAmount,
                        discountedAmount: 0,
                        paymentStatus: 'success',
                        user: { connect: { id } },
                        event: { connect: { id: eventId } },
                        redeemedPoints: originalAmount,
                    },
                });
            }
            else {
                const totalAmount = originalAmount - redeemedPoints;
                await tx.point.update({
                    where: { id: (_d = user === null || user === void 0 ? void 0 : user.point) === null || _d === void 0 ? void 0 : _d.id },
                    data: { balance: { decrement: redeemedPoints } },
                });
                transaction = await tx.transaction.create({
                    data: {
                        amount: event.price,
                        quantity: seatRequests,
                        originalAmount,
                        discountedAmount: totalAmount,
                        paymentStatus: 'waiting',
                        user: { connect: { id } },
                        event: { connect: { id: eventId } },
                        redeemedPoints,
                    },
                });
            }
        }
        else {
            transaction = await tx.transaction.create({
                data: {
                    amount: event.price,
                    quantity: seatRequests,
                    originalAmount: event.price * seatRequests,
                    paymentStatus: 'waiting',
                    user: { connect: { id } },
                    event: { connect: { id: eventId } },
                },
            });
        }
        const prefixTicketCode = event.name.slice(0, 3).toUpperCase();
        for (let index = 0; index < seatRequests; index++) {
            await tx.transactionDetail.create({
                data: {
                    ticketCode: (0, randomGenerator_1.generateTicketCode)(prefixTicketCode),
                    transaction: { connect: { id: transaction.id } },
                },
            });
        }
    });
    return (0, response_1.responseWithoutData)(201, true, 'Transaction created!');
}
async function getPaymentStatusWaitingService(id) {
    const transactions = await (0, transaction_repository_1.getEventWaiting)(id);
    const response = transactions.map((transaction) => {
        return Object.assign({ transactionId: transaction.id, originalAmount: transaction.originalAmount, discountedAmount: transaction.discountedAmount }, transaction.event);
    });
    return (0, response_1.responseWithData)(200, true, 'success get event status waiting', response);
}
async function getPaymentStatusSuccessService(id) {
    const transactions = await (0, transaction_repository_1.getEventSuccess)(id);
    const response = transactions.map((transaction) => {
        return Object.assign(Object.assign({}, transaction.event), { originalAmount: transaction.originalAmount, discountedAmount: transaction.discountedAmount });
    });
    return (0, response_1.responseWithData)(200, true, 'success get event status success', response);
}
async function getPaymentStatusSuccessByDateService(id) {
    const transactions = await (0, transaction_repository_1.getEventSuccessByDate)(id);
    const response = transactions.map((transaction) => {
        return Object.assign(Object.assign({}, transaction.event), { originalAmount: transaction.originalAmount, discountedAmount: transaction.discountedAmount });
    });
    return (0, response_1.responseWithData)(200, true, 'success get event status  By Date', response);
}
async function checkoutUserService(id, transactionId, file) {
    const newTransactionId = validation_1.Validation.validate(transaction_validation_1.TransactionValidation.TRANSACTION_ID, transactionId);
    const validateFile = transaction_validation_1.TransactionValidation.fileValidation(file);
    const userTransactions = await (0, transaction_repository_1.getDataCheckout)(Number(newTransactionId));
    console.log('TEST', userTransactions);
    if (!userTransactions) {
        throw (0, error_1.createCustomError)(404, 'Transaction not found!');
    }
    if (userTransactions.userId !== id) {
        throw (0, error_1.createCustomError)(401, 'Transaction is not yours');
    }
    if (userTransactions.paymentStatus !== transaction_type_1.PaymentStatus.WAITING) {
        throw (0, error_1.createCustomError)(401, 'Transaction has been paid or the transaction status is complete');
    }
    const today = new Date().getTime();
    if (userTransactions.event.endDate.getTime() < today) {
        throw (0, error_1.createCustomError)(400, 'Event time has passed');
    }
    await (0, transaction_repository_1.postPaidCheckout)(Number(newTransactionId), validateFile);
    return (0, response_1.responseWithoutData)(200, true, 'Payment successful');
}
