import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreateFoodEntryMutation } from "../generated/graphql";
import { useIsAuth } from "../utils/authHooks";
import { withApollo } from "../utils/withApollo";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [createEntry] = useCreateFoodEntryMutation();
  return (
    <Layout variant="small">
      <Formik
      // TODO initial values
        initialValues={{
          date: new Date().toISOString(),
          name: "",
          calories: 0,
          price: undefined,
          creatorId: 2,
        }}
        onSubmit={async (values) => {
          const { errors } = await createEntry({
            variables: { input: values },
            update: (cache) => {
              cache.evict({ fieldName: "FoodEntry:{}" });
            },
          });
          if (!errors) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="text..."
                label="Body"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              create post
            </Button> */}
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePost);
