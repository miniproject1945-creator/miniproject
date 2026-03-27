import { AdminService } from '@/services/admin.service';
export class AdminController {
    async getAdminEvents(req, res, next) {
        try {
            const id = res.locals.decoded.id;
            const query = req.query;
            const response = await AdminService.getAdminEvents(id, query);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getEventTransactions(req, res, next) {
        try {
            const id = res.locals.decoded.id;
            const query = req.query;
            const response = await AdminService.getAdminEventTransactions(id, query);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getTotalSales(req, res, next) {
        try {
            const id = res.locals.decoded.id;
            const query = req.query;
            const response = await AdminService.getAdminTotalSales(id, query);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getTransactionStatus(req, res, next) {
        try {
            const id = res.locals.decoded.id;
            const query = req.query;
            const response = await AdminService.getAdminTransactionStatus(id, query);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
    async updateTransactionStatus(req, res, next) {
        try {
            const id = res.locals.decoded.id;
            const transactionId = req.params.transactionId;
            const request = req.body;
            const response = await AdminService.updateAdminTransactionStatus(id, transactionId, request);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getEventParticipations(req, res, next) {
        try {
            const id = res.locals.decoded.id;
            const eventId = req.params.eventId;
            const query = req.query;
            const response = await AdminService.getAdminEventParticipations(id, eventId, query);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getTransaction(req, res, next) {
        try {
            const id = res.locals.decoded.id;
            const transactionId = req.params.transactionId;
            const response = await AdminService.getTransaction(id, transactionId);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getTransactionDetails(req, res, next) {
        try {
            const id = res.locals.decoded.id;
            const transactionId = req.params.transactionId;
            const response = await AdminService.getTransactionDetails(id, transactionId);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getEvent(req, res, next) {
        try {
            const id = res.locals.decoded.id;
            const eventId = req.params.eventId;
            const response = await AdminService.getEvent(id, eventId);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
}
