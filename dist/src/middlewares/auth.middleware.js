import { ErrorResponse } from '@/utils/error';
import { verifyJWTToken } from '@/utils/jwt';
export const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token)
        throw new ErrorResponse(401, 'Unauthorized');
    const decoded = verifyJWTToken(token);
    if (decoded)
        res.locals.decoded = decoded;
    next();
};
export const adminGuard = (req, res, next) => {
    if (!res.locals.decoded?.isAdmin) {
        throw new ErrorResponse(401, 'Unauthorized');
    }
    next();
};
export const userGuard = (req, res, next) => {
    if (res.locals.decoded?.isAdmin) {
        throw new ErrorResponse(401, 'Unauthorized');
    }
    next();
};
