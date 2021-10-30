import "reflect-metadata";
import { createConnection } from "typeorm";
import { getApolloServer } from "./server";

const PORT = process.env.PORT || 4000;

const initialize = async () => {
    await createConnection({
        name: "default",
        type: "mysql",
        host: "us-cdbr-east-04.cleardb.com",
        port: 3306,
        username: "bb2f6cf23ce242",
        password: "19fe28b2",
        database: "heroku_5805846cc6ee509",
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
