
import { createReview } from "@/repositories/review.repository";
import { CreateFeedback } from "@/types/review.type";
import { createCustomError } from "@/utils/error";
import { responseWithoutData } from "@/utils/response";
import { ReviewValidation } from "@/validations/review.validation";
import { Validation } from "@/validations/validation";


    export async function createReviewService(id: number, data: CreateFeedback) {
        const reviewData = Validation.validate(ReviewValidation.CREATE, data);
        if(!reviewData.rating){
            throw createCustomError(400, 'Rating is required');
        }
        await createReview(id, reviewData);

        return responseWithoutData(201,true, 'Review created successfully');
    }               


