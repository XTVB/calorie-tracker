import { FoodEntry } from "../entities/FoodEntry";
import { Field, ObjectType } from "type-graphql";
import { User } from "../entities/User";

@ObjectType()
export class UserEntriesGroup {
  @Field()
  date: string;

  @Field()
  count: number;

  @Field()
  caloriesTotal: number;

  @Field(() => [FoodEntry])
  entries: FoodEntry[];
}

@ObjectType()
export class MultipleUsersEntriesResponse {
  @Field()
  userId: number;

  @Field(() => [UserEntriesGroup])
  groupedEntries: UserEntriesGroup[];
}

@ObjectType()
export class CostLimitExceedResponse {
  @Field()
  month: string;

  @Field()
  limitExceeded: boolean;
}

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class ErrorResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@ObjectType()
export class UserResponse extends ErrorResponse {
  @Field({ nullable: true })
  accessToken?: string;
  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class FoodEntryResponse extends ErrorResponse {
  @Field(() => FoodEntry, { nullable: true })
  entry?: FoodEntry;
}
