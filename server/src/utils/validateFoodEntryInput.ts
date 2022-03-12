import BigNumber from "bignumber.js";
import { FoodEntryInput } from "../resolvers/inputTypes";
import { isDefined } from "./isDefined";

export const validateFoodEntryInput = (options: FoodEntryInput) => {
  const { date, name, calories, price } = options;
  if (date > new Date()) {
    return [
      {
        field: "date",
        message: "Date must be in the past",
      },
    ];
  }

  if (name.length > 255) {
    return [
      {
        field: "name",
        message: "Name must have less than 255 characters",
      },
    ];
  }

  if (calories <= 0 || calories > 10000) {
    return [
      {
        field: "calories",
        message: "Calories values must between 1 and 10000",
      },
    ];
  }

  if (isDefined(price)) {
    const bigPrice = new BigNumber(price);
    if (bigPrice.lte(new BigNumber('0.00')) || bigPrice.gt(new BigNumber('10000.00'))) {
      return [
        {
          field: "price",
          message: "Price must be between 0.01 and 10000.00",
        },
      ];
    }
  }

  return null;
};
