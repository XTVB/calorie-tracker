import { FoodEntry } from "../entities/FoodEntry";
import { UserEntriesGroup } from "../resolvers/objectTypes";
import { Between } from "typeorm";

type UserEntryType = {
  caloriesTotal: number;
  count: number;
  entries: FoodEntry[];
};

export const findEntriesForUserAndGroupByDay = async (
  dateFrom: Date,
  dateTo: Date,
  userId: number
): Promise<UserEntriesGroup[]> => {
  const entries = await FoodEntry.find({
    where: { date: Between(dateFrom, dateTo), creatorId: userId },
  });

  const groupedEntries = entries.reduce((result, currentValue) => {
    const key = currentValue.date.toLocaleDateString();
    let entry = result[key] || {
      count: 0,
      caloriesTotal: 0,
      entries: [],
    };

    result[key] = {
      count: entry.count + 1,
      caloriesTotal: entry.caloriesTotal + currentValue.calories,
      entries: entry.entries.concat([currentValue]),
    };
    return result;
  }, {} as Record<string, UserEntryType>);

  return Object.keys(groupedEntries).map((date) => {
    return {
      date,
      ...groupedEntries[date],
    };
  });
};
