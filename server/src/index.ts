import "reflect-metadata";
import "dotenv-safe/config";
import { __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
import { FoodEntry } from "./entities/FoodEntry";
import { User } from "./entities/User";
import { createUserLoader } from "./utils/createUserLoader";
import { createSchema } from "./utils/createSchema";

const main = async () => {
  await createConnection({
    type: "postgres",
    database: "caloriesapp",
    username: "postgres",
    password: "postgres",
    logging: !__prod__,
    synchronize: true,
    entities: [User, FoodEntry],
  });

  const app = express();

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      req,
      res,
      userLoader: createUserLoader(),
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(parseInt(process.env.PORT), () => {
    console.log(`server started on localhost:${process.env.PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});
