import { 
    createTransactionService,
    getPaymentStatusWaitingService,
    getPaymentStatusSuccessService,
    getPaymentStatusSuccessByDateService,
    checkoutUserService,

 } from "../services/transaction.service";
import { NextFunction, Request, Response } from "express";
import { TransactionRequest } from "../types/transaction.type";



    export async function createTransactionController(req: Request, res: Response, next: NextFunction) {
        try {
            const id = res.locals.decoded.id as number;
            const request = req.body as TransactionRequest;
            const response = await createTransactionService(id, request);
            return res.status(201).send(response);
        } catch (error) {
            next(error);
        }       

    }

    export async function getEventTransactionsWaitingController(req: Request, res: Response, next: NextFunction) {
        try {
            const id = res.locals.decoded.id as number; 
            const response = await getPaymentStatusWaitingService(id);
            return res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    }

    export async function getEventTrasactionsSuccesController(req: Request, res: Response, next: NextFunction) {
        try {
            const id = res.locals.decoded.id as number; 
            const response = await getPaymentStatusSuccessService(id);
            return res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    }

    export async function getEventTransactionsSuccessByDateController(req: Request, res: Response, next: NextFunction) {
        try {
            const id = res.locals.decoded.id as number; 
            const response = await getPaymentStatusSuccessByDateService(id);
            return res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    }

    export async function checkoutUserController(req: Request, res: Response, next: NextFunction) {
        try {
            const id = res.locals.decoded.id as number; 
            const transactionId = req.params.transactionId;
            const file = req.file as Express.Multer.File;

            console.log("cek file name", file);

            const response = await checkoutUserService(id, transactionId, file);
            return res.status(200).send(response);
        } catch (error) {
            next(error);
        }
            
    }




