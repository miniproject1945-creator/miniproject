import { CategoryController } from "@/controllers/category.controller";
import { Router } from "express";
export class CategoryRouter {
    router;
    categoryController;
    constructor() {
        this.router = Router();
        this.categoryController = new CategoryController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/', this.categoryController.getCategories);
    }
    getRoutes() {
        return this.router;
    }
}
