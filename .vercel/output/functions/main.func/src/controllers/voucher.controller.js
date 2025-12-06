import { VoucherService } from "@/services/voucher.service";
export class VoucherController {
    async createVoucher(req, res, next) {
        try {
            const id = res.locals.decoded.id;
            const body = req.body;
            const response = await VoucherService.createVoucher(id, body);
            return res.status(201).send(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getVoucherById(req, res, next) {
        try {
            const id = res.locals.decoded.id;
            const eventId = Number(req.params.eventId);
            const response = await VoucherService.getVouchersById(id, eventId);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getVouchersByCreator(req, res, next) {
        try {
            const eventId = Number(req.params.eventId);
            const response = await VoucherService.getVouchersByCreator(eventId);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
}
