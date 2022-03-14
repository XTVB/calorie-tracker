import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { FoodEntryForm } from "../../../../components/FoodEntryForm";
import { Layout } from "../../../../components/Layout";
import {
  useGetFoodEntryQuery,
  useUpdateFoodEntryMutation,
} from "../../../../generated/graphql";
import { toErrorMap } from "../../../../utils/toErrorMap";
import { withApollo } from "../../../../utils/withApollo";
import dayjs from "dayjs";

const EditEntry = ({}) => {
  const router = useRouter();
  const entryId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const creatorId =
    typeof router.query.creatorId === "string"
      ? parseInt(router.query.creatorId)
      : -1;

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
      <FoodEntryForm
        initialValues={{
          date: dayjs(data.FoodEntry.date).format("YYYY-MM-DDTHH:MM"),
          name: data.FoodEntry.name,
          calories: data.FoodEntry.calories,
          price: data.FoodEntry.price || undefined,
          creatorId: data.FoodEntry.creatorId,
        }}
        onSubmit={async (values, { setErrors }) => {
          const { data } = await updateEntry({
            variables: { id: entryId, input: values },
          });
          if (data?.updateFoodEntry.errors) {
            setErrors(toErrorMap(data?.updateFoodEntry.errors));
          } else {
            router.push("/user/[id]", `/user/${creatorId}`);
          }
        }}
        buttonText={"update entry"}
      />
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditEntry);
