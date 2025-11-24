import { NextFunction, Request, Response } from "express";
import { CreateFeedback } from "@/types/review.type";
import { ReviewService } from "@/services/review.service";

export class ReviewController {
    public async createFeedback(req: Request, res: Response, next: NextFunction) {
        try {
            const id = res.locals.decoded.id as number;
            const request = req.body as CreateFeedback; 

            const response = await ReviewService.createReview(id, request);
            return res.status(201).send(response);
        } catch (error) {
            next(error);
        }       
    }
}


