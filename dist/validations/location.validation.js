"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationValidation = void 0;
const zod_1 = require("zod");
class LocationValidation {
}
exports.LocationValidation = LocationValidation;
LocationValidation.QUERY = zod_1.z.object({
    name: zod_1.z.string().optional(),
    page: zod_1.z.coerce
        .number({ invalid_type_error: "Page must be a Number!" })
        .int({ message: "Page must be an integer" })
        .optional(),
    limit: zod_1.z.coerce
        .number({ invalid_type_error: "Limit must be a Number" })
        .int({ message: "Limit must be an Integer" })
        .optional(),
    sort_by: zod_1.z
        .enum(['name'], { message: "sort only allow: 'name'!" })
        .optional(),
    order_by: zod_1.z
        .enum(['asc', 'desc'], { message: "Order mus be 'asc' or 'desc'" })
        .optional(),
});
