"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFeedbackController = createFeedbackController;
const review_service_1 = require("../services/review.service");
async function createFeedbackController(req, res, next) {
    try {
        const id = res.locals.decoded.id;
        const request = req.body;
        const response = await (0, review_service_1.createReviewService)(id, request);
        return res.status(201).send(response);
    }
    catch (error) {
        next(error);
    }
}
