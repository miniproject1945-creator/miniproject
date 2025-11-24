import prisma from "@/prismaClient";
import { CreateFeedback } from "@/types/review.type";
import { connect } from "http2";

export class ReviewRepository {
    static async createReview(id: number,data: CreateFeedback) {
        return await prisma.review.create({ data: {
            rating: data.rating,
            message: data.message,
            event: {connect: {id: data.eventId}},
            user: {connect: {id}},
        } });
    }

}