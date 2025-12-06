"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByUnique = findUserByUnique;
exports.createUser = createUser;
exports.getAdminEvents = getAdminEvents;
exports.countAdminEvents = countAdminEvents;
exports.getUserProfile = getUserProfile;
exports.findUserByIdIncludePoint = findUserByIdIncludePoint;
const prisma_1 = __importDefault(require("../prisma"));
async function findUserByUnique(identifier) {
    const { email, id, referralCode, username } = identifier;
    let whereCondition = {};
    if (!email && !id && !referralCode && !username) {
        throw new Error('At least on identifier have one property!');
    }
    else {
        whereCondition = Object.assign({}, identifier);
    }
    return await prisma_1.default.user.findUnique({
        where: whereCondition,
        include: { point: true },
    });
}
async function createUser(request) {
    return await prisma_1.default.user.create({ data: request });
}
async function getAdminEvents(id, query) {
    return await prisma_1.default.user.findUnique({
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
async function countAdminEvents(id, query) {
    return await prisma_1.default.user.findUnique({
        where: { id },
        select: {
            _count: {
                select: { events: { where: { name: { contains: query.name } } } },
            },
        },
    });
}
async function getUserProfile(id) {
    return await prisma_1.default.user.findUnique({
        where: { id: id },
        include: {
            vouchers: true,
            point: true,
        },
    });
}
async function findUserByIdIncludePoint(id) {
    return await prisma_1.default.user.findUnique({
        where: { id },
        include: { point: true },
    });
}
