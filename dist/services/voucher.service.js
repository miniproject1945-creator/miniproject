"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVoucherService = createVoucherService;
exports.getVouchersByIdService = getVouchersByIdService;
exports.getVouchersByCreatorService = getVouchersByCreatorService;
const event_repository_1 = require("../repositories/event.repository");
const voucher_repository_1 = require("../repositories/voucher.repository");
const error_1 = require("../utils/error");
const response_1 = require("../utils/response");
const voucher_validation_1 = require("../validations/voucher.validation");
const validation_1 = require("../validations/validation");
async function createVoucherService(id, body) {
    const { discount, eventId, maxUsage, name } = validation_1.Validation.validate(voucher_validation_1.VoucherValidation.CREATE, body);
    const event = await (0, event_repository_1.getEventById)(eventId);
    console.log("data userId :", event);
    if (!event) {
        throw (0, error_1.createCustomError)(404, 'Event not found');
    }
    if (event.userId !== id) {
        throw (0, error_1.createCustomError)(403, 'You are not authorized to create voucher for this event');
    }
    if (event.price === 0) {
        throw (0, error_1.createCustomError)(400, 'Cannot create voucher for free event');
    }
    if (event.maxCapacity < maxUsage) {
        throw (0, error_1.createCustomError)(400, 'Max usage cannot be greater than event max capacity');
    }
    await (0, voucher_repository_1.createVoucher)(id, {
        discount,
        eventId,
        maxUsage,
        name,
    });
    return (0, response_1.responseWithoutData)(201, true, 'Voucher created successfully');
}
async function getVouchersByIdService(id, eventId) {
    const newEventId = validation_1.Validation.validate(voucher_validation_1.VoucherValidation.EVENT_ID, eventId);
    const response = await (0, voucher_repository_1.getVoucherById)(id, Number(newEventId));
    return (0, response_1.responseWithData)(200, true, 'Get vouchers successfully', response);
}
async function getVouchersByCreatorService(eventId) {
    console.log("ini log servis", eventId);
    const newEventId = validation_1.Validation.validate(voucher_validation_1.VoucherValidation.EVENT_ID, eventId);
    const response = await (0, voucher_repository_1.getVouchersByCreator)(Number(newEventId));
    return (0, response_1.responseWithData)(200, true, 'Get vouchers by creator successfully', response);
}
