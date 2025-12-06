import { UserService } from "@/services/user.service";
export class UserController {
    async getProfile(req, res, next) {
        try {
            const id = res.locals.decoded.id;
            const response = await UserService.getDataProfile(id);
            return res.status(200).send(response);
        }
        catch (err) {
            next(err);
        }
    }
}
