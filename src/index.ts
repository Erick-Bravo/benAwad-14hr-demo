import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import express from "express";
import mikroConfig from "./mikro-orm.config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import { createClient } from "redis";
// import cors from "cors";

const RedisStore = connectRedis(session);
const redisClient = createClient({ legacyMode: true });
redisClient.connect().catch(console.error);

declare module "express-session" {
  export interface SessionData {
    userId: number;
  }
}

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();

  // app.use(
  //   cors({
  //     credentials: true,
  //     origin: "http://localhost:4000",
  //   })
  // );

  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      secret: "keyboard cat",
      resave: false,
    })
  );

  app.get("/", (_, res) => {
    res.send("goodbye world");
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  //* Creates a Graphql end point. You can check this by going to localhost:4000/graphql
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    // cors: { credentials: true, origin: "https://studio.apollographql.com" },
  });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main();

console.log("Goodbye world");
