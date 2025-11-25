import prisma from '@/prisma';
import { AdminEventTransactionQuery } from '@/types/admin.type';
import {
  PaymentStatus,
  statusResponse,
  totalSaleResponse,
} from '@/types/transaction.type';
import { Prisma } from '@prisma/client';

export class TransactionRepository {
  static async getEventWaiting(id: number) {
    return await prisma.transaction.findMany({
      where: {
        paymentStatus: PaymentStatus.WAITING,
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

  static async getEventSuccess(id: number) {
    const today = new Date().toISOString();
    return await prisma.transaction.findMany({
      where: {
        paymentStatus: PaymentStatus.SUCCESS,
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

  static async getEventSuccessByDate(id: number) {
    const today = new Date().toISOString();
    return await prisma.transaction.findMany({
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

  static async getEventTransactions(
    id: number,
    query: AdminEventTransactionQuery,
  ) {
    return await prisma.transaction.findMany({
      where: { event: { user: { id: id } } },
      include: {
        user: { select: { username: true } },
        event: { select: { name: true } },
        voucher: { select: { name: true } },
      },
      skip: (Number(query.page) - 1) * Number(query.limit),
      take: Number(query.limit),
      orderBy: { [query.sort_by!]: query.order_by },
    });
  }

  static async countEventTransactions(id: number) {
    return await prisma.transaction.aggregate({
      _count: true,
      where: { event: { user: { id: id } } },
    });
  }

  static async getTotalSalesGroupByUpdatedAt(
    id: number,
    filter: { gte: Date | string; lte: Date | string },
  ): Promise<totalSaleResponse[]> {
    const query = Prisma.sql`
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

    return await prisma.$queryRaw(query);
  }

  static async getTransactionStatusByUpdatedAt(
    id: number,
    filter: { gte: Date | string; lte: Date | string },
  ): Promise<statusResponse[]> {
    const query = Prisma.sql`
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

    return await prisma.$queryRaw(query);
  }

  static async getTransactionHasUser(transactionId: number) {
    return await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { event: { include: { user: true } } },
    });
  }

  static async updateTransactionStatus(
    transactionId: number,
    status: PaymentStatus,
  ) {
    return await prisma.transaction.update({
      where: { id: transactionId },
      data: { paymentStatus: status },
    });
  }

  static async checkoutUser(transactionId: number, file: Express.Multer.File) {
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        paymentStatus: PaymentStatus.PAID,
        paymentProof: `/assets/events/${file}`,
      },
    });
  }

  static async postPaidCheckout(
    transactionId: number,
    file: Express.Multer.File,
  ) {
    await prisma.transaction.update({
      where: { id: Number(transactionId) },
      data: {
        paymentStatus: PaymentStatus.PAID,
        paymentProof: `/assets/transactions/${file.filename}`,
      },
    });
  }

  static async getDataCheckout(transactionId: number) {
    return await prisma.transaction.findUnique({
      where: { id: Number(transactionId) },
      include: { event: true },
    });
  }
}