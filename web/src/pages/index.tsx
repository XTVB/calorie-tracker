import {
  Flex,
  Heading,
  Stack,
  Text,
  Tag,
  TagLabel,
  Wrap,
} from "@chakra-ui/react";
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
                  <Stack spacing={5} flex={1}>
                    <Stack spacing={2} align="center" direction="row">
                      <Heading fontSize="xl">{date}</Heading>
                      {/* TODO creatorId */}
                      {caloriesTotal > perUserCaloriesLimit[2] && (
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

export default withApollo({ ssr: false })(Index);
