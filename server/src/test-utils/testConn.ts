import { FoodEntry } from "../entities/FoodEntry";
import { User } from "../entities/User";
import { createConnection } from "typeorm";

export const testConn = (drop: boolean = false) => {
  return createConnection({
    type: "postgres",
    database: "caloriesapptest",
    username: "postgres",
    password: "postgres",
    synchronize: drop,
    dropSchema: drop,
    entities: [User, FoodEntry],
  });
};
