import { UserService } from "@/services/user.service";
import { Request, Response, NextFunction } from "express";

export class UserController {
    public async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const id = res.locals.decoded.id as number;
            const response = await UserService.getDataProfile(id);
            return res.status(200).send(response);

        } catch (err) {
            next(err);
            
        }
    }
}


