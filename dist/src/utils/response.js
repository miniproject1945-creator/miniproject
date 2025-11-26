export const responseWithData = (status, isSuccess, message, data) => {
    return {
        rc: status,
        success: isSuccess,
        message,
        result: data,
    };
};
export const responseWithoutData = (status, isSuccess, message) => {
    return {
        rc: status,
        success: isSuccess,
        message,
    };
};
export const responseDataWithPagination = (status, message, data, page, limit, total) => {
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
