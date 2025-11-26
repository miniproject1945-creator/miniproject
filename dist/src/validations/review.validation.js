import { z } from "zod";
export class ReviewValidation {
    static CREATE = z.object({
        message: z.string({
            invalid_type_error: "Message must be a String",
            required_error: "Message must be required",
        }),
        rating: z
            .number({
            invalid_type_error: "Rating must be a String!",
            required_error: "Rating must be required!",
        })
            .int({ message: "Rating must be Integer" })
            .min(1, { message: "Rating must be at least 1" })
            .max(5, { message: "Rating must be lest than 100!" }),
        eventId: z
            .number({
            invalid_type_error: "EventId must be a Number",
            required_error: "Event must be required!",
        })
            .int({ message: "EventId must be integer!" })
            .min(1, { message: "eventId must be at least 1" }),
    });
}
