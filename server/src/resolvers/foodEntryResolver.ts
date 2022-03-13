import BigNumber from "bignumber.js";
import {
  Arg,
  Ctx,
  FieldResolver,
  Float,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { FoodEntry } from "../entities/FoodEntry";
import { User } from "../entities/User";
import { isAdmin, isAuth } from "../middleware/authMiddleware";
import { MyContext } from "../types";
import { SPENDING_LIMIT } from "../constants";
import {
  FetchMultipleUsersEntriesInput,
  FetchUserEntriesInput,
  FoodEntryInput,
} from "./inputTypes";
import {
  CostLimitExceedResponse,
  UserEntriesGroup,
  MultipleUsersEntriesResponse,
  FoodEntryResponse,
} from "./objectTypes";
import { findEntriesForUserAndGroupByDay } from "../utils/findEntriesForUserAndGroupByDay";
import { userIsAdmin } from "../utils/auth";
import { validateFoodEntryInput } from "../utils/validateFoodEntryInput";

@Resolver(FoodEntry)
export class FoodEntryResolver {
  @FieldResolver(() => User)
  creator(@Root() entry: FoodEntry, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(entry.creatorId);
  }

  @Query(() => FoodEntry, { nullable: true })
  @UseMiddleware(isAuth)
  async FoodEntry(
    @Arg("id", () => Float) id: number,
    @Arg("userId", () => Float) userId: number,
    @Ctx() { payload }: MyContext
  ): Promise<FoodEntry | undefined> {
    // check if we're admin who can view other's entries
    const requestingUsersId = parseFloat(payload!.userId);
    if (userId !== requestingUsersId) {
      const isAdmin = await userIsAdmin(requestingUsersId);
      if (!isAdmin) {
        throw new Error("trying to view entry for other user when not admin");
      }
    }

    return FoodEntry.findOne({ where: { id, creatorId: userId } });
  }

  @Mutation(() => FoodEntryResponse)
  @UseMiddleware(isAuth)
  async createFoodEntry(
    @Arg("input") input: FoodEntryInput,
    @Ctx() { payload }: MyContext
  ): Promise<FoodEntryResponse> {
    const { creatorId, ...otherParams } = input;

    // check if we're admin who can create entries for others
    const requestingUsersId = parseFloat(payload!.userId);
    if (creatorId !== requestingUsersId) {
      const isAdmin = await userIsAdmin(requestingUsersId);
      if (!isAdmin) {
        throw new Error("trying to create entry for other user when not admin");
      }
    }

    const errors = validateFoodEntryInput(input);
    if (errors) {
      return { errors };
    }

    const entry = await FoodEntry.create({
      ...otherParams,
      creatorId,
    }).save();

    return { entry };
  }

  @Mutation(() => FoodEntryResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async updateFoodEntry(
    @Arg("id", () => Float) id: number,
    @Arg("input") input: FoodEntryInput,
    @Ctx() { payload }: MyContext
  ): Promise<FoodEntryResponse> {
    const { creatorId, ...otherParams } = input;

    // check if we're admin who can edit entries for others
    const requestingUsersId = parseFloat(payload!.userId);
    if (creatorId !== requestingUsersId) {
      const isAdmin = await userIsAdmin(requestingUsersId);
      if (!isAdmin) {
        throw new Error("trying to update entry for other user when not admin");
      }
    }

    const errors = validateFoodEntryInput(input);
    if (errors) {
      return { errors };
    }

    const { date, name, calories, price } = otherParams;
    const result = await getConnection()
      .createQueryBuilder()
      .update(FoodEntry)
      .set({ date, name, calories, price })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId,
      })
      .returning("*")
      .execute();

    return { entry: result.raw[0] };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteFoodEntry(
    @Arg("id", () => Float) id: number,
    @Arg("userId", () => Float) userId: number,
    @Ctx() { payload }: MyContext
  ): Promise<boolean> {
    // check if we're admin who can delete entries for others
    const requestingUsersId = parseFloat(payload!.userId);
    if (userId !== requestingUsersId) {
      const isAdmin = await userIsAdmin(requestingUsersId);
      if (!isAdmin) {
        throw new Error("trying to delete entry for other user when not admin");
      }
    }
    const { affected } = await FoodEntry.delete({ id, creatorId: userId });

    // return whether anything was deleted
    return !!affected;
  }

  @Query(() => [UserEntriesGroup])
  @UseMiddleware(isAuth)
  async getUserEntries(
    @Arg("input") input: FetchUserEntriesInput,
    @Ctx() { payload }: MyContext
  ): Promise<UserEntriesGroup[]> {
    const { dateFrom, dateTo, userId } = input;

    // check if we're admin who can read others entries
    const requestingUsersId = parseFloat(payload!.userId);
    if (userId !== requestingUsersId) {
      const isAdmin = await userIsAdmin(requestingUsersId);
      if (!isAdmin) {
        throw new Error("can't see other user's entries when not admin");
      }
    }

    return findEntriesForUserAndGroupByDay(dateFrom, dateTo, userId);
  }

  @Query(() => [MultipleUsersEntriesResponse])
  @UseMiddleware(isAdmin)
  async getMultipleUsersEntries(
    @Arg("input") input: FetchMultipleUsersEntriesInput
  ): Promise<MultipleUsersEntriesResponse[]> {
    const { dateFrom, dateTo, userIds } = input;

    return Promise.all(
      userIds.map(async (userId) => {
        const groupedEntries = await findEntriesForUserAndGroupByDay(
          dateFrom,
          dateTo,
          userId
        );

        return groupedEntries.length > 0
          ? [
              {
                userId,
                groupedEntries,
              },
            ]
          : [];
      })
    ).then((response) => response.flat());
  }

  @Query(() => [CostLimitExceedResponse])
  @UseMiddleware(isAuth)
  async exceededLimit(
    @Arg("input") input: FetchUserEntriesInput,
    @Ctx() { payload }: MyContext
  ): Promise<CostLimitExceedResponse[]> {
    const { dateFrom, dateTo, userId } = input;

    // check if we're admin who can read others entries
    const requestingUsersId = parseFloat(payload!.userId);
    if (userId !== requestingUsersId) {
      const isAdmin = await userIsAdmin(requestingUsersId);
      if (!isAdmin) {
        throw new Error("can't see other user's entries when not admin");
      }
    }

    const startMonth = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), 1);
    const lastMonth = new Date(dateTo.getFullYear(), dateTo.getMonth() + 1, 0);

    const result = (await getConnection().query(
      `
      SELECT to_char(date_trunc('month', date), 'MM') AS month,
        to_char(date_trunc('month', date), 'YYYY') AS year,
        sum(price) AS monthly_sum
      FROM food_entry
      WHERE date BETWEEN $1 AND $2 AND "creatorId" = $3
      GROUP BY date_trunc('month', date)
      ORDER BY date_trunc('month', date) DESC;
      `,
      [startMonth, lastMonth, userId]
    )) as {
      month: string;
      year: string;
      monthly_sum: string;
    }[];

    return result.map(({ month, year, monthly_sum }) => {
      return {
        month: `${month}/${year}`,
        limitExceeded: new BigNumber(monthly_sum).gt(SPENDING_LIMIT),
      };
    });
  }
}
