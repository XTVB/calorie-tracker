import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  Query,
  UseMiddleware,
} from "type-graphql";
import { MyContext } from "../types";
import { User } from "../entities/User";
import argon2 from "argon2";
import { isAdmin } from "../middleware/authMiddleware";
import { Not } from "typeorm";
import { UserResponse } from "./objectTypes";
import {
  checkAuthHeader,
  createAccessToken,
  payloadHasUserId,
} from "../utils/auth";

@Resolver(User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() context: MyContext) {
    const payload = checkAuthHeader(context);
    if (!payloadHasUserId(payload)) {
      return null;
    }
    return User.findOne(parseFloat(payload.userId));
  }

  // Used just to set up users more conveniently, registeration via UI is not implemented
  // @Mutation(() => User)
  // async register(
  //   @Arg("options") options: UsernamePasswordInput
  // ): Promise<User> {
  //   const { username, isAdmin } = options;
  //   const hashedPassword = await argon2.hash(options.password);

  //   return User.create({
  //     username,
  //     isAdmin,
  //     password: hashedPassword,
  //   }).save();
  // }

  @Mutation(() => UserResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() context: MyContext
  ): Promise<UserResponse> {
    const payload = checkAuthHeader(context);
    if (payloadHasUserId(payload)) {
      return {
        errors: [
          {
            field: "general",
            message: "already logged in",
          },
        ],
      };
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "that username doesn't exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    return {
      accessToken: createAccessToken(user),
      user,
    };
  }

  @Query(() => [User])
  @UseMiddleware(isAdmin)
  getAllNormalUsers() {
    return User.find({ isAdmin: Not(true) });
  }
}
