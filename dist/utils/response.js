"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseDataWithPagination = exports.responseWithoutData = exports.responseWithData = void 0;
const responseWithData = (status, isSuccess, message, data) => {
    return {
        rc: status,
        success: isSuccess,
        message,
        result: data,
    };
};
exports.responseWithData = responseWithData;
const responseWithoutData = (status, isSuccess, message) => {
    return {
        rc: status,
        success: isSuccess,
        message,
    };
};
exports.responseWithoutData = responseWithoutData;
const responseDataWithPagination = (status, message, data, page, limit, total) => {
    return {
        rc: status,
        success: true,
        message,
        result: data,
        page,
        limit,
        total
    };
};
exports.responseDataWithPagination = responseDataWithPagination;
