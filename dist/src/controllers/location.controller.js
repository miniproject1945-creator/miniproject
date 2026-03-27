import { LocationService } from "@/services/location.service";
export class LocationController {
    async getLocations(req, res, next) {
        try {
            const query = req.query;
            const response = await LocationService.getLocations(query);
            return res.status(200).send(response);
        }
        catch (error) {
            next(error);
        }
    }
}
