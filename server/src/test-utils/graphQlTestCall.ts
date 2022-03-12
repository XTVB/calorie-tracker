import { graphql, GraphQLSchema } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";
import { createUserLoader } from "../utils/createUserLoader";
import { createSchema } from "../utils/createSchema";

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
  userToken?: string;
}

let schema: GraphQLSchema;
let userLoader: ReturnType<typeof createUserLoader>;

export const graphQlTestCall = async ({
  source,
  variableValues,
  userToken,
}: Options) => {
  if (!userLoader) {
    userLoader = createUserLoader();
  }

  if (!schema) {
    schema = await createSchema();
  }

  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      req: {
        headers: {
          ...(typeof userToken !== "undefined" && {
            authorization: `bearer ${userToken}`,
          }),
        },
      },
      userLoader
    },
  });
};
