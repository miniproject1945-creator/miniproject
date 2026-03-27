"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataProfileService = getDataProfileService;
const user_repository_1 = require("../repositories/user.repository");
const response_1 = require("../utils/response");
async function getDataProfileService(id) {
    const response = await (0, user_repository_1.getUserProfile)(id);
    return (0, response_1.responseWithData)(200, true, 'Get user profile successfully', response);
}
