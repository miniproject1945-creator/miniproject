import {z} from "zod";

export class VoucherValidation {
    static CREATE = z.object({
        name: z.string({
            invalid_type_error: "Name must be a String",
            required_error: "Name must be required",
        }).nonempty({message:"Name cannot be empty!"}),
        maxUsage: z
        .number({
            invalid_type_error: "Max Usage must be a Number",
            required_error: "Max Usage must be required",
        })
        .int({message: "Max usage must be integer"})
        .min(1,{message: "Max usage must be at least 1"}),
        discount : z
        .number({
            invalid_type_error: "discount must be a number",
            required_error: "Diskon must be required",
        })
        .int({message:"Diskon must be an Integer"})
        .min(1,{message: "Diskon must be at least 1"})
        .max(100,{message: "Diskon must be less than 100"}),
        eventId: z
        .number({
            invalid_type_error: "EventId must be a Number",
            required_error: "EventId must be required"
        })
        .int({message: "eventId must be an integer"})
        .min(1,{message:"eventId must be at least 1"}),
    });

    static EVENT_ID = z.coerce
    .number({invalid_type_error: "eventId must be a Number"})
    .int({message:"eventId must be an integer"})
    .positive();
}
