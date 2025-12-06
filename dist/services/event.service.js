"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventsService = getEventsService;
exports.getEventsBySearchService = getEventsBySearchService;
exports.getEventByIdService = getEventByIdService;
exports.createEventService = createEventService;
exports.getEventByUserService = getEventByUserService;
exports.updateEventService = updateEventService;
exports.deleteEventService = deleteEventService;
const event_repository_1 = require("../repositories/event.repository");
const error_1 = require("../utils/error");
const response_1 = require("../utils/response");
const event_validation_1 = require("../validations/event_validation");
const validation_1 = require("../validations/validation");
async function getEventsService(query) {
    console.log('INI SERVICE', query);
    const eventQuery = validation_1.Validation.validate(event_validation_1.EventValidation.QUERY, query);
    console.log('sudah validasi', eventQuery);
    if (!eventQuery.page)
        eventQuery.page = 1;
    if (!eventQuery.limit)
        eventQuery.limit = 10;
    const response = await (0, event_repository_1.getEvents)(eventQuery);
    const totalEvents = await (0, event_repository_1.getTotalEvents)(eventQuery);
    return (0, response_1.responseDataWithPagination)(200, 'Get events successfully', response, Number(eventQuery.page), Number(eventQuery.limit), totalEvents);
}
async function getEventsBySearchService(query) {
    const eventQuery = validation_1.Validation.validate(event_validation_1.EventValidation.QUERY, query);
    if (!eventQuery.page)
        eventQuery.page = 1;
    if (!eventQuery.limit)
        eventQuery.limit = 10;
    const response = await (0, event_repository_1.getEventsBySearch)(eventQuery);
    const totalEvent = await (0, event_repository_1.getTotalEventsBySearch)(eventQuery);
    return (0, response_1.responseDataWithPagination)(200, 'Get events successfully', response, Number(eventQuery.page), Number(eventQuery.limit), totalEvent);
}
async function getEventByIdService(query) {
    const eventQuery = validation_1.Validation.validate(event_validation_1.EventValidation.QUERY, query);
    const response = await (0, event_repository_1.getEventByIdWithInclude)(eventQuery);
    return (0, response_1.responseWithData)(200, true, 'Get events successfully', response);
}
async function createEventService(id, request, file) {
    const eventRequest = validation_1.Validation.validate(event_validation_1.EventValidation.CREATE, request);
    const validateFile = event_validation_1.EventValidation.fileValidation(file);
    await (0, event_repository_1.createEvent)(id, eventRequest, validateFile);
    return (0, response_1.responseWithoutData)(201, true, 'Create event successfully');
}
async function getEventByUserService(id) {
    const response = await (0, event_repository_1.getEventByUser)(id);
    return (0, response_1.responseWithData)(200, true, 'Get events name successfully', response);
}
async function updateEventService(id, eventId, request, file) {
    const eventRequest = validation_1.Validation.validate(event_validation_1.EventValidation.UPDATE, request);
    const validateFile = event_validation_1.EventValidation.fileValidationWithOptional(file);
    const newEventId = validation_1.Validation.validate(event_validation_1.EventValidation.EVENT_ID, eventId);
    const event = await (0, event_repository_1.getEventById)(Number(newEventId));
    if (!event)
        throw (0, error_1.createCustomError)(404, 'Event not found!');
    if (event.userId !== id) {
        throw (0, error_1.createCustomError)(401, 'This event is not yours!');
    }
    const response = await (0, event_repository_1.updateEvent)(id, Number(newEventId), eventRequest, validateFile);
    return (0, response_1.responseWithData)(200, true, 'Update event successfully', response);
}
async function deleteEventService(id, eventId) {
    const newEventId = validation_1.Validation.validate(event_validation_1.EventValidation.EVENT_ID, eventId);
    const event = await (0, event_repository_1.getEventById)(Number(newEventId));
    if (!event)
        throw (0, error_1.createCustomError)(404, 'Event not found!');
    if (event.userId !== id) {
        throw (0, error_1.createCustomError)(401, 'This event is not yours!');
    }
    if (event.availableSeats !== event.maxCapacity) {
        throw (0, error_1.createCustomError)(400, 'Event is not empty!');
    }
    await (0, event_repository_1.deleteEvent)(Number(newEventId));
    return (0, response_1.responseWithoutData)(200, true, 'Delete event successfully');
}
