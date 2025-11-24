import {z} from "zod";

export class LocationValidation{
    static QUERY = z.object({
        name: z.string().optional(),
        page: z.coerce
        .number({invalid_type_error: "Page must be a Number!"})
        .int({message: "Page must be an integer"})
        .optional(),
        limit: z.coerce
        .number({invalid_type_error: "Limit must be a Number"})
        .int({message: "Limit must be an Integer"})
        .optional(),
        sort_by : z
        .enum(['name'],{message: "sort only allow: 'name'!"})
        .optional(),
        order_by : z
        .enum(['asc','desc'],{message: "Order mus be 'asc' or 'desc'"})
        .optional(),
    });
}