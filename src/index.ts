import express, { Express, Request, Response } from "express";
import { ApolloServer } from "apollo-server-express";
import { GraphQLSchema } from "graphql";
import cors, { CorsOptions } from "cors";
import { buildSchema, Query, Resolver } from "type-graphql";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { authChecker } from "./utlis/authChecker";
import { UserResolver } from "./modules/UsersResolver";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import passportRoutes from "./utlis/passportRoutes";

const startUp = async () => {
    try {
        dotenv.config();

        await createConnection();

        const app: Express = express();

        const schema: GraphQLSchema = await buildSchema({
            resolvers: [UserResolver],
            authChecker: authChecker,
        });

        const server = new ApolloServer({
            schema,
            context: ({ req, res }): { req: Request; res: Response } => ({
                req,
                res,
            }),
        });

        await server.start();

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
            // "http://localhost:3000",
            // "http://localhost:4000/graphql",
            // "http://localhost:4000",
        ];

        const corsOptions: CorsOptions = {
            credentials: true,
            origin: (origin, callback) => {
                if (allowedOrigins.includes(origin || "invalid"))
                    return callback(null, true);

                callback(new Error(`Not allowed by CORS: ${origin}`));
            },
        };

        app.use(cors(corsOptions));

        server.applyMiddleware({ app });

        app.listen({ port: 4000 }, () => {
            console.log("Server is listening on 4000");
        });

        return { app, server };
    } catch (err) {
        console.log(err);
        console.log("Sorry, no server today");
    }
};

startUp();
