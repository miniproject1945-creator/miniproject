import { CategoryController } from "@/controllers/category.controller";
import { Router } from "express";

export class CategoryRouter {
    private router: Router;
    private categoryController: CategoryController;

    constructor() {
        this.router = Router();
        this.categoryController = new CategoryController();
        this.initializeRoutes();
    }   
    private initializeRoutes(): void {
        this.router.get(
            '/',
            this.categoryController.getCategories,
        );
    }
    public getRoutes(): Router {
        return this.router;
    }
}


