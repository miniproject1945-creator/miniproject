import prisma from "@/prismaClient";
import { EventRepository } from "@/repositories/event.repository";
import { VoucherRepository } from "@/repositories/voucher.repository";
import { CreateVoucher } from "@/types/voucher.type";
import { ErrorResponse } from "@/utils/error";
import { responseWithData, responseWithoutData } from "@/utils/response";
import { VoucherValidation } from "@/validations/voucher.validation";
import { Validation } from "@/validations/validation";

export class VoucherService {
    static async createVoucher(id: number, body: CreateVoucher) {
        const {discount, eventId, maxUsage, name} = Validation.validate(
            VoucherValidation.CREATE, 
            body
        );

        const event = await EventRepository.getEventById({eventId});
        console.log("data userId :", event);

        if(!event){
            throw new ErrorResponse(404, 'Event not found');
        }

        if(event.userId !== id){
            throw new ErrorResponse(403, 'You are not authorized to create voucher for this event');
        }

        if(event.price === 0 ){
            throw new ErrorResponse(400, 'Cannot create voucher for free event');
        }

        if(event.maxCapacity < maxUsage){
            throw new ErrorResponse(400, 'Max usage cannot be greater than event max capacity');
        }

        await VoucherRepository.createVoucher(id, {
            discount,
            eventId,
            maxUsage,
            name,
        });
        return responseWithoutData(201, true, 'Voucher created successfully');
    }

    static async getVouchersById(id: number, eventId: number) {
        const newEventId = Validation.validate(
            VoucherValidation.EVENT_ID,
            eventId
        );
        const response = await VoucherRepository.getVoucherById(id, Number(newEventId));

        return responseWithData(200, true, 'Get vouchers successfully', response);
    }

    static async getVouchersByCreator(eventId: number) {
        console.log("ini log servis", eventId);

        const newEventId = Validation.validate(
            VoucherValidation.EVENT_ID,
            eventId
        );
        const response = await VoucherRepository.getVouchersByCreator(Number(newEventId));  

        return responseWithData(200, true, 'Get vouchers by creator successfully', response);
    }
        

}

