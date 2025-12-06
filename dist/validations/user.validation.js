"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const EventSortEnum = [
    "name",
    "price",
    "availableSeats",
    "startDate",
    "endDate",
    "createdAt",
];
class UserValidation {
}
exports.UserValidation = UserValidation;
UserValidation.EVENT_QUERY = zod_1.z.object({
    name: zod_1.z.string().optional(),
    page: zod_1.z.coerce
        .number({ invalid_type_error: "Page must be a Number" })
        .int({ message: "page must be an integer" })
        .optional(),
    limit: zod_1.z.coerce
        .number({ invalid_type_error: "limit must be a Number" })
        .int({ message: "limit must be an Integer" })
        .optional(),
    sort_by: zod_1.z
        .enum(EventSortEnum, {
        message: `Sort only allow: '${EventSortEnum.join(', ')}'`,
    })
        .optional(),
    order_by: zod_1.z
        .enum(["asc", "desc"], { message: "Order must be 'asc' or 'dsc'" })
        .optional()
});
UserValidation.EVENT_TRANSACTION_QUERY = zod_1.z.object({
    page: zod_1.z.coerce
        .number({ invalid_type_error: "Page must be a number" })
        .int({ message: "page must be an integer" }),
    sort_by: zod_1.z
        .enum(['createdAt'], {
        message: `Sort only alloow: 'createdAt'`,
    })
        .optional(),
    order_by: zod_1.z
        .enum(['asc', 'desc'], { message: "Order must be 'asc' or 'desc'" })
        .optional(),
});
