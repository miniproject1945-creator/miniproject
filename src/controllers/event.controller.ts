import { NextFunction, Request, Response } from 'express';
import { EventQuery, EventRequest } from '@/types/event.type';
import { EventService } from '@/services/event.service';

export class EventController {
  public async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as EventQuery;

      console.log(req.query);
      const response = await EventService.getEvents(query);

      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }
  public async getEventsBySearch(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = req.query as EventQuery;

      const response = await EventService.getEventsBySearch(query);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }
  public async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      const params = req.params as EventQuery;

      const response = await EventService.getEventById(params);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id as number;
      const request = req.body as EventRequest;
      const file = req.file as Express.Multer.File;

      const response = await EventService.createEvent(id, request, file);
      return res.status(201).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id as number;
      const eventId = req.params.eventId;
      const request = req.body as EventRequest;
      const file = req.file as Express.Multer.File;

      const response = await EventService.updateEvent(
        id,
        eventId,
        request,
        file,
      );
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id as number;
      const eventId = req.params.eventId;

      const response = await EventService.deleteEvent(id, eventId);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }
}