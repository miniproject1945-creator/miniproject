import { CategoryService } from "@/services/category.service";
import { NextFunction, Request, Response } from "express";

export class CategoryController {
    public async getCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await CategoryService.getCategories();
            return res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    }
}