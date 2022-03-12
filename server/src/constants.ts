import BigNumber from "bignumber.js";

export const __prod__ = process.env.NODE_ENV === "production";
export const __test__ = process.env.NODE_ENV === "test";
export const COOKIE_NAME = "qid";
export const SPENDING_LIMIT = new BigNumber('1000.00');
