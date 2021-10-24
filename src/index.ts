import "reflect-metadata";
import { createConnection } from "typeorm";
import { getApolloServer } from "./server";

const PORT = process.env.PORT || 4000;

const initialize = async () => {
    await createConnection({
        name: "default",
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

    const server = await getApolloServer();

    const { url } = await server.listen(PORT);
    console.log(`Server is running, GraphQL Playground available at ${url}`);
};

initialize();
