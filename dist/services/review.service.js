"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewService = createReviewService;
const review_repository_1 = require("../repositories/review.repository");
const error_1 = require("../utils/error");
const response_1 = require("../utils/response");
const review_validation_1 = require("../validations/review.validation");
const validation_1 = require("../validations/validation");
async function createReviewService(id, data) {
    const reviewData = validation_1.Validation.validate(review_validation_1.ReviewValidation.CREATE, data);
    if (!reviewData.rating) {
        throw (0, error_1.createCustomError)(400, 'Rating is required');
    }
    await (0, review_repository_1.createReview)(id, reviewData);
    return (0, response_1.responseWithoutData)(201, true, 'Review created successfully');
}
