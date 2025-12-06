import { LocationRepository } from "@/repositories/location.repository";
import { responseWithData } from "@/utils/response";
import { LocationValidation } from "@/validations/location.validation";
import { Validation } from "@/validations/validation";
export class LocationService {
    static async getLocations(query) {
        let locationQuery = Validation.validate(LocationValidation.QUERY, query);
        if (!locationQuery.page)
            locationQuery.page = 1;
        if (!locationQuery.limit)
            locationQuery.limit = 10;
        if (!locationQuery.sort_by)
            locationQuery.sort_by = 'name';
        if (!locationQuery.order_by)
            locationQuery.order_by = 'asc';
        const locations = await LocationRepository.getLocations(locationQuery);
        return responseWithData(200, true, 'Get locations successfully', locations);
    }
}
