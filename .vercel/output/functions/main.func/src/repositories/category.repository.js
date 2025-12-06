import prisma from "@/prisma";
export class CategoryRepository {
    static async getCategories() {
        return await prisma.category.findMany();
    }
}
