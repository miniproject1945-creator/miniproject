import { VoucherController } from "@/controllers/voucher.controller";
import { Router } from "express";
import { adminGuard, verifyToken } from "@/middlewares/auth.middleware";

export class voucherRouter {
    private router: Router;
    private voucherController: VoucherController;  
    
    constructor() {
        this.router = Router();
        this.voucherController = new VoucherController();
        this.initializeRoutes();
    }
    private initializeRoutes(): void {
        this.router.post(
            "/",    
            verifyToken,
            adminGuard,
            this.voucherController.createVoucher,
        );

        this.router.get(
            "/:eventId",
            verifyToken,
            this.voucherController.getVoucherById,
        );

        this.router.get(
            "/:voucher-creator/:eventId",
            this.voucherController.getVouchersByCreator,
        );
    }
    public getRouter(): Router {
        return this.router;
    }   
}




