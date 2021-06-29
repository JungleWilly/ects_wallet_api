import { getRepository } from "typeorm";
import { User } from "../entities/User";

export class UserRepository {
    private static repository = getRepository(User);

    public static async createUser(user: Partial<User>): Promise<User> {
        return await this.repository.create(user).save();
    }

    public static async updateUser(user: Partial<User>): Promise<User> {
        const existingItem = await this.repository.findOne(user.id);
        Object.assign(existingItem, user);
        return await existingItem.save();
    }

    public static async getAllUsers(): Promise<User[]> {
        return await this.repository.find();
    }

    public static async getAllActiveUsers(): Promise<User[]> {
        return await this.repository.find({ state: 'active' });
    }

    public static async getUser(userId: number): Promise<User | null> {
        return await this.repository.findOne(userId);
    }

    public static async getUserByEmail(email: string): Promise<User | null> {
        return await this.repository.findOne({ email });
    }
}