import prisma from '../prisma';
import { RegisterRequest } from '../types/auth.type';
import { UniqueUserField } from '../types/user.type';
import { AdminEventQuery } from '../types/admin.type';


  export async function findUserByUnique(identifier: UniqueUserField) {
    const { email, id, referralCode, username } = identifier;

    let whereCondition: any = {};
    if (!email && !id && !referralCode && !username) {
      throw new Error('At least on identifier have one property!');
    } else {
      whereCondition = { ...identifier };
    }

    return await prisma.user.findUnique({
      where: whereCondition,
      include: { point: true },
    });
  }

  export async function createUser(request: RegisterRequest) {
    return await prisma.user.create({ data: request });
  }

  export async function getAdminEvents(id: number, query: AdminEventQuery) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        events: {
          include: { category: true, location: true },
          where: { name: { contains: query.name } },
          skip: (Number(query.page) - 1) * Number(query.limit),
          take: Number(query.limit),
          orderBy: { [query.sort_by!]: query.order_by },
        },
      },
    });
  }

  export async function countAdminEvents(id: number, query: AdminEventQuery) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        _count: {
          select: { events: { where: { name: { contains: query.name } } } },
        },
      },
    });
  }

  export async function getUserProfile(id: number) {
    return await prisma.user.findUnique({
      where: { id: id },
      include: {
        vouchers: true,
        point: true,
      },
    });
  }

  export async function findUserByIdIncludePoint(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      include: { point: true },
    });
  }
