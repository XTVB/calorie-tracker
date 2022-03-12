import BigNumber from "bignumber.js";
import { Field, Float, InputType } from "type-graphql";

@InputType()
export class FoodEntryInput {
  @Field()
  creatorId: number;
  @Field()
  date: Date;
  @Field()
  name: string;
  @Field()
  calories: number;
  @Field(() => Float, { nullable: true })
  price?: BigNumber;
}

@InputType()
export class BaseUserEntriesInput {
  @Field()
  dateFrom: Date;
  @Field()
  dateTo: Date;
}

@InputType()
export class FetchUserEntriesInput extends BaseUserEntriesInput {
  @Field()
  userId: number;
}

@InputType()
export class FetchMultipleUsersEntriesInput extends BaseUserEntriesInput {
  @Field(() => [Float])
  userIds: number[];
}


// @InputType()
// export class UsernamePasswordInput {
//   @Field()
//   username: string;
//   @Field()
//   password: string;
//   @Field()
//   isAdmin: boolean;
// }

