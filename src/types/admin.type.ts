export type AdminEventQuery = {
    name?: string;
    page?: string | number;
    limit?: string | number;
    sort_by?: string | string;
    order_by?: string;
};

export type AdminEventQueryValidated = {
    name?: string;
    page: number;
    limit: number;
    sort_by: string;
    order_by: string;
};

export type AdminEventTransactionQuery = {
    page?: string | number;
    limit?: string | number;
    sort_by?: string;
    order_by?: string;
};

export type FilterDate = {
    start_date?: string;
    end_date?: string;
}