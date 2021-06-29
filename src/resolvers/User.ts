import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { UserController } from "../controllers/User";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/User";

@Resolver(User)
export class UserResolver {
    constructor() { }

    @Query(returns => [User])
    async users() {
        return UserRepository.getAllUsers();
    }

    @Mutation(returns => User)
    public async createUser(
        @Arg("email") email: string,
        @Arg("password") password: string,
    ): Promise<User> {
        return UserController.createUser(email, password);
    }
}