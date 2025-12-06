import { PaymentStatus } from '@/types/transaction.type';
import { z } from 'zod';
const EventSortEnum = [
    'name',
    'price',
    'availableSeats',
    'startDate',
    'endDate',
    'createdAt',
];
export class AdminValidation {
    static EVENT_QUERY = z.object({
        name: z.string().optional(),
        page: z.coerce
            .number({ invalid_type_error: 'Page must be a Number!' })
            .int({ message: 'Page must be an integer' })
            .optional(),
        limit: z.coerce
            .number({ invalid_type_error: 'Limit must be a Number!' })
            .int({ message: 'Limit must be an integer' })
            .optional(),
        sort_by: z
            .enum(EventSortEnum, {
            message: `Sort only allow: '${EventSortEnum.join(', ')}'`,
        })
            .optional(),
        order_by: z
            .enum(['asc', 'desc'], { message: "Order must be 'asc' or 'desc'" })
            .optional(),
    });
    static EVENT_TRANSACTION_QUERY = z.object({
        page: z.coerce
            .number({ invalid_type_error: 'Page must be a Number!' })
            .int({ message: 'Page must be an integer' })
            .optional(),
        limit: z.coerce
            .number({ invalid_type_error: 'Limit must be a Number!' })
            .int({ message: 'Limit must be an integer' })
            .optional(),
        sort_by: z
            .enum(['createdAt'], {
            message: `Sort only allow: 'createdAt'`,
        })
            .optional(),
        order_by: z
            .enum(['asc', 'desc'], { message: "Order must be 'asc' or 'desc'" })
            .optional(),
    });
    static FILTER_QUERY = z
        .object({
        start_date: z.coerce
            .date({ invalid_type_error: 'Start date must be a date' })
            .refine((date) => new Date(date) < new Date(), {
            message: 'Start date cannot be in the future',
        })
            .optional(),
        end_date: z.coerce
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
    static UPDATE_TRANSACTION_STATUS = z.object({
        status: z.enum([PaymentStatus.SUCCESS, PaymentStatus.FAILED], {
            message: "Status must be 'success' or 'failed'",
        }),
    });
}
