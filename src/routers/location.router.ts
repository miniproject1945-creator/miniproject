import { getLocationsController } from "../controllers/location.controller";
import { Router } from "express";

const locationRouter = Router();

locationRouter.get("/", getLocationsController);

export default locationRouter;