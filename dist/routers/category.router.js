"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const category_controller_1 = require("../controllers/category.controller");
const express_1 = require("express");
const CategoryRouter = (0, express_1.Router)();
CategoryRouter.get("/", category_controller_1.getCategoriesController);
exports.default = CategoryRouter;
