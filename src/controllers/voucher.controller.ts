import { createVoucherService, getVouchersByCreatorService, getVouchersByIdService } from "@/services/voucher.service";
import { CreateVoucher } from "@/types/voucher.type";
import { Request, Response, NextFunction } from "express";


    export async function createVoucherController(req: Request, res: Response, next: NextFunction) {
        try {
            const id = res.locals.decoded.id as number;
            const body = req.body as CreateVoucher;

            const response = await createVoucherService(id, body);
            return res.status(201).send(response);
        } catch (error) {
            next(error);
        }
    }

    export async function getVoucherByIdController(req: Request, res: Response, next: NextFunction) {
        try {
            const id = res.locals.decoded.id as number;

            const eventId = Number(req.params.eventId);
            const response = await getVouchersByIdService(id, eventId);
            return res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    }

    export async function getVouchersByCreatorController(req: Request, res: Response, next: NextFunction) {
        try {
            const eventId = Number(req.params.eventId);

            const response = await getVouchersByCreatorService(eventId);
            return res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    }





