import prisma from '@/prisma';
import { EventRepository } from '@/repositories/event.repository';
import { TransactionRepository } from '@/repositories/transaction.repository';
import { UserRepository } from '@/repositories/user.repository';
import { VoucherRepository } from '@/repositories/voucher.repository';
import { ErrorResponse } from '@/utils/error';
import { generateTicketCode } from '@/utils/randomGenerator';
import { responseWithData, responseWithoutData } from '@/utils/response';
import { TransactionValidation } from '@/validations/transaction.validation';
import { Validation } from '@/validations/validation';
import { PaymentStatus } from '@/types/transaction.type';
export class TransactionService {
    static async createTransaction(id, request) {
        const { eventId, seatRequests, redeemedPoints, voucherId } = Validation.validate(TransactionValidation.CREATE, request);
        const event = await EventRepository.getEventByIdWithTransaction(eventId, id);
        if (!event)
            throw new ErrorResponse(404, 'Event not found!');
        if (seatRequests > event.limitCheckout) {
            throw new ErrorResponse(400, 'Seat requests exceeds limit checkout!');
        }
        if (event.availableSeats < seatRequests) {
            throw new ErrorResponse(400, 'Not enough seats available!');
        }
        if (new Date(event.endDate).getTime() < new Date().getTime()) {
            throw new ErrorResponse(400, 'Event has ended!');
        }
        if (event.transactions.length) {
            const userTransactions = event.transactions.reduce((acc, curr) => {
                return acc + curr.quantity;
            }, 0);
            if (userTransactions >= event.limitCheckout) {
                throw new ErrorResponse(400, 'You have reached limit checkout!');
            }
            if (userTransactions + seatRequests > event.limitCheckout) {
                throw new ErrorResponse(400, 'Seat requests exceeds limit checkout!');
            }
        }
        // check voucher owned by user and event
        let voucher = null;
        if (voucherId) {
            voucher = await VoucherRepository.findVouchersById(voucherId);
            if (!voucher)
                throw new ErrorResponse(404, 'Voucher not found!');
            if (voucher.userId !== id && voucher.eventId !== eventId) {
                throw new ErrorResponse(400, 'Voucher cannot be used!');
            }
            if (!voucher.eventId &&
                new Date(voucher.expiryDate).getTime() < new Date().getTime()) {
                throw new ErrorResponse(400, 'Voucher has expired!');
            }
            if (voucher.usage >= voucher.maxUsage) {
                throw new ErrorResponse(400, 'Voucher has reached its limit!');
            }
        }
        // check redeemable points
        const user = await UserRepository.findUserByIdIncludePoint(id);
        if (redeemedPoints) {
            if (!user?.point)
                throw new ErrorResponse(400, 'User has no points!');
            if (redeemedPoints > user.point.balance) {
                throw new ErrorResponse(400, 'Redeemed points exceeds balance!');
            }
            if (new Date(user.point.expiryDate).getTime() < new Date().getTime()) {
                throw new ErrorResponse(400, 'Point has expired!');
            }
        }
        if (!event.price && (redeemedPoints || voucherId)) {
            throw new ErrorResponse(400, 'Event is free!');
        }
        // transaction for event is free
        if (!event.price) {
            await prisma.$transaction(async (tx) => {
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
                            ticketCode: generateTicketCode(prefixTicketCode),
                            transaction: { connect: { id: transaction.id } },
                        },
                    });
                }
            });
            return responseWithoutData(201, true, 'Transaction created!');
        }
        // transaction for event is not free
        await prisma.$transaction(async (tx) => {
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
                        where: { id: user?.point?.id },
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
                        where: { id: user?.point?.id },
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
                        where: { id: user?.point?.id },
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
                        where: { id: user?.point?.id },
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
                        ticketCode: generateTicketCode(prefixTicketCode),
                        transaction: { connect: { id: transaction.id } },
                    },
                });
            }
        });
        return responseWithoutData(201, true, 'Transaction created!');
    }
    static async getPaymentStatusWaiting(id) {
        const transactions = await TransactionRepository.getEventWaiting(id);
        const response = transactions.map((transaction) => {
            return { transactionId: transaction.id, originalAmount: transaction.originalAmount, discountedAmount: transaction.discountedAmount, ...transaction.event };
        });
        return responseWithData(200, true, 'success get event status waiting', response);
    }
    static async getPaymentStatusSuccess(id) {
        const transactions = await TransactionRepository.getEventSuccess(id);
        const response = transactions.map((transaction) => {
            return { ...transaction.event, originalAmount: transaction.originalAmount, discountedAmount: transaction.discountedAmount };
        });
        return responseWithData(200, true, 'success get event status success', response);
    }
    static async getPaymentStatusSuccessByDate(id) {
        const transactions = await TransactionRepository.getEventSuccessByDate(id);
        const response = transactions.map((transaction) => {
            return { ...transaction.event, originalAmount: transaction.originalAmount, discountedAmount: transaction.discountedAmount };
        });
        return responseWithData(200, true, 'success get event status  By Date', response);
    }
    static async checkoutUser(id, transactionId, file) {
        const newTransactionId = Validation.validate(TransactionValidation.TRANSACTION_ID, transactionId);
        const validateFile = TransactionValidation.fileValidation(file);
        const userTransactions = await TransactionRepository.getDataCheckout(Number(newTransactionId));
        console.log('TEST', userTransactions);
        if (!userTransactions) {
            throw new ErrorResponse(404, 'Transaction not found!');
        }
        if (userTransactions.userId !== id) {
            throw new ErrorResponse(401, 'Transaction is not yours');
        }
        if (userTransactions.paymentStatus !== PaymentStatus.WAITING) {
            throw new ErrorResponse(401, 'Transaction has been paid or the transaction status is complete');
        }
        const today = new Date().getTime();
        if (userTransactions.event.endDate.getTime() < today) {
            throw new ErrorResponse(400, 'Event time has passed');
        }
        await TransactionRepository.postPaidCheckout(Number(newTransactionId), validateFile);
        return responseWithoutData(200, true, 'Payment successful');
    }
}
