import { checkAuthHeader, payloadHasUserId, userIsAdmin } from "../utils/auth";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const payload = checkAuthHeader(context);
  if (!payloadHasUserId(payload)) {
    throw new Error("not authenticated");
  }
  context.payload = payload;

  return next();
};

export const isAdmin: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const payload = checkAuthHeader(context);
  if (!payloadHasUserId(payload)) {
    throw new Error("not authenticated");
  }

  const isAdmin = await userIsAdmin(parseFloat(payload.userId));
  if (!isAdmin) {
    throw new Error("not admin");
  }

  return next();
};
