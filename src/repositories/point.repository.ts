import prisma from "../prisma";
import { CreatePoint } from "../types/point.type";


    export async function createPoint(data: CreatePoint) {
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



