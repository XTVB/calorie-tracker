import React from "react";
import { Form, Formik, FormikHelpers } from "formik";
import { Box, Button, Stack } from "@chakra-ui/react";
import { InputField } from "./InputField";
import * as Yup from "yup";
import { DatePicker } from "./DatePicker/DatePicker";

type FormValues = {
  date: string;
  name: string;
  calories: number;
  price?: number | null;
  creatorId: number;
};

interface FoodEntryFormProps {
  initialValues: FormValues;
  buttonText: string;
  onSubmit: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => void;
}

const FoodEntrySchema = Yup.object().shape({
  date: Yup.string().required("Required"),
  name: Yup.string()
    .min(1, "Too short")
    .max(255, "Too long")
    .required("Required"),
  calories: Yup.number().min(1, "Must be more than 1").required("Required"),
  price: Yup.number().min(0.01, "Must be more than 0.01"),
});

export const FoodEntryForm: React.FC<FoodEntryFormProps> = ({
  initialValues,
  buttonText,
  onSubmit,
}) => {
  return (
    <Stack
      borderRadius={8}
      borderWidth="1px"
      shadow="md"
      bg={"#306cb5"}
      borderColor={"#306cb5"}
      mt={8}
      px={10}
      py={8}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={FoodEntrySchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="name" placeholder="name" label="Food name" />
            <Box mt={4}>
              <InputField
                name="date"
                placeholder="date"
                label="Date"
                type="datetime-local"
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="calories"
                placeholder="calories"
                label="Calories"
                type="number"
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="price"
                placeholder="price"
                label="Price"
                type="number"
                step={"0.01"}
              />
            </Box>
            <Button
              mt={6}
              variant="cta"
              bgColor={"#232d3c"}
              type="submit"
              isLoading={isSubmitting}
            >
              {buttonText}
            </Button>
          </Form>
        )}
      </Formik>
    </Stack>
  );
};
