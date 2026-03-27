"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoucherValidation = void 0;
const zod_1 = require("zod");
class VoucherValidation {
}
exports.VoucherValidation = VoucherValidation;
VoucherValidation.CREATE = zod_1.z.object({
    name: zod_1.z.string({
        invalid_type_error: "Name must be a String",
        required_error: "Name must be required",
    }).nonempty({ message: "Name cannot be empty!" }),
    maxUsage: zod_1.z
        .number({
        invalid_type_error: "Max Usage must be a Number",
        required_error: "Max Usage must be required",
    })
        .int({ message: "Max usage must be integer" })
        .min(1, { message: "Max usage must be at least 1" }),
    discount: zod_1.z
        .number({
        invalid_type_error: "discount must be a number",
        required_error: "Diskon must be required",
    })
        .int({ message: "Diskon must be an Integer" })
        .min(1, { message: "Diskon must be at least 1" })
        .max(100, { message: "Diskon must be less than 100" }),
    eventId: zod_1.z
        .number({
        invalid_type_error: "EventId must be a Number",
        required_error: "EventId must be required"
    })
        .int({ message: "eventId must be an integer" })
        .min(1, { message: "eventId must be at least 1" }),
});
VoucherValidation.EVENT_ID = zod_1.z.coerce
    .number({ invalid_type_error: "eventId must be a Number" })
    .int({ message: "eventId must be an integer" })
    .positive();
