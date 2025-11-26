import prisma from "@/prisma";
export class VoucherRepository {
    static async createVoucher(id, data) {
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
    static async findVouchersById(id) {
        return await prisma.voucher.findUnique({
            where: { id },
        });
    }
    static async getVoucherById(id, eventId) {
        return await prisma.voucher.findMany({
            where: { userId: id, eventId },
        });
    }
    static async getVouchersByCreator(eventId) {
        return await prisma.voucher.findMany({
            where: { eventId },
        });
    }
}
