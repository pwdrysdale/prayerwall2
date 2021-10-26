import express, { Express, Request, Response } from "express";
import { ApolloServer } from "apollo-server-express";
import { GraphQLSchema } from "graphql";
import cors, { CorsOptions } from "cors";
import { buildSchema, Query, Resolver } from "type-graphql";
import "reflect-metadata";
import { createConnection, EventSubscriber } from "typeorm";
import { authChecker } from "./utlis/authChecker";
import { UserResolver } from "./modules/Users/UsersResolver";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";

import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";

import passportRoutes from "./utlis/passportRoutes";
import { PrayerResolver } from "./modules/Prayers/PrayerResolver";
import { EventsSubscription } from "./modules/EventsSub/EventsSubscription";

const startUp = async () => {
    try {
        dotenv.config();

        await createConnection();

        const app: Express = express();
        app.use(express.json());

        app.use(
            session({
                secret: process.env.SESSION_SECRET,
                resave: true,
                saveUninitialized: true,
                cookie: {
                    sameSite: false,
                    secure: false,
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                },
            })
        );
        app.use(passport.initialize());
        app.use(passport.session());
        app.use("/auth", passportRoutes);

        const allowedOrigins: string[] = [
            "https://studio.apollographql.com",
            "http://localhost:3000",

            "http://localhost:4000/graphql",
            // "http://localhost:4000",
        ];

        const corsOptions: CorsOptions = {
            credentials: true,
            origin: (origin, callback) => {
                if (allowedOrigins.includes(origin))
                    return callback(null, true);

                callback(new Error(`Not allowed by CORS: ${origin}`));
            },
        };

        app.use(cors(corsOptions));

        const httpServer = createServer(app);
        httpServer.listen({ port: 4000 }, () => {
            console.log("HTTP server running on 4000");
        });

        const schema: GraphQLSchema = await buildSchema({
            resolvers: [UserResolver, PrayerResolver, EventsSubscription],
            authChecker: authChecker,
        });

        const server = new ApolloServer({
            introspection: false,
            schema,
            plugins: [
                {
                    async serverWillStart() {
                        return {
                            async drainServer() {
                                subscriptionServer.close();
                            },
                        };
                    },
                },
            ],
            context: ({ req, res }): { req: Request; res: Response } => ({
                req,
                res,
            }),
            formatResponse: (response, requestContext) => {
                if (requestContext.response && requestContext.response.http) {
                    requestContext.response.http.headers.set(
                        "Access-Control-Allow-Origin",
                        "http://localhost:3000"
                        // "https://studio.apollographql.com"
                    );
                    requestContext.response.http.headers.set(
                        "Access-Control-Allow-Credentials",
                        "true"
                    );
                }
                return response;
            },
        });

        await server.start();
        server.applyMiddleware({ app });

        const subscriptionServer = SubscriptionServer.create(
            { schema, execute, subscribe },
            { server: httpServer, path: "/subscriptions" }
        );

        return { app, server };
    } catch (err) {
        console.log(err);
        console.log("Sorry, no server today");
    }
};

startUp();
