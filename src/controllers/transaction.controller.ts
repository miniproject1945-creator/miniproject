import { TransactionService } from "@/services/transaction.service";
import { NextFunction, Request, Response } from "express";
import { TransactionCheckout, TransactionRequest } from "@/types/transaction.type";


export class TransactionController {
    public async createTransaction(req: Request, res: Response, next: NextFunction) {
        try {
            const id = res.locals.decoded.id as number;
            const request = req.body as TransactionRequest;
            const response = await TransactionService.createTransaction(id, request);
            return res.status(201).send(response);
        } catch (error) {
            next(error);
        }       

    }

    public async getEventTransactionsWaiting(req: Request, res: Response, next: NextFunction) {
        try {
            const id = res.locals.decoded.id as number; 
            const response = await TransactionService.getPaymentStatusWaiting(id);
            return res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    }

    public async getEventTrasactionsSucces(req: Request, res: Response, next: NextFunction) {
        try {
            const id = res.locals.decoded.id as number; 
            const response = await TransactionService.getPaymentStatusSuccess(id);
            return res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    }

    public async getEventTransactionsSuccessByDate(req: Request, res: Response, next: NextFunction) {
        try {
            const id = res.locals.decoded.id as number; 
            const response = await TransactionService.getPaymentStatusSuccessByDate(id);
            return res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    }

    public async checkoutUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = res.locals.decoded.id as number; 
            const transactionId = req.params.transactionId;
            const file = req.file as Express.Multer.File;

            console.log("cek file name", file);

            const response = await TransactionService.checkoutUser(id, transactionId, file);
            return res.status(200).send(response);
        } catch (error) {
            next(error);
        }
            
    }


}


