import { VoucherService } from "@/services/voucher.service";
import { CreateVoucher } from "@/types/voucher.type";
import { Request, Response, NextFunction } from "express";

export class VoucherController {
    public async createVoucher(req: Request, res: Response, next: NextFunction) {
        try {
            const id = res.locals.decoded.id as number;
            const body = req.body as CreateVoucher;

            const response = await VoucherService.createVoucher(id, body);
            return res.status(201).send(response);
        } catch (error) {
            next(error);
        }
    }

    public async getVoucherById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = res.locals.decoded.id as number;

            const eventId = req.params.eventId;
            const response = await VoucherService.getVouchersById(id, eventId);
            return res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    }

    public async getVouchersByCreator(req: Request, res: Response, next: NextFunction) {
        try {
            const eventId = req.params.eventId;

            const response = await VoucherService.getVouchersByCreator(eventId);
            return res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    }
}




