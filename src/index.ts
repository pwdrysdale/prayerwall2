import express, { Express, Request, Response } from "express";
import { ApolloServer } from "apollo-server-express";
import { GraphQLSchema } from "graphql";
import cors from "cors";
import { buildSchema, Query, Resolver } from "type-graphql";
import "reflect-metadata";
import { createConnection } from "typeorm";

const startUp = async () => {
    try {
        await createConnection();

        const app: Express = express();

        @Resolver()
        class HelloResolver {
            @Query()
            hello(): string {
                return "Hello world";
            }
        }

        const schema: GraphQLSchema = await buildSchema({
            resolvers: [HelloResolver],
            // authChecker: authChecker
        });

        const server = new ApolloServer({
            schema,
            context: ({ req, res }): { req: Request; res: Response } => ({
                req,
                res,
            }),
        });

        await server.start();

        server.applyMiddleware({ app });

        app.use(cors());

        app.listen({ port: 4001 }, () => {
            console.log("Server is listening on 4001");
        });

        return { app, server };
    } catch (err) {
        console.log(err);
        console.log("Sorry, no server today");
    }
};

startUp();
