import { User } from "../entities/User";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { MyContext } from "../types";
import { isDefined } from "./isDefined";
import { __test__ } from "../constants";

export const checkAuthHeader = (
  context: MyContext
): JwtPayload | string | null => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    return null;
  }

  const token = authorization.split(" ")[1];
  if (!isDefined(token)) {
    return null;
  }

  try {
    return verify(
      token,
      __test__ ? "testSecret" : process.env.ACCESS_TOKEN_SECRET
    );
  } catch (err) {
    console.log(err);
    return null;
  }
};

export function payloadHasUserId(
  val: JwtPayload | string | null
): val is JwtPayload & { userId: string } {
  return isDefined(val) && typeof val !== "string" && isDefined(val.userId);
}

export const createAccessToken = (user: User) => {
  return sign(
    { userId: user.id },
    __test__ ? "testSecret" : process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "10y",
    }
  );
};

export const userIsAdmin = async (userId: number) => {
  const user = await User.findOne(userId);
  return user?.isAdmin;
};
