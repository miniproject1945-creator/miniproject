import { checkoutUserController, createTransactionController, getEventTransactionsSuccessByDateController, getEventTrasactionsSuccesController } from "@/controllers/transaction.controller";
import { adminGuard, userGuard, verifyToken } from "@/middlewares/auth.middleware";
import { Router } from "express";
import { uploader } from "@/middlewares/uplouder.middleware";
import { getEventTransactionsController } from "@/controllers/admin.controller";

const transactionRouter = Router();

transactionRouter.get("/waiting", verifyToken, userGuard, getEventTransactionsController);
transactionRouter.get("/success", verifyToken, userGuard,getEventTrasactionsSuccesController);
transactionRouter.get("/finish", verifyToken, userGuard, getEventTransactionsSuccessByDateController);
transactionRouter.post("/", verifyToken, userGuard, createTransactionController);
transactionRouter.patch("/:transactionId", 
    verifyToken, 
    userGuard,
    uploader("/transactions","TRANS").single("paymentProof"),
    checkoutUserController,
)

export default transactionRouter;