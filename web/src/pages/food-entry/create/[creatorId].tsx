import { useRouter } from "next/router";
import React from "react";
import { FoodEntryForm } from "../../../components/FoodEntryForm";
import { Layout } from "../../../components/Layout";
import { useCreateFoodEntryMutation } from "../../../generated/graphql";
import { toErrorMap } from "../../../utils/toErrorMap";
import { withApollo } from "../../../utils/withApollo";
import dayjs from "dayjs";

const CreateEntry = ({}) => {
  const router = useRouter();
  const creatorId =
    typeof router.query.creatorId === "string"
      ? parseInt(router.query.creatorId)
      : -1;

  const [createEntry] = useCreateFoodEntryMutation();

  return (
    <Layout variant="small">
      {!isNaN(creatorId) && creatorId !== -1 && (
        <FoodEntryForm
          initialValues={{
            date: dayjs().format("YYYY-MM-DDTHH:MM"),
            name: "",
            calories: 0,
            price: undefined,
            creatorId,
          }}
          onSubmit={async (values, { setErrors }) => {
            const { data } = await createEntry({
              variables: { input: values },
            });
            if (data?.createFoodEntry.errors) {
              setErrors(toErrorMap(data?.createFoodEntry.errors));
            } else {
              router.push("/user/[id]", `/user/${creatorId}`);
            }
          }}
          buttonText={"create entry"}
        />
      )}
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreateEntry);
