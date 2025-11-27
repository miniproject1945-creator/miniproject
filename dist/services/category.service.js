import { CategoryRepository } from "@/repositories/category.repository";
import { responseWithData } from "@/utils/response";
export class CategoryService {
    static async getCategories() {
        const response = await CategoryRepository.getCategories();
        return responseWithData(200, true, 'Get categories successfully', response);
    }
}
