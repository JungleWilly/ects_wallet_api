import "reflect-metadata";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import {passwordAuthChecker} from "./utils/auth-checker";

const PORT = process.env.PORT || 4000;

const initialize = async () => {
    await createConnection({
        type: "mysql",
        host: "mysql",
        port: 3306,
        username: "root",
        password: "supersecret",
        database: "ects_wallet",
        entities: [
            __dirname + "/entities/*.js"
        ],
        synchronize: true,
    });

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

    const { url } = await server.listen(PORT);
    console.log(`Server is running, GraphQL Playground available at ${url}`);
};

initialize();
