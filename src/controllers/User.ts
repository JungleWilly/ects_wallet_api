import { UserRepository } from "../repositories/User";
import { User } from "../entities/User";

export class UserController {
    public static async createUser(email: string, password: string): Promise<User> {
        if (await UserRepository.getUserByEmail(email)) {
            throw new Error('email_already_exists');
        } else {
            return await UserRepository.createUser({ email, password, createdAt: new Date().toISOString() });
        }
    }
}