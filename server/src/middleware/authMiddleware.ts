import { userIsAdmin } from "../utils/checkIsAdmin";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types";

export const isAuth: MiddlewareFn<MyContext> = ({ context: { req } }, next) => {
  if (!req.session.userId) {
    throw new Error("not authenticated");
  }

  return next();
};

export const isAdmin: MiddlewareFn<MyContext> = async (
  { context: { req } },
  next
) => {
  if (!req.session.userId) {
    throw new Error("not authenticated");
  }

  const isAdmin = await userIsAdmin(req.session.userId);
  if (!isAdmin) {
    throw new Error("not admin");
  }

  return next();
};
