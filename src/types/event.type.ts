export type EventQuery = {
    page?: string | number;
    limit?: string | number;
    price?: string | number;
    categoryId?: string | number;
    locationId?: string | number;
    category?: string;
    name?: string;
    location?: string;
    id?: number;
    startDate?: Date;
    endDate?: Date;
};

export type EventRequest = {
    name: string;
    price: number;
    startDate: Date;
    endDate: Date;
    locationId: number;
    categoryId: number;
    description: number;
    maxCapacity: number;
    limitCheckout: number;
};