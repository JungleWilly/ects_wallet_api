import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { passwordAuthChecker } from "./utils/auth-checker";

export async function getApolloServer() {
    const schema = await buildSchema({
        resolvers: [__dirname + "/resolvers/*.{ts,js}"],
        authChecker: passwordAuthChecker,
        nullableByDefault: null,
    });

    const server = new ApolloServer({
        schema,
        playground: true,
        context: ({ req, res }) => ({ req, res }),
    });

    return server
}
