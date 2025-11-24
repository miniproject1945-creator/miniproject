import { EventQuery, EventRequest } from '@/types/event.type';
import prisma from '@/prismaClient';
import { AdminEventQueryValidated } from '@/types/admin.type';

export class EventRepository {
  static async getEvents(query: EventQuery) {
    const filter: any = {
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

    return await prisma.event.findMany({
      where: {
        name: { contains: query.name },
        categoryId: filter.categoryId,
        locationId: filter.locationId,
        startDate:
          filter.startDate || filter.endDate
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

  static async getTotalEvents(query: EventQuery) {
    const filter: any = {
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

    return await prisma.event.count({
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

  static async getEventsBySearch(query: EventQuery) {
    const filter: any = {
      name: query.name ? String(query.name) : undefined,
      locationId: query.locationId ? Number(query.locationId) : undefined,
      categoryId: query.categoryId ? Number(query.categoryId) : undefined,
    };

    return await prisma.event.findMany({
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

  static async getTotalEventsBySearch(query: EventQuery) {
    const filter: any = {
      name: query.name ? String(query.name) : undefined,
      locationId: query.locationId ? Number(query.locationId) : undefined,
      categoryId: query.categoryId ? Number(query.categoryId) : undefined,
    };

    return await prisma.event.count({
      where: {
        name: { contains: filter.name },
        locationId: filter.locationId,
        categoryId: filter.categoryId,
      },
    });
  }

  static async getEventByIdWithInclude(query: EventQuery) {
    const eventId = Number(query.id);

    return await prisma.event.findMany({
      where: { id: eventId },
      include: { category: true, location: true, user: true },
    });
  }

  static async getEventById(id: number) {
    return await prisma.event.findUnique({ where: { id } });
  }

  static async getEventByIdWithTransaction(eventId: number, userId: number) {
    return await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        transactions: { where: { userId }, select: { quantity: true } },
      },
    });
  }

  static async createEvent(
    id: number,
    request: EventRequest,
    file: Express.Multer.File,
  ) {
    return await prisma.event.create({
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

  static async getEventByUser(id: number) {
    return await prisma.event.findMany({
      where: { userId: id },
    });
  }

  static async getEventIncludeTransactionWithPagination(
    id: number,
    query: AdminEventQueryValidated,
  ) {
    const { limit, order_by, page, sort_by } = query;

    return await prisma.event.findUnique({
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

  static async countEventTransactions(eventId: number) {
    return await prisma.event.findUnique({
      where: { id: eventId },
      select: { _count: { select: { transactions: true } } },
    });
  }

  static async getEventIncludeCategoryLocation(id: number) {
    return await prisma.event.findUnique({
      where: { id },
      include: { category: true, location: true },
    });
  }

  static async updateEvent(
    id: number,
    eventId: number,
    request: EventRequest,
    file?: Express.Multer.File,
  ) {
    const data: any = {};

    if (request.name) data['name'] = request.name;
    if (request.price) data['price'] = request.price;
    if (request.description) data['description'] = request.description;
    if (request.limitCheckout) data['limitCheckout'] = request.limitCheckout;
    if (request.maxCapacity) data['maxCapacity'] = request.maxCapacity;
    if (request.startDate) data['startDate'] = new Date(request.startDate);
    if (request.endDate) data['endDate'] = new Date(request.endDate);
    if (request.locationId) data['locationId'] = request.locationId;
    if (request.categoryId) data['categoryId'] = request.categoryId;
    if (file) data['imageURL'] = `/assets/events/${file.filename}`;

    return await prisma.event.update({
      where: { id: eventId },
      data: data,
    });
  }

  static async deleteEvent(id: number) {
    return await prisma.event.delete({ where: { id } });
  }
}