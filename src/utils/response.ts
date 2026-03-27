export const responseWithData = (
    status: number,
    isSuccess: boolean,
    message: string,
    data: object | Array<any>,
) => {
    return {
        rc: status,
        success: isSuccess,
        message,
        result: data,
    };
};

export const responseWithoutData = (
    status: number,
    isSuccess: boolean,
    message: string,
) => {
    return{
        rc: status,
        success: isSuccess,
        message,
    };
};

export const responseDataWithPagination = (
    status: number,
    message: string,
    data: object | Array<any>,
    page: number,
    limit: number,
    total: number,
) => {
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