import { createEventController, deleteEventController, getEventByIdController, getEventsBySearchController, updateEventController } from '@/controllers/event.controller';
import { adminGuard, verifyToken } from '@/middlewares/auth.middleware';
import { uploader } from '@/middlewares/uplouder.middleware';
import { Router } from 'express';

const EventRouter = Router();

EventRouter.get("/", getEventByIdController);
EventRouter.post("/", 
  verifyToken, 
  adminGuard,
  uploader("/events", "/EVENT").single("image"),
  createEventController,
)
EventRouter.get("/search",getEventsBySearchController);
EventRouter.patch("/:eventId", 
  verifyToken, 
  adminGuard,
  uploader("/events", "/EVENT").single("image"),
  updateEventController,
);
EventRouter.delete("/:eventId",verifyToken, adminGuard, deleteEventController);
EventRouter.get("/:id", getEventByIdController);

export default EventRouter;
  


