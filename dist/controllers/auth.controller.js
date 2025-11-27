import { AuthService } from '@/services/auth.service';
export class AuthController {
    async register(req, res, next) {
        try {
            const request = req.body;
            const response = await AuthService.register(request);
            return res.status(201).send(response);
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const request = req.body;
            const response = await AuthService.login(request);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
    async keepLogin(req, res, next) {
        try {
            const decoded = res.locals.decoded;
            const response = await AuthService.keepLogin(decoded);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
}
