"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPoint = createPoint;
const prisma_1 = __importDefault(require("../prisma"));
async function createPoint(data) {
    return await prisma_1.default.point.create({
        data: {
            balance: data.balance,
            expiryDate: data.expiryDate,
            user: {
                connect: { id: data.userId },
            },
        },
    });
}
