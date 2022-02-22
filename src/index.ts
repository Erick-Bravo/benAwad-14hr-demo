import "reflect-metadata"
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import express from "express";
import mikroConfig from "./mikro-orm.config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();

  app.get("/", (_, res) => {
    res.send("goodbye world")
  })

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: () => ({ em: orm.em })
  });

  //* Creates a Graphql end point. You can check this by going to localhost:4000/graphql
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on localhost:4000")
  })

};

main();

console.log("Goodbye world");
