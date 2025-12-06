"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidation = void 0;
const transaction_type_1 = require("../types/transaction.type");
const zod_1 = require("zod");
const EventSortEnum = [
    'name',
    'price',
    'availableSeats',
    'startDate',
    'endDate',
    'createdAt',
];
class AdminValidation {
}
exports.AdminValidation = AdminValidation;
AdminValidation.EVENT_QUERY = zod_1.z.object({
    name: zod_1.z.string().optional(),
    page: zod_1.z.coerce
        .number({ invalid_type_error: 'Page must be a Number!' })
        .int({ message: 'Page must be an integer' })
        .optional(),
    limit: zod_1.z.coerce
        .number({ invalid_type_error: 'Limit must be a Number!' })
        .int({ message: 'Limit must be an integer' })
        .optional(),
    sort_by: zod_1.z
        .enum(EventSortEnum, {
        message: `Sort only allow: '${EventSortEnum.join(', ')}'`,
    })
        .optional(),
    order_by: zod_1.z
        .enum(['asc', 'desc'], { message: "Order must be 'asc' or 'desc'" })
        .optional(),
});
AdminValidation.EVENT_TRANSACTION_QUERY = zod_1.z.object({
    page: zod_1.z.coerce
        .number({ invalid_type_error: 'Page must be a Number!' })
        .int({ message: 'Page must be an integer' })
        .optional(),
    limit: zod_1.z.coerce
        .number({ invalid_type_error: 'Limit must be a Number!' })
        .int({ message: 'Limit must be an integer' })
        .optional(),
    sort_by: zod_1.z
        .enum(['createdAt'], {
        message: `Sort only allow: 'createdAt'`,
    })
        .optional(),
    order_by: zod_1.z
        .enum(['asc', 'desc'], { message: "Order must be 'asc' or 'desc'" })
        .optional(),
});
AdminValidation.FILTER_QUERY = zod_1.z
    .object({
    start_date: zod_1.z.coerce
        .date({ invalid_type_error: 'Start date must be a date' })
        .refine((date) => new Date(date) < new Date(), {
        message: 'Start date cannot be in the future',
    })
        .optional(),
    end_date: zod_1.z.coerce
        .date({ invalid_type_error: 'End date must be a date' })
        .refine((date) => new Date(date) < new Date(), {
        message: 'End date cannot be in the future',
    })
        .optional(),
})
    .refine((data) => {
    if (data.start_date && data.end_date) {
        return new Date(data.end_date) >= new Date(data.start_date);
    }
    return true;
}, {
    message: 'End date must be greater than start date',
    path: ['end_date'],
});
AdminValidation.UPDATE_TRANSACTION_STATUS = zod_1.z.object({
    status: zod_1.z.enum([transaction_type_1.PaymentStatus.SUCCESS, transaction_type_1.PaymentStatus.FAILED], {
        message: "Status must be 'success' or 'failed'",
    }),
});
