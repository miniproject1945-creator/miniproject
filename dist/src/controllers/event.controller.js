import { EventService } from '@/services/event.service';
export class EventController {
    async getEvents(req, res, next) {
        try {
            const query = req.query;
            console.log(req.query);
            const response = await EventService.getEvents(query);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getEventsBySearch(req, res, next) {
        try {
            const query = req.query;
            const response = await EventService.getEventsBySearch(query);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getEventById(req, res, next) {
        try {
            const params = req.params;
            const response = await EventService.getEventById(params);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
    async createEvent(req, res, next) {
        try {
            const id = res.locals.decoded.id;
            const request = req.body;
            const file = req.file;
            const response = await EventService.createEvent(id, request, file);
            return res.status(201).send(response);
        }
        catch (error) {
            next(error);
        }
    }
    async updateEvent(req, res, next) {
        try {
            const id = res.locals.decoded.id;
            const eventId = req.params.eventId;
            const request = req.body;
            const file = req.file;
            const response = await EventService.updateEvent(id, eventId, request, file);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteEvent(req, res, next) {
        try {
            const id = res.locals.decoded.id;
            const eventId = req.params.eventId;
            const response = await EventService.deleteEvent(id, eventId);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
}
