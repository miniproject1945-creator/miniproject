import prisma from "@/prismaClient";

export class CategoryRepository {
    static async getCategories() {
        return await prisma.category.findMany();
    }
}
