"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVoucher = createVoucher;
exports.findVouchersById = findVouchersById;
exports.getVoucherById = getVoucherById;
exports.getVouchersByCreator = getVouchersByCreator;
const prisma_1 = __importDefault(require("../prisma"));
async function createVoucher(id, data) {
    return await prisma_1.default.voucher.create({
        data: {
            discount: data.discount,
            maxUsage: data.maxUsage,
            name: data.name,
            event: { connect: { id: data.eventId } },
            user: { connect: { id } },
        },
    });
}
async function findVouchersById(id) {
    return await prisma_1.default.voucher.findUnique({
        where: { id },
    });
}
async function getVoucherById(id, eventId) {
    return await prisma_1.default.voucher.findMany({
        where: { userId: id, eventId },
    });
}
async function getVouchersByCreator(eventId) {
    return await prisma_1.default.voucher.findMany({
        where: { eventId },
    });
}
