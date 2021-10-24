import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import * as bcrypt from 'bcrypt';
import { UserController } from "../controllers/User";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/User";
import { getRepository } from "typeorm";
import { AuthResult } from "../entities/AuthResult";
import { generateJwt } from "../utils/helpers";

@Resolver(User)
export class UserResolver {
    private userRepo = getRepository(User);

    static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
    @Query(returns => [User])
    async users() {
        return await UserRepository.getAllUsers();
    }

    @Mutation(() => User)
    public async createUser(
        @Arg("email") email: string,
        @Arg("password") password: string,
    ): Promise<User | void> {
        const hash = await UserResolver.hashPassword(password);
        const user = this.userRepo.create({ email, password: hash });

        return await this.userRepo
            .save(user)
            .catch((err) => console.log('save error', err));
    }

    @Mutation(() => AuthResult, { nullable: true })
    public async authenticate(
        @Arg('email') email: string,
        @Arg('password') password: string
    ): Promise<AuthResult> {
        const user = await this.userRepo.findOneOrFail({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateJwt({
                userId: user.id,
                email: user.email,
            });
            console.log(
                { token, user }
            );
            return { token, user };
        } else {
            return {};
        }
    }

    @Query(() => User)
    @Authorized()
    public async authenticatedUser(@Ctx() ctx): Promise<User> {

        return ctx.user;
    }
}