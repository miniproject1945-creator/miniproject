"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventsController = getEventsController;
exports.getEventsBySearchController = getEventsBySearchController;
exports.getEventByIdController = getEventByIdController;
exports.createEventController = createEventController;
exports.updateEventController = updateEventController;
exports.deleteEventController = deleteEventController;
const event_service_1 = require("../services/event.service");
async function getEventsController(req, res, next) {
    try {
        const query = req.query;
        console.log(req.query);
        const response = await (0, event_service_1.getEventsService)(query);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
async function getEventsBySearchController(req, res, next) {
    try {
        const query = req.query;
        const response = await (0, event_service_1.getEventsBySearchService)(query);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
async function getEventByIdController(req, res, next) {
    try {
        const params = req.params;
        const response = await (0, event_service_1.getEventByIdService)(params);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
async function createEventController(req, res, next) {
    try {
        const id = res.locals.decoded.id;
        const request = req.body;
        const file = req.file;
        const response = await (0, event_service_1.createEventService)(id, request, file);
        return res.status(201).send(response);
    }
    catch (error) {
        next(error);
    }
}
async function updateEventController(req, res, next) {
    try {
        const id = res.locals.decoded.id;
        const eventId = req.params.eventId;
        const request = req.body;
        const file = req.file;
        const response = await (0, event_service_1.updateEventService)(id, eventId, request, file);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
async function deleteEventController(req, res, next) {
    try {
        const id = res.locals.decoded.id;
        const eventId = req.params.eventId;
        const response = await (0, event_service_1.deleteEventService)(id, eventId);
        return res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
}
