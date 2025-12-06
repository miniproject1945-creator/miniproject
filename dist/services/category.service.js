"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoriesService = getCategoriesService;
const category_repository_1 = require("../repositories/category.repository");
const response_1 = require("../utils/response");
async function getCategoriesService() {
    const response = await (0, category_repository_1.getCategories)();
    return (0, response_1.responseWithData)(200, true, 'Get categories successfully', response);
}
