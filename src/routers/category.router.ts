import { getCategoriesController } from "../controllers/category.controller";
import { Router } from "express";


const CategoryRouter = Router();

CategoryRouter.get("/", getCategoriesController);

export default CategoryRouter;
