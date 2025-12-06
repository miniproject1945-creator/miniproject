import prisma from '../prisma';
import { getEventIncludeTransactionWithPagination, countEventTransactions, getEventIncludeCategoryLocation  } from '../repositories/event.repository';
import { getEventransactions, getTotalSalesGroupByUpdatedAt, getTransactionStatusByUpdatedAt, countEventtransactions, getTransactionHasUser, updateTransactionStatus } from '../repositories/transaction.repository';
import { getAdminEvents, countAdminEvents, } from '../repositories/user.repository';
import {
  AdminEventQuery,
  AdminEventTransactionQuery,
  FilterDate,
} from '../types/admin.type';
import { TransactionStatus } from '../types/transaction.type';
import { createCustomError } from '../utils/error';
import { decreamentDate, increamentDate } from '../utils/generateDate';
import {
  responseDataWithPagination,
  responseWithData,
  responseWithoutData,
} from '../utils/response';
import { AdminValidation } from '../validations/admin.valiation';
import { EventValidation } from '../validations/event_validation';
import { TransactionValidation } from '../validations/transaction.validation';
import { Validation } from '../validations/validation';


  export async function getAdminEventsService(id: number, query: AdminEventQuery) {
    const adminEventQuery = Validation.validate(
      AdminValidation.EVENT_QUERY,
      query,
    );

    if (!adminEventQuery.page) adminEventQuery.page = 1;
    if (!adminEventQuery.limit) adminEventQuery.limit = 10;
    if (!adminEventQuery.sort_by) adminEventQuery.sort_by = 'createdAt';
    if (!adminEventQuery.order_by) adminEventQuery.order_by = 'desc';

    const user = await getAdminEvents(id, adminEventQuery);

    const allEvents = await countAdminEvents(
      id,
      adminEventQuery,
    );

    const events = user?.events.map(
      ({ userId, categoryId, locationId, ...rest }) => rest,
    );

    return responseDataWithPagination(
      200,
      'Get admin events successfully',
      events!,
      Number(adminEventQuery.page),
      Number(adminEventQuery.limit),
      allEvents?._count.events || 0,
    );
  }

  export async function getAdminEventTransactionsService(
    id: number,
    query: AdminEventTransactionQuery,
  ) {
    const eventQuery = Validation.validate(
      AdminValidation.EVENT_TRANSACTION_QUERY,
      query,
    );

    if (!eventQuery.page) eventQuery.page = 1;
    if (!eventQuery.limit) eventQuery.limit = 10;
    if (!eventQuery.sort_by) eventQuery.sort_by = 'createdAt';
    if (!eventQuery.order_by) eventQuery.order_by = 'desc';

    const eventTransactions = await getEventransactions(
      id,
      eventQuery,
    );

    const allTransactions =
      await countEventTransactions(id);

    const transactions = eventTransactions?.map(
      ({ userId, eventId, voucherId, ...rest }) => rest,
    );

    return responseDataWithPagination(
      200,
      'Get admin event transactions successfully',
      transactions,
      Number(eventQuery.page),
      Number(eventQuery.limit),
      allTransactions?._count?.transactions??0,
    );
  }

  export async function getAdminTotalSalesService(id: number, query: FilterDate) {
    const { start_date: startDate, end_date: endDate } = Validation.validate(
      AdminValidation.FILTER_QUERY,
      query,
    );

    // handle date
    const currentDate = new Date();
    let lte = increamentDate(currentDate, 1);
    if (endDate) lte = increamentDate(new Date(endDate), 1);

    // 7 days ago
    const past7Days = decreamentDate(currentDate, 7);

    const transactions =
      await getTotalSalesGroupByUpdatedAt(id, {
        gte: startDate ?? past7Days,
        lte,
      });

    return responseWithData(
      200,
      true,
      'Get admin total sales successfully',
      transactions,
    );
  }

  export async function getAdminTransactionStatusService(id: number, query: FilterDate) {
    const { start_date: startDate, end_date: endDate } = Validation.validate(
      AdminValidation.FILTER_QUERY,
      query,
    );

    // handle date
    const currentDate = new Date();
    let lte = increamentDate(currentDate, 1);
    if (endDate) lte = increamentDate(new Date(endDate), 1);

    // 7 days ago
    const past7Days = decreamentDate(currentDate, 7);

    const statuses =
      await getTransactionStatusByUpdatedAt(id, {
        gte: startDate ?? past7Days,
        lte,
      });

    return responseWithData(
      200,
      true,
      'Get admin transaction status',
      statuses,
    );
  }

  export async function updateAdminTransactionStatusService(
    id: number,
    transactionId: string,
    request: TransactionStatus,
  ) {
    const newTransactionId = Validation.validate(
      TransactionValidation.TRANSACTION_ID,
      transactionId,
    );
    const { status } = Validation.validate(
      AdminValidation.UPDATE_TRANSACTION_STATUS,
      request,
    );

    const transaction = await getTransactionHasUser(
      Number(newTransactionId),
    );

    if (!transaction) throw createCustomError(404, 'Transaction not found!');

    if (transaction.event.user.id !== id) {
      throw createCustomError(401, 'This event is not yours!');
    }

    await updateTransactionStatus(
      Number(newTransactionId),
      status,
    );

    return responseWithoutData(
      200,
      true,
      'Update transaction status successfully',
    );
  }

  export async function getAdminEventParticipationsService(
    id: number,
    eventId: string,
    query: AdminEventQuery,
  ) {
    const newEventId = Validation.validate(EventValidation.EVENT_ID, eventId);
    const adminEventQuery = Validation.validate(
      AdminValidation.EVENT_QUERY,
      query,
    );

    if (!adminEventQuery.page) adminEventQuery.page = 1;
    if (!adminEventQuery.limit) adminEventQuery.limit = 10;
    if (!adminEventQuery.sort_by) adminEventQuery.sort_by = 'createdAt';
    if (!adminEventQuery.order_by) adminEventQuery.order_by = 'desc';

    const event =
      await getEventIncludeTransactionWithPagination(
        Number(newEventId),
        {
          limit: Number(adminEventQuery.limit),
          page: Number(adminEventQuery.page),
          sort_by: adminEventQuery.sort_by,
          order_by: adminEventQuery.order_by,
        },
      );

    if (!event) {
      return responseWithData(200, true, "Event don't have participations", []);
    }

    if (event.userId !== id) {
      throw createCustomError(401, 'This event is not yours!');
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

    const allEventTransactions = await countEventTransactions(
      Number(eventId),
    );

    return responseDataWithPagination(
      200,
      'Get admin event participations successfully',
      transactions,
      Number(adminEventQuery.page),
      Number(adminEventQuery.limit),
      allEventTransactions?._count.transactions || 0,
    );
  }

  export async function getTransactionService(id: number, transactionId: string) {
    const newTransactionId = Validation.validate(
      TransactionValidation.TRANSACTION_ID,
      transactionId,
    );

    const transaction = await getTransactionHasUser(
      Number(newTransactionId),
    );

    if (!transaction) throw createCustomError(404, 'Transaction not found!');

    if (transaction.event.user.id !== id) {
      throw createCustomError(401, 'This transaction is not yours!');
    }

    const { event, ...newTransaction } = transaction;
    return responseWithData(
      200,
      true,
      'Success get transaction',
      newTransaction,
    );
  }

  export async function getTransactionDetailsService(id: number, transactionId: string) {
    const newTransactionId = Validation.validate(
      TransactionValidation.TRANSACTION_ID,
      transactionId,
    );

    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(newTransactionId) },
      include: { details: true, event: { include: { user: true } } },
    });

    if (!transaction) throw createCustomError(404, 'Transaction not found!');

    if (transaction.event.user.id !== id) {
      throw createCustomError(401, 'This transaction is not yours!');
    }

    const { details } = transaction;
    return responseWithData(
      200,
      true,
      'Success get transaction details',
      details,
    );
  }

  export async function getEventService(id: number, eventId: string) {
    const newEventId = Validation.validate(EventValidation.EVENT_ID, eventId);

    const event = await getEventIncludeCategoryLocation(
      Number(newEventId),
    );

    if (!event) throw createCustomError(404, 'Event not found!');

    if (event.userId !== id) {
      throw createCustomError(401, 'This event is not yours!');
    }

    return responseWithData(200, true, 'Success get event', event);
  }
