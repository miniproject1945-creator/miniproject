"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = createReview;
const prisma_1 = __importDefault(require("../prisma"));
async function createReview(id, data) {
    return await prisma_1.default.feedback.create({ data: {
            rating: data.rating,
            message: data.message,
            event: { connect: { id: data.eventId } },
            user: { connect: { id } },
        } });
}
