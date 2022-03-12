import { FoodEntryResolver } from "../resolvers/foodEntryResolver";
import { UserResolver } from "../resolvers/userResolver";
import { buildSchema } from "type-graphql";

export const createSchema = () => {
  return buildSchema({
    resolvers: [FoodEntryResolver, UserResolver],
    validate: false,
  });
};
