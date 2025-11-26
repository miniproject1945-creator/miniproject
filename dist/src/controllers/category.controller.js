import { CategoryService } from "@/services/category.service";
export class CategoryController {
    async getCategories(req, res, next) {
        try {
            const response = await CategoryService.getCategories();
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
}
