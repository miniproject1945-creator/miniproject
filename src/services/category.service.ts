import { getCategories } from "../repositories/category.repository";
import { responseWithData } from "../utils/response";


    export async function getCategoriesService() {
        const response =  await getCategories();
        return responseWithData(200,true, 'Get categories successfully', response);
    }   




