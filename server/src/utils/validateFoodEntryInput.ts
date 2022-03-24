import BigNumber from "bignumber.js";
import { FoodEntryInput } from "../resolvers/inputTypes";
import { isDefined } from "./isDefined";

export const validateFoodEntryInput = (options: FoodEntryInput) => {
  const { date, name, calories, price } = options;
  const errorArray = [];
  if (date > new Date()) {
    errorArray.push({
      field: "date",
      message: "Date must be in the past",
    });
  }

  if (name.length > 255) {
    errorArray.push({
      field: "name",
      message: "Name must have less than 255 characters",
    });
  }

  if (calories <= 0 || calories > 10000) {
    errorArray.push({
      field: "calories",
      message: "Calories values must between 1 and 10000",
    });
  }

  if (isDefined(price)) {
    const bigPrice = new BigNumber(price);
    if (
      bigPrice.lte(new BigNumber("0.00")) ||
      bigPrice.gt(new BigNumber("10000.00"))
    ) {
      errorArray.push({
        field: "price",
        message: "Price must be between 0.01 and 10000.00",
      });
    }
  }

  return errorArray.length > 0 ? errorArray : null;
};
