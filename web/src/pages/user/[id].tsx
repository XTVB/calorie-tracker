import {
  Flex,
  Heading,
  Stack,
  Text,
  Tag,
  TagLabel,
  Wrap,
  Button,
  Link,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { EditDeleteEntryButtons } from "../../components/EditDeletePostButtons";
import { Layout } from "../../components/Layout";
import {
  useGetExceededLimitLazyQuery,
  useGetUserEntriesLazyQuery,
} from "../../generated/graphql";
import { perUserCaloriesLimit } from "../../utils/calorieLimitPerUser";
import { isDefined } from "../../utils/isDefined";
import { withApollo } from "../../utils/withApollo";
import { DatePicker } from "../../components/DatePicker/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/router";
import NextLink from "next/link";

const UserScreen = () => {
  const router = useRouter();
  const [fromDate, setFromDate] = useState<Dayjs>(dayjs().subtract(7, "day"));
  const [toDate, setToDate] = useState<Dayjs>(dayjs());
  const userId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [input, setInput] = useState({
    dateFrom: fromDate.startOf("day").toDate().toISOString(),
    dateTo: toDate.endOf("day").toDate().toISOString(),
    userId,
  });

  useEffect(() => {
    const input = {
      dateFrom: fromDate.toDate().toISOString(),
      dateTo: toDate.toDate().toISOString(),
      userId,
    };
    setInput(input);
    if (!isNaN(userId) && userId !== -1) {
      getLimit({ variables: { input } });
      getEntries({ variables: { input } });
    }
  }, [userId, fromDate, toDate]);

  const [getLimit, { data: exceededLimitData, loading: exceededLimitLoading }] =
    useGetExceededLimitLazyQuery();
  const [getEntries, { data: userEntriesData, loading: userEntriesLoading }] =
    useGetUserEntriesLazyQuery();

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
        <Flex gridColumnGap={4} direction="row" justifyContent={"flex-end"}>
          <DatePicker
            initialDate={fromDate.startOf("day").toDate()}
            label="From date"
            placeholder="From date"
            name="fromDate"
            variant={"filled"}
            onChange={(date: number) => setFromDate(dayjs(date).startOf("day"))}
          />
          <DatePicker
            initialDate={toDate.startOf("day").toDate()}
            label="To date"
            placeholder="To date"
            name="toDate"
            variant={"filled"}
            onChange={(date: number) => setToDate(dayjs(date).endOf("day"))}
          />
          <NextLink
            href="/food-entry/create/[creatorId]"
            as={`/food-entry/create/${userId}`}
          >
            <Button variant="cta" as={Link}>
              add food entry
            </Button>
          </NextLink>
        </Flex>
        {exceededLimitLoading || userEntriesLoading ? (
          <Flex p={5} bg={"#e6a817"}>
            <div>loading...</div>
          </Flex>
        ) : exceededLimitData && userEntriesData ? (
          <>
            {userEntriesData.getUserEntries.map(
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
                  <Stack spacing={5} flex={1}>
                    <Stack spacing={2} align="center" direction="row">
                      <Heading fontSize="xl">{date}</Heading>
                      {caloriesTotal > perUserCaloriesLimit[input.userId] && (
                        <Tag
                          size={"md"}
                          borderRadius="full"
                          variant="solid"
                          colorScheme="red"
                        >
                          <TagLabel>Exceeded calories limit</TagLabel>
                        </Tag>
                      )}
                      {exceededLimitMap[date.slice(3)] && (
                        <Tag
                          size={"md"}
                          borderRadius="full"
                          variant="solid"
                          colorScheme="red"
                        >
                          <TagLabel>Exceeded price limit</TagLabel>
                        </Tag>
                      )}
                    </Stack>
                    <Wrap spacing={6} flex={1} direction="row">
                      {entries.map(
                        ({ id, date, name, calories, price, creatorId }) => (
                          <Stack
                            key={id}
                            minW={150}
                            maxWidth={200}
                            bg={"#306cb5"}
                            justifyContent="center"
                            alignItems="center"
                            borderRadius={8}
                            spacing={2}
                            py={2}
                            px={4}
                          >
                            <Heading
                              textAlign={"center"}
                              size="l"
                            >{`${name} - ${new Date(
                              date
                            ).toLocaleTimeString()}`}</Heading>
                            <Flex
                              justify={"center"}
                              align={"center"}
                              direction={"column"}
                            >
                              <Text>{`${calories} calories`}</Text>
                              {isDefined(price) && <Text>{`$${price}`}</Text>}
                            </Flex>
                            <EditDeleteEntryButtons
                              id={id}
                              userId={creatorId}
                              dateFrom={input.dateFrom}
                              dateTo={input.dateTo}
                            />
                          </Stack>
                        )
                      )}
                    </Wrap>
                  </Stack>
                </Flex>
              )
            )}
          </>
        ) : null}
      </Stack>
    </Layout>
  );
};

export default withApollo({ ssr: false })(UserScreen);
