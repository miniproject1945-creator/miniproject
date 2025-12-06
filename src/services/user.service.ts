import { getUserProfile } from "@/repositories/user.repository";
import { responseWithData } from "@/utils/response";


    export async function getDataProfileService(id: number) {
        const response = await getUserProfile(id);
        return responseWithData(
            200,
            true, 
            'Get user profile successfully', 
            response!
        );
    }
