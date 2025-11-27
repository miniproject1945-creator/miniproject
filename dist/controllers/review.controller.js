import { ReviewService } from "@/services/review.service";
export class ReviewController {
    async createFeedback(req, res, next) {
        try {
            const id = res.locals.decoded.id;
            const request = req.body;
            const response = await ReviewService.createReview(id, request);
            return res.status(201).send(response);
        }
        catch (error) {
            next(error);
        }
    }
}
