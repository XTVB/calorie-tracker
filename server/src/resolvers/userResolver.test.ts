import faker from "@faker-js/faker";
import { User } from "../entities/User";
import { graphQlTestCall } from "../test-utils/graphQlTestCall";
import { testConn } from "../test-utils/testConn";
import { Connection } from "typeorm";
import argon2 from "argon2";
import { createAccessToken } from "../utils/auth";

let conn: Connection;
const TEST_PASSWORD = "testPassword";
let normalUser1: User;
let normalUser2: User;
let adminUser: User;

beforeAll(async () => {
  conn = await testConn();

  await User.delete({});

  normalUser1 = await User.create({
    username: faker.internet.userName(),
    password: await argon2.hash(TEST_PASSWORD),
    isAdmin: false,
  }).save();

  normalUser2 = await User.create({
    username: faker.internet.userName(),
    password: await argon2.hash(TEST_PASSWORD),
    isAdmin: false,
  }).save();

  adminUser = await User.create({
    username: faker.internet.userName(),
    password: await argon2.hash(TEST_PASSWORD),
    isAdmin: true,
  }).save();
});

afterAll(async () => {
  await conn.close();
});

const meQuery = `
  {
    me {
      id
      username
      isAdmin
    }
  }
`;

const loginQuery = `
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      errors {
        field
        message
      }
      accessToken
      user {
        id
        username
        isAdmin
      }
    }
  }
`;

const getAllNormalUsersQuery = `
  query AllUsers {
    getAllNormalUsers {
      id
      username
      isAdmin
    }
  }
`;

describe("Me query", () => {
  it("Get user", async () => {
    const response = await graphQlTestCall({
      source: meQuery,
      userToken: createAccessToken(normalUser1)
    });

    expect(response).toMatchObject({
      data: {
        me: {
          id: normalUser1.id,
          username: normalUser1.username,
          isAdmin: normalUser1.isAdmin,
        },
      },
    });
  });

  it("Return null if userId token doesn't exist", async () => {
    const response = await graphQlTestCall({
      source: meQuery,
    });

    expect(response).toMatchObject({
      data: {
        me: null,
      },
    });
  });
});

describe("Login mutation", () => {
  it("Returns correct user on succesfull login", async () => {
    const response = await graphQlTestCall({
      source: loginQuery,
      variableValues: {
        username: normalUser1.username,
        password: TEST_PASSWORD,
      },
    });

    expect(response).toMatchObject({
      data: {
        login: {
          errors: null,
          accessToken: expect.any(String),
          user: {
            id: normalUser1.id,
            username: normalUser1.username,
            isAdmin: normalUser1.isAdmin,
          },
        },
      },
    });
  });

  it("Return null and correct warning if already logged in", async () => {
    const response = await graphQlTestCall({
      source: loginQuery,
      variableValues: {
        username: normalUser1.username,
        password: TEST_PASSWORD,
      },
      userToken: createAccessToken(normalUser1)
    });

    expect(response).toMatchObject({
      data: {
        login: {
          errors: [
            {
              field: "general",
              message: "already logged in",
            },
          ],
          accessToken: null,
          user: null,
        },
      },
    });
  });

  it("Return null and correct warning if username invalid", async () => {
    const response = await graphQlTestCall({
      source: loginQuery,
      variableValues: {
        username: `${normalUser1.username}-not`,
        password: TEST_PASSWORD,
      },
    });

    expect(response).toMatchObject({
      data: {
        login: {
          errors: [
            {
              field: "username",
              message: "that username doesn't exist",
            },
          ],
          accessToken: null,
          user: null,
        },
      },
    });
  });

  it("Return null and correct warning if password invalid", async () => {
    const response = await graphQlTestCall({
      source: loginQuery,
      variableValues: {
        username: normalUser1.username,
        password: `${TEST_PASSWORD}-not`,
      },
    });

    expect(response).toMatchObject({
      data: {
        login: {
          errors: [
            {
              field: "password",
              message: "incorrect password",
            },
          ],
          accessToken: null,
          user: null,
        },
      },
    });
  });
});

describe("Get all normal users", () => {
  it("Throws correct error if not logged in", async () => {
    const response = await graphQlTestCall({
      source: getAllNormalUsersQuery,
    });

    expect(response.errors).toBeDefined();
    const error = response.errors![0];
    expect(error.message).toEqual("not authenticated");
  });

  it("Throws correct error if not admin", async () => {
    const response = await graphQlTestCall({
      source: getAllNormalUsersQuery,
      userToken: createAccessToken(normalUser1)
    });

    expect(response.errors).toBeDefined();
    const error = response.errors![0];
    expect(error.message).toEqual("not admin");
  });

  it("Returns list of normal users", async () => {
    const response = await graphQlTestCall({
      source: getAllNormalUsersQuery,
      userToken: createAccessToken(adminUser)
    });

    expect(response).toMatchObject({
      data: {
        getAllNormalUsers: [
          {
            id: normalUser1.id,
            username: normalUser1.username,
            isAdmin: false,
          },
          {
            id: normalUser2.id,
            username: normalUser2.username,
            isAdmin: false,
          },
        ],
      },
    });
  });
});
