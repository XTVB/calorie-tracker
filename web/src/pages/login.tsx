import React from "react";
import { Formik, Form } from "formik";
import { Box, Button, Stack } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { useLoginMutation, MeQuery, MeDocument } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withApollo } from "../utils/withApollo";
import { setAccessToken } from "../utils/accessToken";
import { Layout } from "../components/Layout";

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();

  return (
    <Layout variant="small">
      <Stack
        borderRadius={8}
        borderWidth="1px"
        shadow="md"
        bg={"#306cb5"}
        borderColor={"#306cb5"}
        mt={"40%"}
        px={10}
        py={8}
      >
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login({
              variables: values,
              update: (cache, { data }) => {
                setAccessToken(data?.login.accessToken || "");
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: data?.login.user,
                  },
                });
                cache.evict({ fieldName: "FoodEntry:{}" });
              },
            });
            if (response.data?.login.errors) {
              setErrors(toErrorMap(response.data.login.errors));
            } else if (response.data?.login.user) {
              if (typeof router.query.next === "string") {
                router.push(router.query.next);
              } else {
                const user = response.data?.login.user;
                if (user.isAdmin) {
                  // TODO admin path
                } else {
                  router.push(
                    "/user/[id]",
                    `/user/${user.id}`
                  );
                }
              }
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="username"
                placeholder="username"
                label="Username"
              />
              <Box mt={4}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
              </Box>
              <Button
                variant="cta"
                mt={6}
                type="submit"
                isLoading={isSubmitting}
                bgColor={"#232d3c"}
              >
                login
              </Button>
            </Form>
          )}
        </Formik>
      </Stack>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Login);
