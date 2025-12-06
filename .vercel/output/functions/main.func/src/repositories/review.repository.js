import prisma from "@/prisma";
export class ReviewRepository {
    static async createReview(id, data) {
        return await prisma.feedback.create({ data: {
                rating: data.rating,
                message: data.message,
                event: { connect: { id: data.eventId } },
                user: { connect: { id } },
            } });
    }
}
