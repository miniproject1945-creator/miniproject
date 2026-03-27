"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionValidation = void 0;
const error_1 = require("../utils/error");
const zod_1 = require("zod");
const file_1 = require("../utils/file");
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
class TransactionValidation {
    static fileValidation(file) {
        if (!file)
            throw (0, error_1.createCustomError)(400, "Image is required!");
        if (file.size > MAX_FILE_SIZE) {
            (0, file_1.deletfile)("../../public/assets/transactions", file.filename);
            throw (0, error_1.createCustomError)(400, "Image must be less than 2MB");
        }
        if (!ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
            (0, file_1.deletfile)("../../public/assets/transactions", file.filename);
            throw (0, error_1.createCustomError)(400, ".jpeg, .jpg, .png, .webp files are only accepted");
        }
        return file;
    }
}
exports.TransactionValidation = TransactionValidation;
TransactionValidation.CREATE = zod_1.z.object({
    eventId: zod_1.z
        .number({ required_error: "EventId is required!" })
        .int({ message: "EventId must be an Integer" })
        .positive({ message: "EventId must be a positive number!" }),
    seatRequests: zod_1.z
        .number({ required_error: "Seat Requests is required!" })
        .int({ message: "Seat requests must be an integer!" })
        .positive({ message: "You cannot book 0 seat" }),
    voucherId: zod_1.z
        .number({ required_error: "VoucherId is required!" })
        .int({ message: "VoucherId must be an integer!" })
        .positive({ message: "VoucherId must be a Positive number" })
        .optional(),
    redeemedPoints: zod_1.z
        .number({ required_error: "Redeemed Points must be a number!" })
        .int({ message: "Redeemed Points must be an integer" })
        .min(0, { message: "Redeemed Points must be at least 0" })
        .optional(),
});
TransactionValidation.TRANSACTION_ID = zod_1.z.coerce
    .number({ invalid_type_error: "Transaction ID must be a number" })
    .int({ message: "Transaction ID must be an integer" })
    .positive({ message: "Transaction ID must be a Positive number" });
