import { userIsAdmin } from "../utils/checkIsAdmin";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Float,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Between, getConnection } from "typeorm";
import { FoodEntry } from "../entities/FoodEntry";
import { User } from "../entities/User";
import { isAuth } from "../middleware/authMiddleware";
import { MyContext } from "../types";

@InputType()
class FoodEntryInput {
  @Field()
  userId: number;
  @Field()
  date: Date;
  @Field()
  name: string;
  @Field()
  calories: number;
  @Field({ nullable: true })
  price?: number;
}

@InputType()
class FetchUserEntriesInput {
  @Field()
  dateFrom: Date;
  @Field()
  dateTo: Date;
  // TODO
  // @Field()
  // userIds: number[];
  @Field()
  userId: number;
}

@ObjectType()
class UserEntry {
  // @Field(() => User)
  // user: User;

  @Field(() => [FoodEntry], { nullable: true })
  entries?: FoodEntry[];
}

@Resolver(FoodEntry)
export class FoodEntryResolver {
  @FieldResolver(() => User)
  creator(@Root() entry: FoodEntry, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(entry.creatorId);
  }

  @Query(() => FoodEntry, { nullable: true })
  FoodEntry(@Arg("id", () => Int) id: number): Promise<FoodEntry | undefined> {
    return FoodEntry.findOne(id);
  }

  @Mutation(() => FoodEntry)
  @UseMiddleware(isAuth)
  async createFoodEntry(
    @Arg("input") input: FoodEntryInput,
    @Ctx() { req }: MyContext
  ): Promise<FoodEntry> {
    const { userId, ...otherParams } = input;

    // check if we're admin who can create entries for others
    if (userId !== req.session.userId) {
      const isAdmin = await userIsAdmin(req.session.userId);
      if (!isAdmin) {
        throw new Error("trying to create entry for other user when not admin");
      }
    }

    return FoodEntry.create({
      ...otherParams,
      creatorId: userId,
    }).save();
  }

  @Mutation(() => FoodEntry, { nullable: true })
  @UseMiddleware(isAuth)
  async updateFoodEntry(
    @Arg("id", () => Int) id: number,
    @Arg("input") input: FoodEntryInput,
    @Ctx() { req }: MyContext
  ): Promise<FoodEntry | null> {
    const { userId, ...otherParams } = input;

    // check if we're admin who can edit entries for others
    if (userId !== req.session.userId) {
      const isAdmin = await userIsAdmin(req.session.userId);
      if (!isAdmin) {
        throw new Error("trying to update entry for other user when not admin");
      }
    }

    const { date, name, calories, price } = otherParams;
    const result = await getConnection()
      .createQueryBuilder()
      .update(FoodEntry)
      .set({ date, name, calories, price })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId: userId,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteFoodEntry(
    @Arg("id", () => Int) id: number,
    @Arg("userId", () => Float) userId: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    // check if we're admin who can delete entries for others
    if (userId !== req.session.userId) {
      const isAdmin = await userIsAdmin(req.session.userId);
      if (!isAdmin) {
        throw new Error("trying to delete entry for other user when not admin");
      }
    }
    await FoodEntry.delete({ id, creatorId: userId });
    // TODO, check if it worked and return based on that?
    return true;
  }

  @Query(() => [UserEntry], { nullable: true })
  @UseMiddleware(isAuth)
  async getFoodEntries(
    @Arg("input") input: FetchUserEntriesInput,
    @Ctx() { req }: MyContext
  ): Promise<UserEntry[] | undefined> {
    const { dateFrom, dateTo, userId } = input;

    // check if we're admin who can read others entries
    if (userId !== req.session.userId) {
      const isAdmin = await userIsAdmin(req.session.userId);
      if (!isAdmin) {
        throw new Error("can't see other users' entries when not admin");
      }
    }

    const entries = await FoodEntry.find({
      where: { date: Between(dateFrom, dateTo), creatorId: userId },
    });

    return [{ entries }];
  }

  // TODO
  // @Query(() => [UserEntry], { nullable: true })
  // @UseMiddleware(isAuth)
  // exceededLimit(
  //   @Arg("input") input: FetchUserEntriesInput,
  //   @Ctx() { req }: MyContext
  // ): Promise<UserEntry[] | undefined> {

  //   return FoodEntry.findOne(id);
  // }
}
