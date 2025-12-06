import { NextFunction, Request, Response } from 'express';
import { EventQuery, EventRequest } from '@/types/event.type';
import { 
  createEventService,
  deleteEventService,
  getEventByIdService,
  getEventsBySearchService,
  getEventsService,
  updateEventService
} from '@/services/event.service';


  export async function getEventsController(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as EventQuery;

      console.log(req.query);
      const response = await getEventsService(query);

      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  export async function getEventsBySearchController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = req.query as EventQuery;

      const response = await getEventsBySearchService(query);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  export async function getEventByIdController(req: Request, res: Response, next: NextFunction) {
    try {
      const params = req.params as EventQuery;

      const response = await getEventByIdService(params);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  export async function createEventController(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id as number;
      const request = req.body as EventRequest;
      const file = req.file as Express.Multer.File;

      const response = await createEventService(id, request, file);
      return res.status(201).send(response);
    } catch (error) {
      next(error);
    }
  }

  export async function updateEventController(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id as number;
      const eventId = req.params.eventId;
      const request = req.body as EventRequest;
      const file = req.file as Express.Multer.File;

      const response = await updateEventService(
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

  export async function deleteEventController(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id as number;
      const eventId = req.params.eventId;

      const response = await deleteEventService(id, eventId);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }
