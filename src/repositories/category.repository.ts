import prisma from "@/prisma";

    export async function getCategories() {
        return await prisma.category.findMany();
    }

