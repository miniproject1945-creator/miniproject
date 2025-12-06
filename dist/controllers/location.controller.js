"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocationsController = getLocationsController;
const location_service_1 = require("../services/location.service");
async function getLocationsController(req, res, next) {
    try {
        const query = req.query;
        const response = await (0, location_service_1.getLocationsService)(query);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
