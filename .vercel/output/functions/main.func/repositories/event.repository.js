"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = getEvents;
exports.getTotalEvents = getTotalEvents;
exports.getEventsBySearch = getEventsBySearch;
exports.getTotalEventsBySearch = getTotalEventsBySearch;
exports.getEventByIdWithInclude = getEventByIdWithInclude;
exports.getEventById = getEventById;
exports.getEventByIdWithTransaction = getEventByIdWithTransaction;
exports.createEvent = createEvent;
exports.getEventByUser = getEventByUser;
exports.getEventIncludeTransactionWithPagination = getEventIncludeTransactionWithPagination;
exports.countEventTransactions = countEventTransactions;
exports.getEventIncludeCategoryLocation = getEventIncludeCategoryLocation;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
const prisma_1 = __importDefault(require("../prisma"));
async function getEvents(query) {
    const filter = {
        price: query.price ? Number(query.price) : undefined,
        locationId: query.locationId ? Number(query.locationId) : undefined,
        categoryId: query.categoryId ? Number(query.categoryId) : undefined,
        name: query.name ? String(query.name) : undefined,
        startDate: query.startDate
            ? new Date(query.startDate).toISOString()
            : undefined,
        endDate: query.endDate
            ? new Date(query.endDate).toISOString()
            : undefined,
    };
    return await prisma_1.default.event.findMany({
        where: {
            name: { contains: query.name },
            categoryId: filter.categoryId,
            locationId: filter.locationId,
            startDate: filter.startDate || filter.endDate
                ? {
                    ...(filter.startDate && { gte: filter.startDate }),
                    ...(filter.endDate && { lte: filter.endDate }),
                }
                : undefined,
        },
        include: { category: true, location: true },
        orderBy: { createdAt: 'desc' },
        skip: (Number(query.page) - 1) * Number(query.limit),
        take: Number(query.limit),
    });
}
async function getTotalEvents(query) {
    const filter = {
        price: query.price ? Number(query.price) : undefined,
        locationId: query.locationId ? Number(query.locationId) : undefined,
        categoryId: query.categoryId ? Number(query.categoryId) : undefined,
        startDate: query.startDate
            ? new Date(query.startDate).toISOString()
            : undefined,
        endDate: query.endDate
            ? new Date(query.endDate).toISOString()
            : undefined,
    };
    return await prisma_1.default.event.count({
        where: {
            name: filter.name ? { contains: filter.name } : undefined,
            categoryId: filter.categoryId,
            locationId: filter.locationId,
            ...(filter.startDate || filter.endDate
                ? {
                    startDate: {
                        ...(filter.startDate && { gte: filter.startDate }),
                        ...(filter.endDate && { lte: filter.endDate }),
                    },
                }
                : {}),
        },
    });
}
async function getEventsBySearch(query) {
    const filter = {
        name: query.name ? String(query.name) : undefined,
        locationId: query.locationId ? Number(query.locationId) : undefined,
        categoryId: query.categoryId ? Number(query.categoryId) : undefined,
    };
    return await prisma_1.default.event.findMany({
        where: {
            name: { contains: query.name },
            categoryId: filter.categoryId,
            locationId: filter.locationId,
        },
        include: {
            category: { select: { name: true } },
            location: true,
        },
        skip: (Number(query.page) - 1) * Number(query.limit), // Lewati data sejumlah offset
        take: Number(query.limit), // Ambil sejumlah data sesuai limit
    });
}
async function getTotalEventsBySearch(query) {
    const filter = {
        name: query.name ? String(query.name) : undefined,
        locationId: query.locationId ? Number(query.locationId) : undefined,
        categoryId: query.categoryId ? Number(query.categoryId) : undefined,
    };
    return await prisma_1.default.event.count({
        where: {
            name: { contains: filter.name },
            locationId: filter.locationId,
            categoryId: filter.categoryId,
        },
    });
}
async function getEventByIdWithInclude(query) {
    const eventId = Number(query.id);
    return await prisma_1.default.event.findMany({
        where: { id: eventId },
        include: { category: true, location: true, user: true },
    });
}
async function getEventById(id) {
    return await prisma_1.default.event.findUnique({ where: { id } });
}
async function getEventByIdWithTransaction(eventId, userId) {
    return await prisma_1.default.event.findUnique({
        where: { id: eventId },
        include: {
            transactions: { where: { userId }, select: { quantity: true } },
        },
    });
}
async function createEvent(id, request, file) {
    return await prisma_1.default.event.create({
        data: {
            name: request.name,
            price: request.price,
            description: request.description,
            imageURL: `/assets/events/${file.filename}`,
            limitCheckout: request.limitCheckout,
            maxCapacity: request.maxCapacity,
            availableSeats: request.maxCapacity,
            startDate: new Date(request.startDate),
            endDate: new Date(request.endDate),
            user: { connect: { id } },
            location: { connect: { id: request.locationId } },
            category: { connect: { id: request.categoryId } },
        },
    });
}
async function getEventByUser(id) {
    return await prisma_1.default.event.findMany({
        where: { userId: id },
    });
}
async function getEventIncludeTransactionWithPagination(id, query) {
    const { limit, order_by, page, sort_by } = query;
    return await prisma_1.default.event.findUnique({
        where: { id, transactions: { some: { paymentStatus: 'success' } } },
        include: {
            transactions: {
                include: { user: true },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { [sort_by]: order_by },
            },
        },
    });
}
async function countEventTransactions(eventId) {
    return await prisma_1.default.event.findUnique({
        where: { id: eventId },
        select: { _count: { select: { transactions: true } } },
    });
}
async function getEventIncludeCategoryLocation(id) {
    return await prisma_1.default.event.findUnique({
        where: { id },
        include: { category: true, location: true },
    });
}
async function updateEvent(id, eventId, request, file) {
    const data = {};
    if (request.name)
        data['name'] = request.name;
    if (request.price)
        data['price'] = request.price;
    if (request.description)
        data['description'] = request.description;
    if (request.limitCheckout)
        data['limitCheckout'] = request.limitCheckout;
    if (request.maxCapacity)
        data['maxCapacity'] = request.maxCapacity;
    if (request.startDate)
        data['startDate'] = new Date(request.startDate);
    if (request.endDate)
        data['endDate'] = new Date(request.endDate);
    if (request.locationId)
        data['locationId'] = request.locationId;
    if (request.categoryId)
        data['categoryId'] = request.categoryId;
    if (file)
        data['imageURL'] = `/assets/events/${file.filename}`;
    return await prisma_1.default.event.update({
        where: { id: eventId },
        data: data,
    });
}
async function deleteEvent(id) {
    return await prisma_1.default.event.delete({ where: { id } });
}
