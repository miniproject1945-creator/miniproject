import prisma from "@/prisma";
import { CreateFeedback } from "@/types/review.type";
import { connect } from "http2";

export class ReviewRepository {
    static async createReview(id: number,data: CreateFeedback) {
        return await prisma.feedback.create({ data: {
            rating: data.rating,
            message: data.message,
            event: {connect: {id: data.eventId}},
            user: {connect: {id}},
        } });
    }

}