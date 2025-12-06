import prisma from '@/prisma';
import { getEventByIdWithTransaction } from '@/repositories/event.repository';
import { getEventWaiting, getEventSuccess, getEventSuccessByDate, getDataCheckout, postPaidCheckout} from '@/repositories/transaction.repository';
import { findUserByIdIncludePoint, } from '@/repositories/user.repository';
import { findVouchersById } from '@/repositories/voucher.repository';
import {
  TransactionCheckout,
  TransactionRequest,
} from '@/types/transaction.type';
import { createCustomError } from '@/utils/error';
import { generateTicketCode } from '@/utils/randomGenerator';
import { responseWithData, responseWithoutData } from '@/utils/response';
import { TransactionValidation } from '@/validations/transaction.validation';
import { Validation } from '@/validations/validation';
import { PaymentStatus } from '@/types/transaction.type';


  export async function createTransactionService(id: number, request: TransactionRequest) {
    const { eventId, seatRequests, redeemedPoints, voucherId } =
      Validation.validate(TransactionValidation.CREATE, request);

    
    const event = await getEventByIdWithTransaction(
      eventId,
      id,
    );
    if (!event) throw createCustomError(404, 'Event not found!');

    if (seatRequests > event.limitCheckout) {
      throw createCustomError(400, 'Seat requests exceeds limit checkout!');
    }

    if (event.availableSeats < seatRequests) {
      throw createCustomError(400, 'Not enough seats available!');
    }

    if (new Date(event.endDate).getTime() < new Date().getTime()) {
      throw createCustomError(400, 'Event has ended!');
    }

    if (event.transactions.length) {
      const userTransactions = event.transactions.reduce((acc, curr) => {
        return acc + curr.quantity;
      }, 0);

      if (userTransactions >= event.limitCheckout) {
        throw createCustomError(400, 'You have reached limit checkout!');
      }

      if (userTransactions + seatRequests > event.limitCheckout) {
        throw createCustomError(400, 'Seat requests exceeds limit checkout!');
      }
    }

    
    let voucher: any = null;
    if (voucherId) {
      voucher = await findVouchersById(voucherId);
      if (!voucher) throw createCustomError(404, 'Voucher not found!');

      if (voucher.userId !== id && voucher.eventId !== eventId) {
        throw createCustomError(400, 'Voucher cannot be used!');
      }

      if (
        !voucher.eventId &&
        new Date(voucher.expiryDate!).getTime() < new Date().getTime()
      ) {
        throw createCustomError(400, 'Voucher has expired!');
      }

      if (voucher.usage >= voucher.maxUsage) {
        throw createCustomError(400, 'Voucher has reached its limit!');
      }
    }

    
    const user = await findUserByIdIncludePoint(id);
    if (redeemedPoints) {
      if (!user?.point) throw createCustomError(400, 'User has no points!');

      if (redeemedPoints > user.point.balance) {
        throw createCustomError(400, 'Redeemed points exceeds balance!');
      }

      if (new Date(user.point.expiryDate).getTime() < new Date().getTime()) {
        throw createCustomError(400, 'Point has expired!');
      }
    }

    if (!event.price && (redeemedPoints || voucherId)) {
      throw createCustomError(400, 'Event is free!');
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

      let transaction: any = null;
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
        } else {
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
      } else if (voucherId) {
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
      } else if (redeemedPoints) {
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
        } else {
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
      } else {
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

  export async function getPaymentStatusWaitingService(id: number) {
    const transactions = await getEventWaiting(id);

    const response = transactions.map((transaction) => {
      return { transactionId: transaction.id, originalAmount:transaction.originalAmount, discountedAmount:transaction.discountedAmount, ...transaction.event };
    });

    return responseWithData(
      200,
      true,
      'success get event status waiting',
      response,
    );
  }

  export async function getPaymentStatusSuccessService(id: number) {
    const transactions = await getEventSuccess(id);

    const response = transactions.map((transaction) => {
      return { ...transaction.event, originalAmount:transaction.originalAmount, discountedAmount:transaction.discountedAmount};
    });

    return responseWithData(
      200,
      true,
      'success get event status success',
      response,
    );
  }

  export async function getPaymentStatusSuccessByDateService(id: number) {
    const transactions = await getEventSuccessByDate(id);

    const response = transactions.map((transaction) => {
      return { ...transaction.event, originalAmount:transaction.originalAmount, discountedAmount:transaction.discountedAmount };
    });

    return responseWithData(
      200,
      true,
      'success get event status  By Date',
      response,
    );
  }

  export async function checkoutUserService(
    id: number,
    transactionId: string,
    file: Express.Multer.File,
  ) {
    const newTransactionId = Validation.validate(
      TransactionValidation.TRANSACTION_ID,
      transactionId,
    );
    const validateFile = TransactionValidation.fileValidation(file);

    const userTransactions = await getDataCheckout(
      Number(newTransactionId),
    );
    console.log('TEST', userTransactions);
    if (!userTransactions) {
      throw createCustomError(404, 'Transaction not found!');
    }

    if (userTransactions.userId !== id) {
      throw createCustomError(401, 'Transaction is not yours');
    }

    if (userTransactions.paymentStatus !== PaymentStatus.WAITING) {
      throw createCustomError(
        401,
        'Transaction has been paid or the transaction status is complete',
      );
    }

    const today = new Date().getTime();
    if (userTransactions.event.endDate.getTime() < today) {
      throw createCustomError(400, 'Event time has passed');
    }

    await postPaidCheckout(
      Number(newTransactionId),
      validateFile,
    );

    return responseWithoutData(200, true, 'Payment successful');
  }
