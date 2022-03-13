import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import {
  useGetFoodEntryQuery,
  useUpdateFoodEntryMutation,
} from "../../../generated/graphql";
import { withApollo } from "../../../utils/withApollo";

const EditEntry = ({}) => {
  const router = useRouter();
  const entryId = typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const creatorId = typeof router.query.creatorId === "string" ? parseInt(router.query.creatorId) : -1;
  const { data, loading } = useGetFoodEntryQuery({
    skip: entryId === -1 || creatorId === -1,
    variables: {
      id: entryId,
      userId: creatorId,
    },
  });
  const [updateEntry] = useUpdateFoodEntryMutation();
  if (loading) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (!data?.FoodEntry) {
    return (
      <Layout>
        <Box>could not find entry</Box>
      </Layout>
    );
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{
          date: data.FoodEntry.date,
          name: data.FoodEntry.name,
          calories: data.FoodEntry.calories,
          price: data.FoodEntry.price,
          creatorId: data.FoodEntry.creatorId,
        }}
        onSubmit={async (values) => {
          await updateEntry({ variables: { id: entryId, input: { ...values } } });
          router.back();
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
              update post
            </Button> */}
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditEntry);
