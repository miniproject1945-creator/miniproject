import { AdminController } from '@/controllers/admin.controller';
import { adminGuard, verifyToken } from '@/middlewares/auth.middleware';
import { Router } from 'express';
export class AdminRouter {
    router;
    adminController;
    constructor() {
        this.router = Router();
        this.adminController = new AdminController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/events', verifyToken, adminGuard, this.adminController.getAdminEvents);
        this.router.get('/events/transactions', verifyToken, adminGuard, this.adminController.getEventTransactions);
        this.router.get('/events/:eventId', verifyToken, adminGuard, this.adminController.getEvent);
        this.router.get('/events/:eventId/participations', verifyToken, adminGuard, this.adminController.getEventParticipations);
        this.router.get('/total-sales', verifyToken, adminGuard, this.adminController.getTotalSales);
        this.router.get('/transaction-status', verifyToken, adminGuard, this.adminController.getTransactionStatus);
        this.router.get('/transactions/:transactionId', verifyToken, adminGuard, this.adminController.getTransaction);
        this.router.get('/transactions/:transactionId/details', verifyToken, adminGuard, this.adminController.getTransactionDetails);
        this.router.patch('/transactions/:transactionId/status', verifyToken, adminGuard, this.adminController.updateTransactionStatus);
    }
    getRoutes() {
        return this.router;
    }
}
