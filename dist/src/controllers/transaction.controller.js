import { TransactionService } from "@/services/transaction.service";
export class TransactionController {
    async createTransaction(req, res, next) {
        try {
            const id = res.locals.decoded.id;
            const request = req.body;
            const response = await TransactionService.createTransaction(id, request);
            return res.status(201).send(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getEventTransactionsWaiting(req, res, next) {
        try {
            const id = res.locals.decoded.id;
            const response = await TransactionService.getPaymentStatusWaiting(id);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getEventTrasactionsSucces(req, res, next) {
        try {
            const id = res.locals.decoded.id;
            const response = await TransactionService.getPaymentStatusSuccess(id);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getEventTransactionsSuccessByDate(req, res, next) {
        try {
            const id = res.locals.decoded.id;
            const response = await TransactionService.getPaymentStatusSuccessByDate(id);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
    async checkoutUser(req, res, next) {
        try {
            const id = res.locals.decoded.id;
            const transactionId = req.params.transactionId;
            const file = req.file;
            console.log("cek file name", file);
            const response = await TransactionService.checkoutUser(id, transactionId, file);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
}
