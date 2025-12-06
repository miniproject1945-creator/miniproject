"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocationsService = getLocationsService;
const location_repository_1 = require("../repositories/location.repository");
const response_1 = require("../utils/response");
const location_validation_1 = require("../validations/location.validation");
const validation_1 = require("../validations/validation");
async function getLocationsService(query) {
    let locationQuery = validation_1.Validation.validate(location_validation_1.LocationValidation.QUERY, query);
    if (!locationQuery.page)
        locationQuery.page = 1;
    if (!locationQuery.limit)
        locationQuery.limit = 10;
    if (!locationQuery.sort_by)
        locationQuery.sort_by = 'name';
    if (!locationQuery.order_by)
        locationQuery.order_by = 'asc';
    const locations = await (0, location_repository_1.getLocations)(locationQuery);
    return (0, response_1.responseWithData)(200, true, 'Get locations successfully', locations);
}
