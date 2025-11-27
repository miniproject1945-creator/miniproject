import { EventController } from '@/controllers/event.controller';
import { adminGuard, verifyToken } from '@/middlewares/auth.middleware';
import { uploader } from '@/middlewares/uplouder.middleware';
import { Router } from 'express';
export class EventRouter {
    router;
    eventController;
    constructor() {
        this.router = Router();
        this.eventController = new EventController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/', this.eventController.getEvents);
        this.router.post('/', verifyToken, adminGuard, uploader('/events', 'EVENT').single('image'), this.eventController.createEvent);
        this.router.get('/search', this.eventController.getEventsBySearch);
        this.router.patch('/:eventId', verifyToken, adminGuard, uploader('/events', 'EVENT').single('image'), this.eventController.updateEvent);
        this.router.delete('/:eventId', verifyToken, adminGuard, this.eventController.deleteEvent);
        this.router.get('/:id', this.eventController.getEventById);
    }
    getRoutes() {
        return this.router;
    }
}
