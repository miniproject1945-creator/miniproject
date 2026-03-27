import { LocationController } from "@/controllers/location.controller";
import { Router } from "express";
export class locationRouter {
    router;
    locationController;
    constructor() {
        this.router = Router();
        this.locationController = new LocationController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/", this.locationController.getLocations);
    }
    getRouter() {
        return this.router;
    }
}
