import { 
  getAdminEventsService, 
  getAdminEventTransactionsService, 
  getAdminTotalSalesService, 
  getAdminTransactionStatusService, 
  updateAdminTransactionStatusService,
  getAdminEventParticipationsService,
  getEventService,
  getTransactionDetailsService,
  getTransactionService,
} from '@/services/admin.service';
import {
  AdminEventQuery,
  AdminEventTransactionQuery,
  FilterDate,
} from '@/types/admin.type';
import { TransactionStatus } from '@/types/transaction.type';
import { NextFunction, Request, Response } from 'express';


  export async function getAdminEventsController(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id as number;
      const query = req.query as AdminEventQuery;

      const response = await getAdminEventsService(id, query);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  export async function getEventTransactionsController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = res.locals.decoded.id as number;
      const query = req.query as AdminEventTransactionQuery;

      const response = await getAdminEventTransactionsService(id, query);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  export async function getTotalSalesController(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id as number;
      const query = req.query as FilterDate;

      const response = await getAdminTotalSalesService(id, query);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  export async function getTransactionStatusController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = res.locals.decoded.id as number;
      const query = req.query as FilterDate;

      const response = await getAdminTransactionStatusService(id, query);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  export async function updateTransactionStatusController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = res.locals.decoded.id as number;
      const transactionId = req.params.transactionId;
      const request = req.body as TransactionStatus;

      const response = await updateAdminTransactionStatusService(
        id,
        transactionId,
        request,
      );
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  export async function getEventParticipationsController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = res.locals.decoded.id as number;
      const eventId = req.params.eventId;
      const query = req.query as AdminEventQuery;

      const response = await getAdminEventParticipationsService(
        id,
        eventId,
        query,
      );
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  export async function getTransactionController(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id as number;
      const transactionId = req.params.transactionId;

      const response = await getTransactionService(id, transactionId);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  export async function getTransactionDetailsController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = res.locals.decoded.id as number;
      const transactionId = req.params.transactionId;

      const response = await getTransactionDetailsService(
        id,
        transactionId,
      );
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  export async function getEventController(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id as number;
      const eventId = req.params.eventId;

      const response = await getEventService(id, eventId);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }
