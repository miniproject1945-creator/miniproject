import { TransactionController } from "@/controllers/transaction.controller";
import { userGuard, verifyToken } from "@/middlewares/auth.middleware";
import { Router } from "express";
import { uploader } from "@/middlewares/uplouder.middleware";
export class transactionRouter {
    router;
    transactionController;
    constructor() {
        this.router = Router();
        this.transactionController = new TransactionController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/waiting", verifyToken, userGuard, this.transactionController.getEventTransactionsWaiting);
        this.router.get("/success", verifyToken, userGuard, this.transactionController.getEventTrasactionsSucces);
        this.router.get("/finish", verifyToken, userGuard, this.transactionController.getEventTransactionsSuccessByDate);
        this.router.post("/", verifyToken, userGuard, this.transactionController.createTransaction);
        this.router.patch("/:transactionId", verifyToken, userGuard, uploader("/transactions", "TRANS").single("paymentProof"), this.transactionController.checkoutUser);
    }
    getRouter() {
        return this.router;
    }
}
