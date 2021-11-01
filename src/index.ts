import "reflect-metadata";
import { createConnection } from "typeorm";
import { getApolloServer } from "./server";
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config()

const PORT = process.env.PORT || 4000;

const initialize = async () => {
    if (process.env.NODE_ENV === 'development') {
        await createConnection(
            {
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
    } else {
        await createConnection(
            {
                name: "default",
                type: "mysql",
                host: process.env.DB_HOST,
                port: 3306,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB,
                entities: [
                    __dirname + "/entities/*.js"
                ],
                synchronize: true,
            });
    }

    const server = await getApolloServer();

    const corsOptions = {
        origin: 'http://localhost:3000',
        credentials: true
    }


    const app = express();
    app.use(cors(corsOptions));
    app.enable('trust proxy');
    app.use(express.json());
    app.use(express.urlencoded());

    app.use(helmet({ contentSecurityPolicy: (process.env.NODE_ENV === 'production') ? undefined : false }));
    app.use(helmet.xssFilter());

    if (process.env.NODE_ENV === 'production') {
        app.use(rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
        }));
    }

    server.applyMiddleware({
        app,
        cors: false
    });


    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    });
};

initialize();
