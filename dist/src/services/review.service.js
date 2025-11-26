import { ReviewRepository } from "@/repositories/review.repository";
import { ErrorResponse } from "@/utils/error";
import { responseWithoutData } from "@/utils/response";
import { ReviewValidation } from "@/validations/review.validation";
import { Validation } from "@/validations/validation";
export class ReviewService {
    static async createReview(id, data) {
        const reviewData = Validation.validate(ReviewValidation.CREATE, data);
        if (!reviewData.rating) {
            throw new ErrorResponse(400, 'Rating is required');
        }
        await ReviewRepository.createReview(id, reviewData);
        return responseWithoutData(201, true, 'Review created successfully');
    }
}
