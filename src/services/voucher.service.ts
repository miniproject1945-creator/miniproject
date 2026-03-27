import prisma from "../prisma";
import { getEventById } from "../repositories/event.repository";
import { createVoucher, getVoucherById, getVouchersByCreator } from "../repositories/voucher.repository";
import { CreateVoucher } from "../types/voucher.type";
import { createCustomError } from "../utils/error";
import { responseWithData, responseWithoutData } from "../utils/response";
import { VoucherValidation } from "../validations/voucher.validation";
import { Validation } from "../validations/validation";


    export async function createVoucherService(id: number, body: CreateVoucher) {
        const {discount, eventId, maxUsage, name} = Validation.validate(
            VoucherValidation.CREATE, 
            body
        );

        const event = await getEventById(eventId);
        console.log("data userId :", event);

        if(!event){
            throw createCustomError(404, 'Event not found');
        }

        if(event.userId !== id){
            throw createCustomError(403, 'You are not authorized to create voucher for this event');
        }

        if(event.price === 0 ){
            throw createCustomError(400, 'Cannot create voucher for free event');
        }

        if(event.maxCapacity < maxUsage){
            throw createCustomError(400, 'Max usage cannot be greater than event max capacity');
        }

        await createVoucher(id, {
            discount,
            eventId,
            maxUsage,
            name,
        });
        return responseWithoutData(201, true, 'Voucher created successfully');
    }

    export async function getVouchersByIdService(id: number, eventId: number) {
        const newEventId = Validation.validate(
            VoucherValidation.EVENT_ID,
            eventId
        );
        const response = await getVoucherById(id, Number(newEventId));

        return responseWithData(200, true, 'Get vouchers successfully', response);
    }

    export async function getVouchersByCreatorService(eventId: number) {
        console.log("ini log servis", eventId);

        const newEventId = Validation.validate(
            VoucherValidation.EVENT_ID,
            eventId
        );
        const response = await getVouchersByCreator(Number(newEventId));  

        return responseWithData(200, true, 'Get vouchers by creator successfully', response);
    }
        


