import { getAdminEventsController, getEventController, getEventParticipationsController, getEventTransactionsController, getTotalSalesController, getTransactionController, getTransactionDetailsController, getTransactionStatusController } from '../controllers/admin.controller';
import { adminGuard, verifyToken } from '../middlewares/auth.middleware';
import { Router } from 'express';

const AdminRouter = Router();

AdminRouter.get("/events", verifyToken,adminGuard,getAdminEventsController);
AdminRouter.get("/events/transactios",verifyToken,adminGuard, getEventTransactionsController);
AdminRouter.get("/events/:eventId",verifyToken, adminGuard, getEventController);
AdminRouter.get("events/:eventId/participations", verifyToken, adminGuard, getEventParticipationsController);
AdminRouter.get("/total-sales", verifyToken, adminGuard, getTotalSalesController);
AdminRouter.get("/transaction-status", verifyToken, adminGuard, getTransactionStatusController);
AdminRouter.get("/transaction/:transactionId", verifyToken, adminGuard, getTransactionController);
AdminRouter.get("/transaction/:transactionId/details", verifyToken, adminGuard, getTransactionDetailsController);
AdminRouter.get("transaction/:transactionId/status", verifyToken, adminGuard, getTransactionStatusController);

export default AdminRouter;