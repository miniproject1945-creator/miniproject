import prisma from "@/prisma";
export class PointRepository {
    static async createPoint(data) {
        return await prisma.point.create({
            data: {
                balance: data.balance,
                expiryDate: data.expiryDate,
                user: {
                    connect: { id: data.userId },
                },
            },
        });
    }
}
