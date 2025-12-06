import { getLocationsService } from "../services/location.service";
import { LocationQuerry } from "../types/location.type";
import { NextFunction, Request, Response } from "express";


    export async function getLocationsController(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query as LocationQuerry;
            const response = await getLocationsService(query);
            return res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    }






