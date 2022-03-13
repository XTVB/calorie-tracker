import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { EditDeleteEntryButtons } from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import {
  useGetExceededLimitQuery,
  useGetUserEntriesQuery,
} from "../generated/graphql";
import { perUserCaloriesLimit } from "../utils/calorieLimitPerUser";
import { isDefined } from "../utils/isDefined";
import { withApollo } from "../utils/withApollo";

const Index = () => {
  // TODO useState for userId, or maybe AuthContext
  const input = {
    dateFrom: "2021-03-09T13:28:56.035Z",
    dateTo: "2022-04-09T13:38:56.035Z",
    userId: 2,
  };
  const { data: exceededLimitData, loading: exceededLimitLoading } =
    useGetExceededLimitQuery({
      variables: {
        input,
      },
    });
  const { data: userEntriesData, loading: userEntriesLoading } =
    useGetUserEntriesQuery({
      variables: {
        input,
      },
    });

  const [exceededLimitMap, setExceededLimitMap] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (!isDefined(exceededLimitData)) {
      return;
    }

    setExceededLimitMap(
      exceededLimitData.exceededLimit.reduce((result, currentValue) => {
        result[currentValue.month] = currentValue.limitExceeded;
        return result;
      }, {} as Record<string, boolean>)
    );
  }, [exceededLimitData]);

  return (
    <Layout>
      <Stack spacing={8} py={8}>
        {exceededLimitLoading || userEntriesLoading ? (
          <Flex p={5} bg={"#e6a817"}>
            <div>loading...</div>
          </Flex>
        ) : exceededLimitData && userEntriesData ? (
          <>
            {userEntriesData!.getUserEntries!.map(
              ({ date, caloriesTotal, entries }) => (
                <Flex
                  key={date}
                  bg={"#e6a817"}
                  borderColor={"#e6a817"}
                  borderWidth="1px"
                  borderRadius={5}
                  shadow="md"
                  p={5}
                >
                  <Box flex={1}>
                    <Heading fontSize="xl">{date}</Heading>
                    <Text>Exceeded calories limit {`${caloriesTotal > perUserCaloriesLimit[2]}`}</Text>
                    <Text>Exceeded price limit {`${exceededLimitMap[date.slice(3)]}`}</Text>
                    {entries.map(
                      ({ id, date, name, calories, price, creatorId }) => (
                        <Flex key={id} align="center">
                          <Text flex={1} mt={4}>
                            date {date}
                            name {name}
                            calories {calories}
                            price {price}
                            creatorId {creatorId}
                          </Text>
                          <Box ml="auto">
                            <EditDeleteEntryButtons
                              id={id}
                              creatorId={creatorId}
                            />
                          </Box>
                        </Flex>
                      )
                    )}
                  </Box>
                </Flex>
              )
            )}
          </>
        ) : null}
      </Stack>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Index);
