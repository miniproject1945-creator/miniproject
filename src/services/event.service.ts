import {
   getEvents, 
   getTotalEvents, 
   getTotalEventsBySearch, 
   getEventsBySearch,
   getEventByIdWithInclude,
   getEventByUser,
   getEventById,
   updateEvent,
   createEvent,
   deleteEvent
  } from '../repositories/event.repository';
import { EventQuery, EventRequest } from '../types/event.type';
import { createCustomError } from '../utils/error';
import {
  responseDataWithPagination,
  responseWithData,
  responseWithoutData,
} from '../utils/response';
import { EventValidation } from '../validations/event_validation';
import { Validation } from '../validations/validation';


  export async function getEventsService(query: EventQuery) {
    console.log('INI SERVICE', query);

    const eventQuery = Validation.validate(EventValidation.QUERY, query);
    console.log('sudah validasi', eventQuery);

    if (!eventQuery.page) eventQuery.page = 1;
    if (!eventQuery.limit) eventQuery.limit = 10;

    const response = await getEvents(eventQuery);
    const totalEvents = await getTotalEvents(eventQuery);

    return responseDataWithPagination(
      200,
      'Get events successfully',
      response,
      Number(eventQuery.page),
      Number(eventQuery.limit),
      totalEvents,
    );
  }

  export async function getEventsBySearchService(query: EventQuery) {
    const eventQuery = Validation.validate(EventValidation.QUERY, query);
    if (!eventQuery.page) eventQuery.page = 1;
    if (!eventQuery.limit) eventQuery.limit = 10;

    const response = await getEventsBySearch(eventQuery);
    const totalEvent = await getTotalEventsBySearch(eventQuery);

    return responseDataWithPagination(
      200,
      'Get events successfully',
      response,
      Number(eventQuery.page),
      Number(eventQuery.limit),
      totalEvent,
    );
  }

  export async function getEventByIdService(query: EventQuery) {
    const eventQuery = Validation.validate(EventValidation.QUERY, query);

    const response = await getEventByIdWithInclude(eventQuery);

    return responseWithData(200, true, 'Get events successfully', response);
  }

  export async function createEventService(
    id: number,
    request: EventRequest,
    file: Express.Multer.File,
  ) {
    const eventRequest = Validation.validate(EventValidation.CREATE, request);
    const validateFile = EventValidation.fileValidation(file);

    await createEvent(id, eventRequest, validateFile);
    return responseWithoutData(201, true, 'Create event successfully');
  }

  export async function getEventByUserService(id: number) {
    const response = await getEventByUser(id);
    return responseWithData(
      200,
      true,
      'Get events name successfully',
      response,
    );
  }

  export async function updateEventService(
    id: number,
    eventId: string,
    request: EventRequest,
    file: Express.Multer.File,
  ) {
    const eventRequest = Validation.validate(EventValidation.UPDATE, request);
    const validateFile = EventValidation.fileValidationWithOptional(file);
    const newEventId = Validation.validate(EventValidation.EVENT_ID, eventId);

    const event = await getEventById(Number(newEventId));

    if (!event) throw createCustomError(404, 'Event not found!');

    if (event.userId !== id) {
      throw createCustomError(401, 'This event is not yours!');
    }

    const response = await updateEvent(
      id,
      Number(newEventId),
      eventRequest,
      validateFile,
    );

    return responseWithData(200, true, 'Update event successfully', response);
  }

  export async function deleteEventService(id: number, eventId: string) {
    const newEventId = Validation.validate(EventValidation.EVENT_ID, eventId);

    const event = await getEventById(Number(newEventId));

    if (!event) throw createCustomError(404, 'Event not found!');

    if (event.userId !== id) {
      throw createCustomError(401, 'This event is not yours!');
    }

    if (event.availableSeats !== event.maxCapacity) {
      throw createCustomError(400, 'Event is not empty!');
    }

    await deleteEvent(Number(newEventId));
    return responseWithoutData(200, true, 'Delete event successfully');
  }
