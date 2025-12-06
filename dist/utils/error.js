"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomError = createCustomError;
exports.isCustomError = isCustomError;
function createCustomError(status, message) {
    return { status, message };
}
function isCustomError(error) {
    return error && typeof error.status === "number" && typeof error.message === "string";
}
