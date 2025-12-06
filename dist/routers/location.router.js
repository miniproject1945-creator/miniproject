"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const location_controller_1 = require("../controllers/location.controller");
const express_1 = require("express");
const locationRouter = (0, express_1.Router)();
locationRouter.get("/", location_controller_1.getLocationsController);
exports.default = locationRouter;
