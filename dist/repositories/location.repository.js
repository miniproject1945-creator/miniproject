"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocations = getLocations;
const prisma_1 = __importDefault(require("../prisma"));
async function getLocations(query) {
    return await prisma_1.default.location.findMany({
        where: { name: { contains: query.name } },
        skip: (Number(query.page) - 1) * Number(query.limit),
        take: Number(query.limit),
        orderBy: { [query.sort_by]: query.order_by },
    });
}
