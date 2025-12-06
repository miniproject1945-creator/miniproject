import {z} from "zod";

const EventSortEnum = [
    "name",
    "price",
    "availableSeats",
    "startDate",
    "endDate",
    "createdAt",
] as const;

export class UserValidation {
    static EVENT_QUERY = z.object({
        name: z.string().optional(),
        page: z.coerce
        .number({invalid_type_error: "Page must be a Number"})
        .int({message: "page must be an integer"})
        .optional(),
        limit: z.coerce
        .number({invalid_type_error: "limit must be a Number"})
        .int({message:"limit must be an Integer"})
        .optional(),
        sort_by : z
        .enum(EventSortEnum,{
            message: `Sort only allow: '${EventSortEnum.join(', ')}'`,
        })
        .optional(),
        order_by: z
        .enum(["asc","desc"],{message: "Order must be 'asc' or 'dsc'"})
        .optional()
    });

    static EVENT_TRANSACTION_QUERY = z.object({
        page: z.coerce
        .number({invalid_type_error: "Page must be a number"})
        .int({message: "page must be an integer"}),
        sort_by : z
        .enum(['createdAt'],{
            message: `Sort only alloow: 'createdAt'`,
        })
        .optional(),
        order_by: z
        .enum(['asc', 'desc'],{message: "Order must be 'asc' or 'desc'"})
        .optional(),
    });
}

