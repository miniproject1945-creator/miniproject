"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileController = getProfileController;
const user_service_1 = require("../services/user.service");
async function getProfileController(req, res, next) {
    try {
        const id = res.locals.decoded.id;
        const response = await (0, user_service_1.getDataProfileService)(id);
        return res.status(200).send(response);
    }
    catch (err) {
        next(err);
    }
}
