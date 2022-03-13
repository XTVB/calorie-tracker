import React from "react";
import { Box, Link, Flex, Button, Heading } from "@chakra-ui/react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";
import { useApolloClient } from "@apollo/client";
import { setAccessToken } from "../utils/accessToken";
import { withApollo } from "../utils/withApollo";

const NavBar: React.FC = () => {
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery();

  let body =
    loading || !data?.me ? null : (
      <Flex align="center">
        <NextLink href="/create-food-entry">
          <Button variant="cta" as={Link} mr={4}>
            add food entry
          </Button>
        </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={async () => {
            setAccessToken("");
            try {
              await apolloClient.resetStore();
            } catch (_) {
              // err will be handled in errorLink
            }
          }}
          variant="link"
        >
          logout
        </Button>
      </Flex>
    );

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="#232d3c" p={4}>
      <Flex flex={1} m="auto" align="center" maxW={1000}>
        <Heading>Calorie Tracker</Heading>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};

export default withApollo({ ssr: false })(NavBar);
