"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoriesController = getCategoriesController;
const category_service_1 = require("../services/category.service");
async function getCategoriesController(req, res, next) {
    try {
        const response = await (0, category_service_1.getCategoriesService)();
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
