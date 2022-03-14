import {
  Flex,
  Heading,
  Stack,
  Link,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import {
  useAllUsersQuery,
  useGetMultipleUsersEntriesLazyQuery,
} from "../generated/graphql";
import { isDefined } from "../utils/isDefined";
import { withApollo } from "../utils/withApollo";
import dayjs from "dayjs";
import NextLink from "next/link";
import BigNumber from "bignumber.js";

type WeekSummary = {
  entriesCount: number;
  totalCalories: number;
};

type UserSummary = {
  userId: number;
  username: string;
  summary: {
    lastSevenDays: WeekSummary;
    prevSevenDays: WeekSummary;
  };
};

const AdminScreen = () => {
  const { data: allUsersData, loading: allUsersLoading } = useAllUsersQuery();
  const [
    getMultipleEntries,
    { data: multipleUsersEntriesData, loading: multipleUsersEntriesLoading },
  ] = useGetMultipleUsersEntriesLazyQuery();

  useEffect(() => {
    if (isDefined(allUsersData)) {
      getMultipleEntries({
        variables: {
          input: {
            dateFrom: dayjs().subtract(14, "days").startOf("day").toISOString(),
            dateTo: dayjs().endOf("day").toISOString(),
            userIds: allUsersData.getAllNormalUsers.map((user) => user.id),
          },
        },
      });
    }
  }, [allUsersData]);

  const [reportingDetails, setReportingDetails] = useState<{
    averageCaloriesPerUser: string;
    lastSevenCountTotal: number;
    prevSevenCountTotal: number;
    userSummaries: UserSummary[];
  }>();

  useEffect(() => {
    if (isDefined(allUsersData) && isDefined(multipleUsersEntriesData)) {
      const usernameMap = allUsersData.getAllNormalUsers.reduce(
        (result, user) => {
          result[user.id] = user.username;
          return result;
        },
        {} as Record<number, string>
      );
      const userSummaries =
        multipleUsersEntriesData.getMultipleUsersEntries.map(
          ({ userId, groupedEntries }) => {
            return {
              userId,
              username: usernameMap[userId],
              summary: groupedEntries.reduce(
                (result, currentValue) => {
                  const key = dayjs(currentValue.date).isBefore(
                    dayjs().subtract(7, "days").startOf("day")
                  )
                    ? "prevSevenDays"
                    : "lastSevenDays";
                  const { totalCalories, entriesCount } = result[key];
                  result[key] = {
                    entriesCount: entriesCount + currentValue.count,
                    totalCalories: totalCalories + currentValue.caloriesTotal,
                  };
                  return result;
                },
                {
                  lastSevenDays: {
                    entriesCount: 0,
                    totalCalories: 0,
                  },
                  prevSevenDays: {
                    entriesCount: 0,
                    totalCalories: 0,
                  },
                }
              ),
            };
          }
        );

      const { calorieTotal, lastSevenCountTotal, prevSevenCountTotal } =
        userSummaries.reduce(
          (result, { summary }) => {
            return {
              calorieTotal:
                result.calorieTotal + summary.lastSevenDays.totalCalories,
              lastSevenCountTotal:
                result.lastSevenCountTotal + summary.lastSevenDays.entriesCount,
              prevSevenCountTotal:
                result.prevSevenCountTotal + summary.prevSevenDays.entriesCount,
            };
          },
          {
            calorieTotal: 0,
            lastSevenCountTotal: 0,
            prevSevenCountTotal: 0,
          }
        );

      const averageCaloriesPerUser =
        userSummaries.length > 0
          ? new BigNumber(calorieTotal)
              .dividedBy(userSummaries.length)
              .toFixed(1)
          : "";

      setReportingDetails({
        averageCaloriesPerUser,
        lastSevenCountTotal,
        prevSevenCountTotal,
        userSummaries,
      });
    }
  }, [allUsersData, multipleUsersEntriesData]);

  return (
    <Layout>
      <Stack spacing={8} py={8}>
        {allUsersLoading || multipleUsersEntriesLoading ? (
          <Flex p={5} bg={"#e6a817"}>
            <div>loading...</div>
          </Flex>
        ) : (
          reportingDetails && (
            <>
              <Stack>
                <Flex justify={"flex-end"}>
                  <Heading fontSize="l">{`Average calories entered per user in the last seven days: ${reportingDetails.averageCaloriesPerUser}`}</Heading>
                </Flex>
                <Flex justify={"flex-end"}>
                  <Heading fontSize="l">{`Number of entries across all users in the last seven days: ${reportingDetails.lastSevenCountTotal}`}</Heading>
                </Flex>
                <Flex justify={"flex-end"}>
                  <Heading fontSize="l">{`Number of entries across all users in the previous seven days: ${reportingDetails.prevSevenCountTotal}`}</Heading>
                </Flex>
              </Stack>
              {reportingDetails.userSummaries.map(
                ({
                  userId,
                  username,
                  summary: { lastSevenDays, prevSevenDays },
                }) => (
                  <Flex
                    key={userId}
                    bg={"#e6a817"}
                    borderColor={"#e6a817"}
                    borderWidth="1px"
                    borderRadius={5}
                    shadow="md"
                    p={5}
                  >
                    <Stack spacing={5} flex={1}>
                      <NextLink href="/user/[id]" as={`/user/${userId}`}>
                        <Link>
                          <Heading fontSize="xl">{username}</Heading>
                        </Link>
                      </NextLink>
                      <Table size="sm">
                        <Thead>
                          <Tr>
                            <Th></Th>
                            <Th>Number of entries</Th>
                            <Th>Average daily calories</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Th>Last Seven Days</Th>
                            <Td isNumeric>{lastSevenDays.entriesCount}</Td>
                            <Td isNumeric>
                              {new BigNumber(lastSevenDays.totalCalories)
                                .dividedBy(7)
                                .toFixed(1)}
                            </Td>
                          </Tr>
                          <Tr>
                            <Th>Previous Seven Days</Th>
                            <Td isNumeric>{prevSevenDays.entriesCount}</Td>
                            <Td isNumeric>
                              {new BigNumber(prevSevenDays.totalCalories)
                                .dividedBy(7)
                                .toFixed(1)}
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </Stack>
                  </Flex>
                )
              )}
            </>
          )
        )}
      </Stack>
    </Layout>
  );
};

export default withApollo({ ssr: false })(AdminScreen);
