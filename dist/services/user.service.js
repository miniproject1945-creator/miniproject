import { UserRepository } from "@/repositories/user.repository";
import { responseWithData } from "@/utils/response";
export class UserService {
    static async getDataProfile(id) {
        const response = await UserRepository.getUserProfile(id);
        return responseWithData(200, true, 'Get user profile successfully', response);
    }
}
