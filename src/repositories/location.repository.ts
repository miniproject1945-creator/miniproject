import prisma from "@/prisma";
import { LocationQuerry } from "@/types/location.type";


export class LocationRepository {
    static async getLocations(query: LocationQuerry) {
        return await prisma.location.findMany({
            where: {name:{ contains: query.name }},
            skip: (Number(query.page) - 1) * Number(query.limit),
            take: Number(query.limit),
            orderBy: {[query.sort_by!]: query.order_by},
        })}}


