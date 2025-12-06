import { VoucherController } from "@/controllers/voucher.controller";
import { Router } from "express";
import { adminGuard, verifyToken } from "@/middlewares/auth.middleware";
export class voucherRouter {
    router;
    voucherController;
    constructor() {
        this.router = Router();
        this.voucherController = new VoucherController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/", verifyToken, adminGuard, this.voucherController.createVoucher);
        this.router.get("/:eventId", verifyToken, this.voucherController.getVoucherById);
        this.router.get("/:voucher-creator/:eventId", this.voucherController.getVouchersByCreator);
    }
    getRouter() {
        return this.router;
    }
}
