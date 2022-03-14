import React from "react";
import { Box, Flex, Button, Heading, Link } from "@chakra-ui/react";
import { useMeQuery } from "../generated/graphql";
import { useApolloClient } from "@apollo/client";
import { setAccessToken } from "../utils/accessToken";
import { withApollo } from "../utils/withApollo";
import { useRouter } from "next/router";
import NextLink from "next/link";

const NavBar: React.FC = () => {
  const router = useRouter();
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery();

  let body =
    loading || !data?.me ? null : (
      <Flex align="center">
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={async () => {
            setAccessToken("");
            try {
              await apolloClient.resetStore();
              router.push("/login");
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
    <Flex zIndex={100} position="sticky" top={0} bg="#232d3c" p={4}>
      <Flex flex={1} m="auto" align="center" maxW={1000}>
        <NextLink href="/">
          <Link>
            <Heading>Calorie Tracker</Heading>
          </Link>
        </NextLink>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};

export default withApollo({ ssr: false })(NavBar);
