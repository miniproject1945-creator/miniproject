import { createVoucherController, getVoucherByIdController, getVouchersByCreatorController } from "../controllers/voucher.controller";
import { Router } from "express";
import { adminGuard, verifyToken } from "../middlewares/auth.middleware";


const voucherRouter = Router();

voucherRouter.post("/",verifyToken, adminGuard, createVoucherController);
voucherRouter.get("/:eventId", verifyToken, getVoucherByIdController);
voucherRouter.get("/:voucher-creator/:eventId", getVouchersByCreatorController);

export default voucherRouter;




