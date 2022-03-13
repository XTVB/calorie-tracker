import faker from "@faker-js/faker";
import { User } from "../entities/User";
import { graphQlTestCall } from "../test-utils/graphQlTestCall";
import { testConn } from "../test-utils/testConn";
import { Connection } from "typeorm";
import { FoodEntry } from "../entities/FoodEntry";
import { createAccessToken } from "../utils/auth";

let conn: Connection;
const TEST_PASSWORD = "testPassword";
let normalUser1: User;
let normalUser1Token: string;
let normalUser2: User;
let normalUser2Token: string;
let adminUser: User;
let adminUserToken: string;
let createFoodEntryVariableValues: Record<"input", any>;
let updateFoodEntryVariableValues: Record<"input", any>;

beforeAll(async () => {
  conn = await testConn();

  await User.delete({});

  normalUser1 = await User.create({
    username: faker.internet.userName(),
    password: TEST_PASSWORD,
    isAdmin: false,
  }).save();

  normalUser1Token = createAccessToken(normalUser1);

  normalUser2 = await User.create({
    username: faker.internet.userName(),
    password: TEST_PASSWORD,
    isAdmin: false,
  }).save();

  normalUser2Token = createAccessToken(normalUser2);

  adminUser = await User.create({
    username: faker.internet.userName(),
    password: TEST_PASSWORD,
    isAdmin: true,
  }).save();

  adminUserToken = createAccessToken(adminUser);

  createFoodEntryVariableValues = {
    input: {
      date: faker.date.recent(10).toISOString(),
      name: "foodName",
      calories: 10,
      price: parseFloat(faker.commerce.price(0.01, 10000)),
      creatorId: normalUser1.id,
    },
  };

  updateFoodEntryVariableValues = {
    input: {
      date: faker.date.recent(10).toISOString(),
      name: "updatedFoodName",
      calories: 11,
      price: parseFloat(faker.commerce.price(0.01, 10000)),
      creatorId: normalUser1.id,
    },
  };
});

afterAll(async () => {
  await conn.close();
});

const createFoodEntryQuery = `
  mutation CreateFoodEntry($input: FoodEntryInput!) {
    createFoodEntry(input: $input) {
      errors {
        field
        message
      }
      entry {
        id
        name
        calories
        date
        price
        creatorId
        creator {
          username
        }
      }
    }
  }
`;

const getFoodEntryQuery = `
  query GetFoodEntry($id: Float!, $userId: Float!) {
    FoodEntry(id: $id, userId: $userId) {
      id
      name
      calories
      date
      price
      creatorId
      creator {
        username
      }
    }
  }
`;

const updateFoodEntryQuery = `
  mutation UpdateFoodEntry($id: Float!, $input: FoodEntryInput!) {
    updateFoodEntry(id: $id, input: $input) {
      errors {
        field
        message
      }
      entry {
        id
        name
        calories
        date
        price
        creatorId
        creator {
          username
        }
      }
    }
  }
`;

const deleteFoodEntryQuery = `
  mutation DeleteFoodEntry($userId: Float!, $id: Float!) {
    deleteFoodEntry(userId: $userId, id: $id)
  }
`;

const getUserEntriesQuery = `
  query GetUserEntries($input: FetchUserEntriesInput!) {
    getUserEntries(input: $input) {
      date
      count
      caloriesTotal
      entries {
        id
        name
        calories
        date
        price
        creatorId
      }
    }
  }
`;

const getMultipleUsersEntriesQuery = `
  query GetMultipleUsersEntries($input: FetchMultipleUsersEntriesInput!) {
    getMultipleUsersEntries(input: $input) {
      userId
      groupedEntries {
        date
        count
        caloriesTotal
        entries {
          id
          name
          calories
          date
          price
          creatorId
        }
      }
    }
  }
`;

const getExceededLimitQuery = `
  query GetExceededLimit($input: FetchUserEntriesInput!) {
    exceededLimit(input: $input) {
      month
      limitExceeded
    }
  }
`;

describe("Food Entry CRUD", () => {
  let foodEntry1: FoodEntry;
  let foodEntry2: FoodEntry;

  describe("Create Food Entry", () => {
    it("Throws correct error if not logged in", async () => {
      const response = await graphQlTestCall({
        source: createFoodEntryQuery,
        variableValues: createFoodEntryVariableValues,
      });

      expect(response.errors).toBeDefined();
      const error = response.errors![0];
      expect(error.message).toEqual("not authenticated");
    });

    it("Throws correct error if not admin and different userId", async () => {
      const response = await graphQlTestCall({
        source: createFoodEntryQuery,
        userToken: normalUser2Token,
        variableValues: createFoodEntryVariableValues,
      });

      expect(response.errors).toBeDefined();
      const error = response.errors![0];
      expect(error.message).toEqual(
        "trying to create entry for other user when not admin"
      );
    });

    it("Throws correct error if creator doesn't exist", async () => {
      const response = await graphQlTestCall({
        source: createFoodEntryQuery,
        userToken: adminUserToken,
        variableValues: {
          input: {
            ...createFoodEntryVariableValues.input,
            creatorId: 999,
          },
        },
      });

      expect(response.errors).toBeDefined();
      const error = response.errors![0];
      expect(error.message).toEqual(
        expect.stringContaining(
          `insert or update on table \"food_entry\" violates foreign key constraint`
        )
      );
    });

    it("Return null and correct warning if date is in the future", async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const response = await graphQlTestCall({
        source: createFoodEntryQuery,
        userToken: normalUser1Token,
        variableValues: {
          input: {
            ...createFoodEntryVariableValues.input,
            date: tomorrow.toISOString(),
          },
        },
      });

      expect(response).toMatchObject({
        data: {
          createFoodEntry: {
            errors: [
              {
                field: "date",
                message: "Date must be in the past",
              },
            ],
            entry: null,
          },
        },
      });
    });

    it("Return null and correct warning if name is too long", async () => {
      const response = await graphQlTestCall({
        source: createFoodEntryQuery,
        userToken: normalUser1Token,
        variableValues: {
          input: {
            ...createFoodEntryVariableValues.input,
            name: faker.random.alpha(256),
          },
        },
      });

      expect(response).toMatchObject({
        data: {
          createFoodEntry: {
            errors: [
              {
                field: "name",
                message: "Name must have less than 255 characters",
              },
            ],
            entry: null,
          },
        },
      });
    });

    it("Return null and correct warning if calories value is invalid", async () => {
      let response = await graphQlTestCall({
        source: createFoodEntryQuery,
        userToken: normalUser1Token,
        variableValues: {
          input: {
            ...createFoodEntryVariableValues.input,
            calories: -1,
          },
        },
      });

      expect(response).toMatchObject({
        data: {
          createFoodEntry: {
            errors: [
              {
                field: "calories",
                message: "Calories values must between 1 and 10000",
              },
            ],
            entry: null,
          },
        },
      });

      response = await graphQlTestCall({
        source: createFoodEntryQuery,
        userToken: normalUser1Token,
        variableValues: {
          input: {
            ...createFoodEntryVariableValues.input,
            calories: 10001,
          },
        },
      });

      expect(response).toMatchObject({
        data: {
          createFoodEntry: {
            errors: [
              {
                field: "calories",
                message: "Calories values must between 1 and 10000",
              },
            ],
            entry: null,
          },
        },
      });
    });

    it("Return null and correct warning if price value is invalid", async () => {
      let response = await graphQlTestCall({
        source: createFoodEntryQuery,
        userToken: normalUser1Token,
        variableValues: {
          input: {
            ...createFoodEntryVariableValues.input,
            price: -0.01,
          },
        },
      });

      expect(response).toMatchObject({
        data: {
          createFoodEntry: {
            errors: [
              {
                field: "price",
                message: "Price must be between 0.01 and 10000.00",
              },
            ],
            entry: null,
          },
        },
      });

      response = await graphQlTestCall({
        source: createFoodEntryQuery,
        userToken: normalUser1Token,
        variableValues: {
          input: {
            ...createFoodEntryVariableValues.input,
            price: 10000.01,
          },
        },
      });

      expect(response).toMatchObject({
        data: {
          createFoodEntry: {
            errors: [
              {
                field: "price",
                message: "Price must be between 0.01 and 10000.00",
              },
            ],
            entry: null,
          },
        },
      });
    });

    it("Creates entry correctly when logged in", async () => {
      const response = await graphQlTestCall({
        source: createFoodEntryQuery,
        userToken: normalUser1Token,
        variableValues: createFoodEntryVariableValues,
      });

      expect(response).toMatchObject({
        data: {
          createFoodEntry: {
            errors: null,
            entry: {
              id: 2,
              ...createFoodEntryVariableValues.input,
              creator: {
                username: normalUser1.username,
              },
            },
          },
        },
      });

      const dbFoodEntry = await FoodEntry.findOne({
        where: { id: 2, ...createFoodEntryVariableValues.input },
      });
      expect(dbFoodEntry).toBeDefined();
      foodEntry1 = dbFoodEntry!;
    });

    it("Creates entry correctly when admin logged in", async () => {
      const response = await graphQlTestCall({
        source: createFoodEntryQuery,
        userToken: adminUserToken,
        variableValues: createFoodEntryVariableValues,
      });

      expect(response).toMatchObject({
        data: {
          createFoodEntry: {
            errors: null,
            entry: {
              id: 3,
              ...createFoodEntryVariableValues.input,
              creator: {
                username: normalUser1.username,
              },
            },
          },
        },
      });

      const dbFoodEntry = await FoodEntry.findOne({
        where: { id: 3, ...createFoodEntryVariableValues.input },
      });
      expect(dbFoodEntry).toBeDefined();
      foodEntry2 = dbFoodEntry!;
    });
  });

  describe("Get Food Entry", () => {
    it("Throws correct error if not logged in", async () => {
      const response = await graphQlTestCall({
        source: getFoodEntryQuery,
        variableValues: {
          id: foodEntry1.id,
          userId: normalUser1.id,
        },
      });

      expect(response.errors).toBeDefined();
      const error = response.errors![0];
      expect(error.message).toEqual("not authenticated");
    });

    it("Throws correct error if not admin and different userId", async () => {
      const response = await graphQlTestCall({
        source: getFoodEntryQuery,
        userToken: normalUser2Token,
        variableValues: {
          id: foodEntry1.id,
          userId: normalUser1.id,
        },
      });

      expect(response.errors).toBeDefined();
      const error = response.errors![0];
      expect(error.message).toEqual(
        "trying to view entry for other user when not admin"
      );
    });

    it("Returns false if entry doesn't exist", async () => {
      const response = await graphQlTestCall({
        source: getFoodEntryQuery,
        userToken: normalUser1Token,
        variableValues: {
          id: 99,
          userId: normalUser1.id,
        },
      });

      expect(response).toMatchObject({
        data: {
          FoodEntry: null,
        },
      });
    });

    it("Returns false if creator doesn't exist", async () => {
      const response = await graphQlTestCall({
        source: getFoodEntryQuery,
        userToken: adminUserToken,
        variableValues: {
          id: foodEntry1.id,
          userId: 99,
        },
      });

      expect(response).toMatchObject({
        data: {
          FoodEntry: null,
        },
      });
    });

    it("Gets entry correctly when logged in", async () => {
      const response = await graphQlTestCall({
        source: getFoodEntryQuery,
        userToken: normalUser1Token,
        variableValues: {
          id: foodEntry1.id,
          userId: normalUser1.id,
        },
      });

      expect(response).toMatchObject({
        data: {
          FoodEntry: {
            id: foodEntry1.id,
            name: foodEntry1.name,
            calories: foodEntry1.calories,
            date: foodEntry1.date.toISOString(),
            price: foodEntry1.price?.toNumber(),
            creatorId: normalUser1.id,
            creator: {
              username: normalUser1.username,
            },
          },
        },
      });
    });

    it("Get entry correctly when admin logged in", async () => {
      const response = await graphQlTestCall({
        source: getFoodEntryQuery,
        userToken: adminUserToken,
        variableValues: {
          id: foodEntry1.id,
          userId: normalUser1.id,
        },
      });

      expect(response).toMatchObject({
        data: {
          FoodEntry: {
            id: foodEntry1.id,
            name: foodEntry1.name,
            calories: foodEntry1.calories,
            date: foodEntry1.date.toISOString(),
            price: foodEntry1.price?.toNumber(),
            creatorId: normalUser1.id,
            creator: {
              username: normalUser1.username,
            },
          },
        },
      });
    });
  });

  describe("Update Food Entry", () => {
    it("Throws correct error if not logged in", async () => {
      const response = await graphQlTestCall({
        source: updateFoodEntryQuery,
        variableValues: {
          id: foodEntry1.id,
          ...updateFoodEntryVariableValues,
        },
      });

      expect(response.errors).toBeDefined();
      const error = response.errors![0];
      expect(error.message).toEqual("not authenticated");
    });

    it("Throws correct error if not admin and different userId", async () => {
      const response = await graphQlTestCall({
        source: updateFoodEntryQuery,
        userToken: normalUser2Token,
        variableValues: {
          id: foodEntry1.id,
          ...updateFoodEntryVariableValues,
        },
      });

      expect(response.errors).toBeDefined();
      const error = response.errors![0];
      expect(error.message).toEqual(
        "trying to update entry for other user when not admin"
      );
    });

    it("Entry is null if creator doesn't exist", async () => {
      const response = await graphQlTestCall({
        source: updateFoodEntryQuery,
        userToken: adminUserToken,
        variableValues: {
          id: foodEntry1.id,
          input: {
            ...updateFoodEntryVariableValues.input,
            creatorId: 999,
          },
        },
      });

      expect(response).toMatchObject({
        data: {
          updateFoodEntry: {
            errors: null,
            entry: null,
          },
        },
      });
    });

    it("Entry is null if entry doesn't exist", async () => {
      const response = await graphQlTestCall({
        source: updateFoodEntryQuery,
        userToken: adminUserToken,
        variableValues: {
          id: 99,
          ...updateFoodEntryVariableValues,
        },
      });

      expect(response).toMatchObject({
        data: {
          updateFoodEntry: {
            errors: null,
            entry: null,
          },
        },
      });
    });

    it("Return null and correct warning if date is in the future", async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const response = await graphQlTestCall({
        source: updateFoodEntryQuery,
        userToken: normalUser1Token,
        variableValues: {
          id: foodEntry1.id,
          input: {
            ...updateFoodEntryVariableValues.input,
            date: tomorrow.toISOString(),
          },
        },
      });

      expect(response).toMatchObject({
        data: {
          updateFoodEntry: {
            errors: [
              {
                field: "date",
                message: "Date must be in the past",
              },
            ],
            entry: null,
          },
        },
      });
    });

    it("Return null and correct warning if name is too long", async () => {
      const response = await graphQlTestCall({
        source: updateFoodEntryQuery,
        userToken: normalUser1Token,
        variableValues: {
          id: foodEntry1.id,
          input: {
            ...updateFoodEntryVariableValues.input,
            name: faker.random.alpha(256),
          },
        },
      });

      expect(response).toMatchObject({
        data: {
          updateFoodEntry: {
            errors: [
              {
                field: "name",
                message: "Name must have less than 255 characters",
              },
            ],
            entry: null,
          },
        },
      });
    });

    it("Return null and correct warning if calories value is invalid", async () => {
      let response = await graphQlTestCall({
        source: updateFoodEntryQuery,
        userToken: normalUser1Token,
        variableValues: {
          id: foodEntry1.id,
          input: {
            ...updateFoodEntryVariableValues.input,
            calories: -1,
          },
        },
      });

      expect(response).toMatchObject({
        data: {
          updateFoodEntry: {
            errors: [
              {
                field: "calories",
                message: "Calories values must between 1 and 10000",
              },
            ],
            entry: null,
          },
        },
      });

      response = await graphQlTestCall({
        source: updateFoodEntryQuery,
        userToken: normalUser1Token,
        variableValues: {
          id: foodEntry1.id,
          input: {
            ...updateFoodEntryVariableValues.input,
            calories: 10001,
          },
        },
      });

      expect(response).toMatchObject({
        data: {
          updateFoodEntry: {
            errors: [
              {
                field: "calories",
                message: "Calories values must between 1 and 10000",
              },
            ],
            entry: null,
          },
        },
      });
    });

    it("Return null and correct warning if price value is invalid", async () => {
      let response = await graphQlTestCall({
        source: updateFoodEntryQuery,
        userToken: normalUser1Token,
        variableValues: {
          id: foodEntry1.id,
          input: {
            ...updateFoodEntryVariableValues.input,
            price: -0.01,
          },
        },
      });

      expect(response).toMatchObject({
        data: {
          updateFoodEntry: {
            errors: [
              {
                field: "price",
                message: "Price must be between 0.01 and 10000.00",
              },
            ],
            entry: null,
          },
        },
      });

      response = await graphQlTestCall({
        source: updateFoodEntryQuery,
        userToken: normalUser1Token,
        variableValues: {
          id: foodEntry1.id,
          input: {
            ...updateFoodEntryVariableValues.input,
            price: 10000.01,
          },
        },
      });

      expect(response).toMatchObject({
        data: {
          updateFoodEntry: {
            errors: [
              {
                field: "price",
                message: "Price must be between 0.01 and 10000.00",
              },
            ],
            entry: null,
          },
        },
      });
    });

    it("Updates entry correctly when logged in", async () => {
      const response = await graphQlTestCall({
        source: updateFoodEntryQuery,
        userToken: normalUser1Token,
        variableValues: {
          id: foodEntry1.id,
          ...updateFoodEntryVariableValues,
        },
      });

      expect(response).toMatchObject({
        data: {
          updateFoodEntry: {
            errors: null,
            entry: {
              id: foodEntry1.id,
              ...updateFoodEntryVariableValues.input,
              creator: {
                username: normalUser1.username,
              },
            },
          },
        },
      });
    });

    it("Creates entry correctly when admin logged in", async () => {
      const response = await graphQlTestCall({
        source: updateFoodEntryQuery,
        userToken: adminUserToken,
        variableValues: {
          id: foodEntry1.id,
          ...updateFoodEntryVariableValues,
        },
      });

      expect(response).toMatchObject({
        data: {
          updateFoodEntry: {
            errors: null,
            entry: {
              id: foodEntry1.id,
              ...updateFoodEntryVariableValues.input,
              creator: {
                username: normalUser1.username,
              },
            },
          },
        },
      });
    });
  });

  describe("Delete Food Entry", () => {
    it("Throws correct error if not logged in", async () => {
      const response = await graphQlTestCall({
        source: deleteFoodEntryQuery,
        variableValues: {
          id: foodEntry1.id,
          userId: normalUser1.id,
        },
      });

      expect(response.errors).toBeDefined();
      const error = response.errors![0];
      expect(error.message).toEqual("not authenticated");
    });

    it("Throws correct error if not admin and different userId", async () => {
      const response = await graphQlTestCall({
        source: deleteFoodEntryQuery,
        userToken: normalUser2Token,
        variableValues: {
          id: foodEntry1.id,
          userId: normalUser1.id,
        },
      });

      expect(response.errors).toBeDefined();
      const error = response.errors![0];
      expect(error.message).toEqual(
        "trying to delete entry for other user when not admin"
      );
    });

    it("Returns false if entry doesn't exist", async () => {
      const response = await graphQlTestCall({
        source: deleteFoodEntryQuery,
        userToken: normalUser1Token,
        variableValues: {
          id: 99,
          userId: normalUser1.id,
        },
      });

      expect(response).toMatchObject({
        data: {
          deleteFoodEntry: false,
        },
      });
    });

    it("Returns false if creator doesn't exist", async () => {
      const response = await graphQlTestCall({
        source: deleteFoodEntryQuery,
        userToken: adminUserToken,
        variableValues: {
          id: foodEntry1.id,
          userId: 99,
        },
      });

      expect(response).toMatchObject({
        data: {
          deleteFoodEntry: false,
        },
      });
    });

    it("Deletes entry correctly when logged in", async () => {
      const response = await graphQlTestCall({
        source: deleteFoodEntryQuery,
        userToken: normalUser1Token,
        variableValues: {
          id: foodEntry1.id,
          userId: normalUser1.id,
        },
      });

      expect(response).toMatchObject({
        data: {
          deleteFoodEntry: true,
        },
      });
    });

    it("Deletes entry correctly when admin logged in", async () => {
      const response = await graphQlTestCall({
        source: deleteFoodEntryQuery,
        userToken: adminUserToken,
        variableValues: {
          id: foodEntry2.id,
          userId: normalUser1.id,
        },
      });

      expect(response).toMatchObject({
        data: {
          deleteFoodEntry: true,
        },
      });
    });
  });
});

describe("Get user food entries", () => {
  let foodEntry1: FoodEntry;
  let foodEntry2: FoodEntry;
  let foodEntry3: FoodEntry;
  let foodEntry4: FoodEntry;
  beforeAll(async () => {
    foodEntry1 = await FoodEntry.create({
      date: "2022-03-09T13:28:56.035Z",
      name: "foodName",
      calories: 10,
      price: parseFloat(faker.commerce.price(0.01, 10000)),
      creatorId: normalUser1.id,
    }).save();

    foodEntry2 = await FoodEntry.create({
      date: "2022-03-09T15:00:00.035Z",
      name: "foodName",
      calories: 10,
      price: parseFloat(faker.commerce.price(0.01, 10000)),
      creatorId: normalUser1.id,
    }).save();

    foodEntry3 = await FoodEntry.create({
      date: "2022-03-10T13:28:56.035Z",
      name: "foodName",
      calories: 10,
      price: parseFloat(faker.commerce.price(0.01, 10000)),
      creatorId: normalUser1.id,
    }).save();

    foodEntry4 = await FoodEntry.create({
      date: "2022-03-10T16:00:00.035Z",
      name: "foodName",
      calories: 10,
      price: parseFloat(faker.commerce.price(0.01, 10000)),
      creatorId: normalUser1.id,
    }).save();
  });

  afterAll(async () => {
    await FoodEntry.delete({});
  });

  it("Throws correct error if not logged in", async () => {
    const response = await graphQlTestCall({
      source: getUserEntriesQuery,
      variableValues: {
        input: {
          userId: normalUser1.id,
          dateFrom: "2022-03-01T00:00:00.000Z",
          dateTo: "2022-04-30T23:59:59.999Z",
        },
      },
    });

    expect(response.errors).toBeDefined();
    const error = response.errors![0];
    expect(error.message).toEqual("not authenticated");
  });

  it("Throws correct error if not admin and different userId", async () => {
    const response = await graphQlTestCall({
      source: getUserEntriesQuery,
      userToken: normalUser2Token,
      variableValues: {
        input: {
          userId: normalUser1.id,
          dateFrom: "2022-03-01T00:00:00.000Z",
          dateTo: "2022-04-30T23:59:59.999Z",
        },
      },
    });

    expect(response.errors).toBeDefined();
    const error = response.errors![0];
    expect(error.message).toEqual(
      "can't see other user's entries when not admin"
    );
  });

  it("Returns empty array if creator doesn't exist", async () => {
    const response = await graphQlTestCall({
      source: getUserEntriesQuery,
      userToken: adminUserToken,
      variableValues: {
        input: {
          userId: 99,
          dateFrom: "2022-03-01T00:00:00.000Z",
          dateTo: "2022-04-30T23:59:59.999Z",
        },
      },
    });

    expect(response).toMatchObject({
      data: {
        getUserEntries: [],
      },
    });
  });

  it("Returns empty array if fromDate after toDate", async () => {
    const response = await graphQlTestCall({
      source: getUserEntriesQuery,
      userToken: normalUser1Token,
      variableValues: {
        input: {
          userId: normalUser1.id,
          dateFrom: "2022-04-30T23:59:59.999Z",
          dateTo: "2022-03-01T00:00:00.000Z",
        },
      },
    });

    expect(response).toMatchObject({
      data: {
        getUserEntries: [],
      },
    });
  });

  it("Returns empty array if date range outside entries", async () => {
    const response = await graphQlTestCall({
      source: getUserEntriesQuery,
      userToken: normalUser1Token,
      variableValues: {
        input: {
          userId: normalUser1.id,
          dateFrom: "2021-03-01T00:00:00.000Z",
          dateTo: "2021-04-30T23:59:59.999Z",
        },
      },
    });

    expect(response).toMatchObject({
      data: {
        getUserEntries: [],
      },
    });
  });

  it("Returns entries correctly when logged in", async () => {
    const response = await graphQlTestCall({
      source: getUserEntriesQuery,
      userToken: normalUser1Token,
      variableValues: {
        input: {
          userId: normalUser1.id,
          dateFrom: "2022-03-01T00:00:00.000Z",
          dateTo: "2022-04-30T23:59:59.999Z",
        },
      },
    });

    const { createdAt: _1, updatedAt: __1, ...foodEntry1Props } = foodEntry1;
    const { createdAt: _2, updatedAt: __2, ...foodEntry2Props } = foodEntry2;
    const { createdAt: _3, updatedAt: __3, ...foodEntry3Props } = foodEntry3;
    const { createdAt: _4, updatedAt: __4, ...foodEntry4Props } = foodEntry4;

    expect(response).toMatchObject({
      data: {
        getUserEntries: [
          {
            date: "10/03/2022",
            count: 2,
            caloriesTotal: 20,
            entries: [
              {
                ...foodEntry4Props,
              },
              {
                ...foodEntry3Props,
              },
            ],
          },
          {
            date: "09/03/2022",
            count: 2,
            caloriesTotal: 20,
            entries: [
              {
                ...foodEntry2Props,
              },
              {
                ...foodEntry1Props,
              },
            ],
          },
        ],
      },
    });
  });

  it("Returns entries correctly when admin logged in", async () => {
    const response = await graphQlTestCall({
      source: getUserEntriesQuery,
      userToken: adminUserToken,
      variableValues: {
        input: {
          userId: normalUser1.id,
          dateFrom: "2022-03-01T00:00:00.000Z",
          dateTo: "2022-04-30T23:59:59.999Z",
        },
      },
    });

    const { createdAt: _1, updatedAt: __1, ...foodEntry1Props } = foodEntry1;
    const { createdAt: _2, updatedAt: __2, ...foodEntry2Props } = foodEntry2;
    const { createdAt: _3, updatedAt: __3, ...foodEntry3Props } = foodEntry3;
    const { createdAt: _4, updatedAt: __4, ...foodEntry4Props } = foodEntry4;

    expect(response).toMatchObject({
      data: {
        getUserEntries: [
          {
            date: "10/03/2022",
            count: 2,
            caloriesTotal: 20,
            entries: [
              {
                ...foodEntry4Props,
              },
              {
                ...foodEntry3Props,
              },
            ],
          },
          {
            date: "09/03/2022",
            count: 2,
            caloriesTotal: 20,
            entries: [
              {
                ...foodEntry2Props,
              },
              {
                ...foodEntry1Props,
              },
            ],
          },
        ],
      },
    });
  });
});

describe("Get multiple users food entries", () => {
  let foodEntry1: FoodEntry;
  let foodEntry2: FoodEntry;
  let foodEntry3: FoodEntry;
  let foodEntry4: FoodEntry;
  let foodEntry5: FoodEntry;
  let foodEntry6: FoodEntry;
  beforeAll(async () => {
    foodEntry1 = await FoodEntry.create({
      date: "2022-03-09T13:28:56.035Z",
      name: "foodName",
      calories: 10,
      price: parseFloat(faker.commerce.price(0.01, 10000)),
      creatorId: normalUser1.id,
    }).save();

    foodEntry2 = await FoodEntry.create({
      date: "2022-03-09T15:00:00.035Z",
      name: "foodName",
      calories: 10,
      price: parseFloat(faker.commerce.price(0.01, 10000)),
      creatorId: normalUser1.id,
    }).save();

    foodEntry3 = await FoodEntry.create({
      date: "2022-03-10T13:28:56.035Z",
      name: "foodName",
      calories: 10,
      price: parseFloat(faker.commerce.price(0.01, 10000)),
      creatorId: normalUser1.id,
    }).save();

    foodEntry4 = await FoodEntry.create({
      date: "2022-03-10T16:00:00.035Z",
      name: "foodName",
      calories: 10,
      price: parseFloat(faker.commerce.price(0.01, 10000)),
      creatorId: normalUser1.id,
    }).save();

    foodEntry5 = await FoodEntry.create({
      date: "2022-03-10T13:28:56.035Z",
      name: "foodName",
      calories: 10,
      price: parseFloat(faker.commerce.price(0.01, 10000)),
      creatorId: normalUser2.id,
    }).save();

    foodEntry6 = await FoodEntry.create({
      date: "2022-03-10T16:00:00.035Z",
      name: "foodName",
      calories: 10,
      price: parseFloat(faker.commerce.price(0.01, 10000)),
      creatorId: normalUser2.id,
    }).save();
  });

  afterAll(async () => {
    await FoodEntry.delete({});
  });

  it("Throws correct error if not logged in", async () => {
    const response = await graphQlTestCall({
      source: getMultipleUsersEntriesQuery,
      variableValues: {
        input: {
          userIds: [normalUser1.id, normalUser2.id],
          dateFrom: "2022-03-01T00:00:00.000Z",
          dateTo: "2022-04-30T23:59:59.999Z",
        },
      },
    });

    expect(response.errors).toBeDefined();
    const error = response.errors![0];
    expect(error.message).toEqual("not authenticated");
  });

  it("Throws correct error if not admin", async () => {
    const response = await graphQlTestCall({
      source: getMultipleUsersEntriesQuery,
      userToken: normalUser2Token,
      variableValues: {
        input: {
          userIds: [normalUser1.id, normalUser2.id],
          dateFrom: "2022-03-01T00:00:00.000Z",
          dateTo: "2022-04-30T23:59:59.999Z",
        },
      },
    });

    expect(response.errors).toBeDefined();
    const error = response.errors![0];
    expect(error.message).toEqual("not admin");
  });

  it("Returns empty array if creator doesn't exist", async () => {
    const response = await graphQlTestCall({
      source: getMultipleUsersEntriesQuery,
      userToken: adminUserToken,
      variableValues: {
        input: {
          userIds: [98, 99],
          dateFrom: "2022-03-01T00:00:00.000Z",
          dateTo: "2022-04-30T23:59:59.999Z",
        },
      },
    });

    expect(response).toMatchObject({
      data: {
        getMultipleUsersEntries: [],
      },
    });
  });

  it("Returns empty array if fromDate after toDate", async () => {
    const response = await graphQlTestCall({
      source: getMultipleUsersEntriesQuery,
      userToken: adminUserToken,
      variableValues: {
        input: {
          userIds: [normalUser1.id, normalUser2.id],
          dateFrom: "2022-04-30T23:59:59.999Z",
          dateTo: "2022-03-01T00:00:00.000Z",
        },
      },
    });

    expect(response).toMatchObject({
      data: {
        getMultipleUsersEntries: [],
      },
    });
  });

  it("Returns empty array if date range outside entries", async () => {
    const response = await graphQlTestCall({
      source: getMultipleUsersEntriesQuery,
      userToken: adminUserToken,
      variableValues: {
        input: {
          userIds: [normalUser1.id, normalUser2.id],
          dateFrom: "2021-03-01T00:00:00.000Z",
          dateTo: "2021-04-30T23:59:59.999Z",
        },
      },
    });

    expect(response).toMatchObject({
      data: {
        getMultipleUsersEntries: [],
      },
    });
  });

  it("Returns entries correctly when admin logged in", async () => {
    const response = await graphQlTestCall({
      source: getMultipleUsersEntriesQuery,
      userToken: adminUserToken,
      variableValues: {
        input: {
          userIds: [normalUser1.id, normalUser2.id],
          dateFrom: "2022-03-01T00:00:00.000Z",
          dateTo: "2022-04-30T23:59:59.999Z",
        },
      },
    });

    const { createdAt: _1, updatedAt: __1, ...foodEntry1Props } = foodEntry1;
    const { createdAt: _2, updatedAt: __2, ...foodEntry2Props } = foodEntry2;
    const { createdAt: _3, updatedAt: __3, ...foodEntry3Props } = foodEntry3;
    const { createdAt: _4, updatedAt: __4, ...foodEntry4Props } = foodEntry4;
    const { createdAt: _5, updatedAt: __5, ...foodEntry5Props } = foodEntry5;
    const { createdAt: _6, updatedAt: __6, ...foodEntry6Props } = foodEntry6;

    expect(response).toMatchObject({
      data: {
        getMultipleUsersEntries: [
          {
            userId: normalUser1.id,
            groupedEntries: [
              {
                date: "10/03/2022",
                count: 2,
                caloriesTotal: 20,
                entries: [
                  {
                    ...foodEntry4Props,
                  },
                  {
                    ...foodEntry3Props,
                  },
                ],
              },
              {
                date: "09/03/2022",
                count: 2,
                caloriesTotal: 20,
                entries: [
                  {
                    ...foodEntry2Props,
                  },
                  {
                    ...foodEntry1Props,
                  },
                ],
              },
            ],
          },
          {
            userId: normalUser2.id,
            groupedEntries: [
              {
                date: "10/03/2022",
                count: 2,
                caloriesTotal: 20,
                entries: [
                  {
                    ...foodEntry6Props,
                  },
                  {
                    ...foodEntry5Props,
                  },
                ],
              },
            ],
          },
        ],
      },
    });
  });
});

describe("Exceeded limit", () => {
  beforeAll(async () => {
    await FoodEntry.create({
      date: "2022-03-09T13:28:56.035Z",
      name: "foodName",
      calories: 10,
      price: 12.34,
      creatorId: normalUser1.id,
    }).save();

    await FoodEntry.create({
      date: "2022-03-09T15:00:00.035Z",
      name: "foodName",
      calories: 10,
      price: 23.45,
      creatorId: normalUser1.id,
    }).save();

    await FoodEntry.create({
      date: "2022-04-10T13:28:56.035Z",
      name: "foodName",
      calories: 10,
      price: 9999.99,
      creatorId: normalUser1.id,
    }).save();

    await FoodEntry.create({
      date: "2022-04-10T16:00:00.035Z",
      name: "foodName",
      calories: 10,
      price: 0.02,
      creatorId: normalUser1.id,
    }).save();
  });

  afterAll(async () => {
    await FoodEntry.delete({});
  });

  it("Throws correct error if not logged in", async () => {
    const response = await graphQlTestCall({
      source: getExceededLimitQuery,
      variableValues: {
        input: {
          userId: normalUser1.id,
          dateFrom: "2022-03-04T07:23:14.610Z",
          dateTo: "2022-04-27T20:50:00.769Z",
        },
      },
    });

    expect(response.errors).toBeDefined();
    const error = response.errors![0];
    expect(error.message).toEqual("not authenticated");
  });

  it("Throws correct error if not admin and different userId", async () => {
    const response = await graphQlTestCall({
      source: getExceededLimitQuery,
      userToken: normalUser2Token,
      variableValues: {
        input: {
          userId: normalUser1.id,
          dateFrom: "2022-03-04T07:23:14.610Z",
          dateTo: "2022-04-27T20:50:00.769Z",
        },
      },
    });

    expect(response.errors).toBeDefined();
    const error = response.errors![0];
    expect(error.message).toEqual(
      "can't see other user's entries when not admin"
    );
  });

  it("Returns empty array if creator doesn't exist", async () => {
    const response = await graphQlTestCall({
      source: getExceededLimitQuery,
      userToken: adminUserToken,
      variableValues: {
        input: {
          userId: 99,
          dateFrom: "2022-03-04T07:23:14.610Z",
          dateTo: "2022-04-27T20:50:00.769Z",
        },
      },
    });

    expect(response).toMatchObject({
      data: {
        exceededLimit: [],
      },
    });
  });

  it("Returns empty array if fromDate after toDate", async () => {
    const response = await graphQlTestCall({
      source: getExceededLimitQuery,
      userToken: normalUser1Token,
      variableValues: {
        input: {
          userId: normalUser1.id,
          dateFrom: "2022-04-30T23:59:59.999Z",
          dateTo: "2022-03-01T00:00:00.000Z",
        },
      },
    });

    expect(response).toMatchObject({
      data: {
        exceededLimit: [],
      },
    });
  });

  it("Returns empty array if date range outside entries", async () => {
    const response = await graphQlTestCall({
      source: getExceededLimitQuery,
      userToken: normalUser1Token,
      variableValues: {
        input: {
          userId: normalUser1.id,
          dateFrom: "2021-03-01T00:00:00.000Z",
          dateTo: "2021-04-30T23:59:59.999Z",
        },
      },
    });

    expect(response).toMatchObject({
      data: {
        exceededLimit: [],
      },
    });
  });

  it("Returns entries correctly when logged in", async () => {
    const response = await graphQlTestCall({
      source: getExceededLimitQuery,
      userToken: normalUser1Token,
      variableValues: {
        input: {
          userId: normalUser1.id,
          dateFrom: "2022-03-04T07:23:14.610Z",
          dateTo: "2022-04-27T20:50:00.769Z",
        },
      },
    });

    expect(response).toMatchObject({
      data: {
        exceededLimit: [
          {
            month: "04/2022",
            limitExceeded: true,
          },
          {
            month: "03/2022",
            limitExceeded: false,
          },
        ],
      },
    });
  });

  it("Returns entries correctly when admin logged in", async () => {
    const response = await graphQlTestCall({
      source: getExceededLimitQuery,
      userToken: adminUserToken,
      variableValues: {
        input: {
          userId: normalUser1.id,
          dateFrom: "2022-03-04T07:23:14.610Z",
          dateTo: "2022-04-27T20:50:00.769Z",
        },
      },
    });

    expect(response).toMatchObject({
      data: {
        exceededLimit: [
          {
            month: "04/2022",
            limitExceeded: true,
          },
          {
            month: "03/2022",
            limitExceeded: false,
          },
        ],
      },
    });
  });
});
