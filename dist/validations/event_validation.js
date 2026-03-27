"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventValidation = void 0;
const error_1 = require("../utils/error");
const zod_1 = require("zod");
const file_1 = require("../utils/file");
const MIN_CATEGORY_ID = 1;
const MAX_CATEGORY_ID = 6;
const MIN_LOCATION_ID = 1;
const MAX_LOCATION_ID = 515;
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];
class EventValidation {
    static fileValidation(file) {
        if (!file)
            throw (0, error_1.createCustomError)(400, 'Image is required!');
        if (file.size > MAX_FILE_SIZE) {
            (0, file_1.deletfile)('../../public/assets/events', file.filename);
            throw (0, error_1.createCustomError)(400, 'Image must be less than 2MB!');
        }
        if (!ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
            (0, file_1.deletfile)('../../public/assets/events', file.filename);
            throw (0, error_1.createCustomError)(400, '.jpg, .jpeg, .png and .webp files are accepted.');
        }
        return file;
    }
    static fileValidationWithOptional(file) {
        if (file)
            return EventValidation.fileValidation(file);
    }
}
exports.EventValidation = EventValidation;
EventValidation.QUERY = zod_1.z.object({
    page: zod_1.z.coerce
        .number({ invalid_type_error: 'Page must be a Number!' })
        .int({ message: 'Page must be an integer' })
        .optional(),
    limit: zod_1.z.coerce
        .number({ invalid_type_error: 'Limit must be a Number!' })
        .int({ message: 'Limit must be an integer' })
        .optional(),
    price: zod_1.z.coerce
        .number({ invalid_type_error: 'Price must be a Number!' })
        .int({ message: 'Price must be an integer' })
        .optional(),
    categoryId: zod_1.z.coerce
        .number({ invalid_type_error: 'CategoryId must be a Number!' })
        .int({ message: 'CategoryId must be an integer' })
        .optional(),
    locationId: zod_1.z.coerce
        .number({ invalid_type_error: 'LocationId must be a Number!' })
        .int({ message: 'LocationId must be an integer' })
        .optional(),
    name: zod_1.z.string().optional(),
    id: zod_1.z.coerce.string().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
EventValidation.CREATE = zod_1.z
    .object({
    name: zod_1.z
        .string({
        required_error: 'Name is required!',
        invalid_type_error: 'Name must be a string!',
    })
        .min(3, { message: 'Name must be at least 3 characters!' }),
    price: zod_1.z.coerce
        .number({
        required_error: 'Price is required!',
        invalid_type_error: 'Price must be a Number!',
    })
        .min(0, { message: 'Price must be at least 0!' })
        .int({ message: 'Price must be an integer!' }),
    startDate: zod_1.z
        .string({
        required_error: 'Start date is required!',
        invalid_type_error: 'Start date must be a string!',
    })
        .transform((str) => new Date(str))
        .refine((date) => {
        const today = new Date();
        if (today > date)
            return false;
        return true;
    }, { message: 'Start Date cannot be in the past!' }),
    endDate: zod_1.z
        .string({
        required_error: 'End date is required!',
        invalid_type_error: 'End date must be a string!',
    })
        .transform((str) => new Date(str))
        .refine((date) => {
        const today = new Date();
        if (today > date)
            return false;
        return true;
    }, { message: 'End Date cannot be in the past!' }),
    locationId: zod_1.z.coerce
        .number({
        required_error: 'LocationId is required!',
        invalid_type_error: 'LocationId must be a Number!',
    })
        .min(MIN_LOCATION_ID, {
        message: `LocationId must be greater than ${MIN_LOCATION_ID} and less than ${MAX_LOCATION_ID}`,
    })
        .max(MAX_LOCATION_ID, {
        message: `LocationId must be greater than ${MIN_LOCATION_ID} and less than ${MAX_LOCATION_ID}`,
    })
        .int({ message: 'LocationId must be an integer!' }),
    categoryId: zod_1.z.coerce
        .number({
        required_error: 'Category is required!',
        invalid_type_error: 'CategoryId must be a Number',
    })
        .min(MIN_CATEGORY_ID, {
        message: `CategoryId must be greater than ${MIN_CATEGORY_ID} and less than ${MAX_CATEGORY_ID}`,
    })
        .max(MAX_CATEGORY_ID, {
        message: `CategoryId must be greater than ${MIN_CATEGORY_ID} and less than ${MAX_CATEGORY_ID}`,
    })
        .int({ message: 'CategoryId must be an integer!' }),
    description: zod_1.z
        .string({
        required_error: 'Description is required!',
        invalid_type_error: 'Description must be a string!',
    })
        .min(100, { message: 'Description must be at least 100 characters!' }),
    maxCapacity: zod_1.z.coerce
        .number({
        required_error: 'Max Capacity is required!',
        invalid_type_error: 'Max Capacity must be a Number!',
    })
        .min(1, { message: 'Max Capacity must be at least 1!' })
        .int({ message: 'Max Capacity must be an integer!' }),
    limitCheckout: zod_1.z.coerce
        .number({
        required_error: 'Limit Checkout is required!',
        invalid_type_error: 'Limit Checkout must be a Number!',
    })
        .int({ message: 'Limit Checkout must be an integer!' }),
})
    .refine((data) => data.startDate <= data.endDate, {
    message: 'Start date cannot be after end date!',
    path: ['endDate'],
})
    .refine((data) => data.limitCheckout > 0 && data.limitCheckout <= data.maxCapacity, {
    message: 'Limit Checkout must be greater than 0 and less than Max Capacity!',
    path: ['limitCheckout'],
});
EventValidation.UPDATE = zod_1.z
    .object({
    name: zod_1.z
        .string({ invalid_type_error: 'Name must be a string!' })
        .min(3, { message: 'Name must be at least 3 characters!' })
        .optional(),
    price: zod_1.z.coerce
        .number({
        required_error: 'Price is required!',
        invalid_type_error: 'Price must be a Number!',
    })
        .min(0, { message: 'Price must be at least 0!' })
        .int({ message: 'Price must be an integer!' })
        .optional(),
    startDate: zod_1.z
        .string({ invalid_type_error: 'Start date must be a string!' })
        .transform((str) => new Date(str))
        .refine((date) => {
        const today = new Date();
        if (today > date)
            return false;
        return true;
    }, { message: 'Start Date cannot be in the past!' })
        .optional(),
    endDate: zod_1.z
        .string({ invalid_type_error: 'End date must be a string!' })
        .transform((str) => new Date(str))
        .refine((date) => {
        const today = new Date();
        if (today > date)
            return false;
        return true;
    }, { message: 'End Date cannot be in the past!' })
        .optional(),
    locationId: zod_1.z.coerce
        .number({ invalid_type_error: 'LocationId must be a Number!' })
        .min(MIN_LOCATION_ID, {
        message: `LocationId must be greater than ${MIN_LOCATION_ID} and less than ${MAX_LOCATION_ID}`,
    })
        .max(MAX_LOCATION_ID, {
        message: `LocationId must be greater than ${MIN_LOCATION_ID} and less than ${MAX_LOCATION_ID}`,
    })
        .int({ message: 'LocationId must be an integer!' })
        .optional(),
    categoryId: zod_1.z.coerce
        .number({ invalid_type_error: 'CategoryId must be a Number' })
        .min(MIN_CATEGORY_ID, {
        message: `CategoryId must be greater than ${MIN_CATEGORY_ID} and less than ${MAX_CATEGORY_ID}`,
    })
        .max(MAX_CATEGORY_ID, {
        message: `CategoryId must be greater than ${MIN_CATEGORY_ID} and less than ${MAX_CATEGORY_ID}`,
    })
        .int({ message: 'CategoryId must be an integer!' })
        .optional(),
    description: zod_1.z
        .string({ invalid_type_error: 'Description must be a string!' })
        .min(100, { message: 'Description must be at least 100 characters!' })
        .optional(),
    maxCapacity: zod_1.z.coerce
        .number({ invalid_type_error: 'Max Capacity must be a Number!' })
        .min(1, { message: 'Max Capacity must be at least 1!' })
        .int({ message: 'Max Capacity must be an integer!' })
        .optional(),
    limitCheckout: zod_1.z.coerce
        .number({ invalid_type_error: 'Limit Checkout must be a Number!' })
        .int({ message: 'Limit Checkout must be an integer!' })
        .optional(),
})
    .refine((data) => {
    if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
    }
    return true;
}, {
    message: 'Start date cannot be after end date!',
    path: ['endDate'],
})
    .refine((data) => {
    if (data.limitCheckout && data.maxCapacity) {
        return (data.limitCheckout > 0 && data.limitCheckout <= data.maxCapacity);
    }
    return true;
}, {
    message: 'Limit Checkout must be greater than 0 and less than Max Capacity!',
    path: ['limitCheckout'],
});
EventValidation.EVENT_ID = zod_1.z.coerce
    .number({ invalid_type_error: 'Event ID must be a number' })
    .int({ message: 'Event ID must be an integer' })
    .positive({ message: 'Event ID must be a positive number' });
