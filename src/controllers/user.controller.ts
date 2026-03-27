import { getDataProfileService } from "../services/user.service";
import { Request, Response, NextFunction } from "express";


    export async function getProfileController(req: Request, res: Response, next: NextFunction) {
        try {
            const id = res.locals.decoded.id as number;
            const response = await getDataProfileService(id);
            return res.status(200).send(response);

        } catch (err) {
            next(err);
            
        }
    }



