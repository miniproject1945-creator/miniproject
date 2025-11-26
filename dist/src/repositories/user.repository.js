import prisma from '@/prisma';
export class UserRepository {
    static async findUserByUnique(identifier) {
        const { email, id, referralCode, username } = identifier;
        let whereCondition = {};
        if (!email && !id && !referralCode && !username) {
            throw new Error('At least on identifier have one property!');
        }
        else {
            whereCondition = { ...identifier };
        }
        return await prisma.user.findUnique({
            where: whereCondition,
            include: { point: true },
        });
    }
    static async createUser(request) {
        return await prisma.user.create({ data: request });
    }
    static async getAdminEvents(id, query) {
        return await prisma.user.findUnique({
            where: { id },
            include: {
                events: {
                    include: { category: true, location: true },
                    where: { name: { contains: query.name } },
                    skip: (Number(query.page) - 1) * Number(query.limit),
                    take: Number(query.limit),
                    orderBy: { [query.sort_by]: query.order_by },
                },
            },
        });
    }
    static async countAdminEvents(id, query) {
        return await prisma.user.findUnique({
            where: { id },
            select: {
                _count: {
                    select: { events: { where: { name: { contains: query.name } } } },
                },
            },
        });
    }
    static async getUserProfile(id) {
        return await prisma.user.findUnique({
            where: { id: id },
            include: {
                vouchers: true,
                point: true,
            },
        });
    }
    static async findUserByIdIncludePoint(id) {
        return await prisma.user.findUnique({
            where: { id },
            include: { point: true },
        });
    }
}
