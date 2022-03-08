import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { getConnection } from "typeorm";
import { FoodEntry } from "../entities/FoodEntry";
import { User } from "../entities/User";
// import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
class FoodEntryInput {
  @Field()
  date: Date;
  @Field()
  name: string;
  @Field()
  calories: number;
  @Field()
  price: number;
}

// @ObjectType()
// class PaginatedPosts {
//   @Field(() => [FoodEntry])
//   posts: FoodEntry[];
//   @Field()
//   hasMore: boolean;
// }

@Resolver(FoodEntry)
export class FoodEntryResolver {

  @FieldResolver(() => User)
  creator(@Root() FoodEntry: FoodEntry, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(FoodEntry.creatorId);
  }

  @Query(() => FoodEntry, { nullable: true })
  FoodEntry(@Arg("id", () => Int) id: number): Promise<FoodEntry | undefined> {
    return FoodEntry.findOne(id);
  }

  @Mutation(() => FoodEntry)
  // @UseMiddleware(isAuth)
  async createFoodEntry(
    @Arg("input") input: FoodEntryInput,
    @Ctx() { req }: MyContext
  ): Promise<FoodEntry> {
    return FoodEntry.create({
      ...input,
      // TODO userID
      creatorId: 0,
    }).save();
  }

  @Mutation(() => FoodEntry, { nullable: true })
  // @UseMiddleware(isAuth)
  async updateFoodEntry(
    @Arg("id", () => Int) id: number,
    @Arg("input") input: FoodEntryInput,
    @Ctx() { req }: MyContext
  ): Promise<FoodEntry | null> {
    const {date, name, calories, price} = input;
    const result = await getConnection()
      .createQueryBuilder()
      .update(FoodEntry)
      .set({ date, name, calories, price })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        // TODO userID
        creatorId: 0,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  // @UseMiddleware(isAuth)
  async deleteFoodEntry(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    // TODO userID
    await FoodEntry.delete({ id, creatorId: 0 });
    // TODO, check if it worked and return based on that?
    return true;
  }
}
