import prisma from "../prisma";
import { CreateVoucher } from "../types/voucher.type";


    export async function createVoucher(id: number,data: CreateVoucher) {
        return await prisma.voucher.create({
            data: {
                discount: data.discount,
                maxUsage: data.maxUsage,
                name: data.name,
                event: { connect: { id: data.eventId } },
                user: { connect: { id } },
            },
        });
    }

    export async function findVouchersById(id: number) {
        return await prisma.voucher.findUnique({
            where:{id},
        });
    }

    export async function getVoucherById(id: number, eventId: number) {
        return await prisma.voucher.findMany({
            where: {userId:id, eventId},
        });
    }

    export async function getVouchersByCreator(eventId: number) {
        return await prisma.voucher.findMany({
            where: {eventId},
        });
    }



