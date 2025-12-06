import { NextFunction, Request, Response } from "express";
import { CreateFeedback } from "@/types/review.type";
import { createReviewService } from "@/services/review.service";


    export async function createFeedbackController(req: Request, res: Response, next: NextFunction) {
        try {
            const id = res.locals.decoded.id as number;
            const request = req.body as CreateFeedback; 

            const response = await createReviewService(id, request);
            return res.status(201).send(response);
        } catch (error) {
            next(error);
        }       
    }



