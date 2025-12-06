import { getCategoriesService } from "../services/category.service";
import { NextFunction, Request, Response } from "express";


    export async function getCategoriesController(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await getCategoriesService();
            return res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    }
