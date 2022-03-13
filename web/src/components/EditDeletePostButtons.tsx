import React from "react";
import { Box, IconButton, Link } from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import NextLink from "next/link";
import { useDeleteFoodEntryMutation } from "../generated/graphql";

interface EditDeleteEntryButtonsProps {
  id: number;
  creatorId: number;
}

export const EditDeleteEntryButtons: React.FC<EditDeleteEntryButtonsProps> = ({
  id,
  creatorId,
}) => {
  const [deleteEntry] = useDeleteFoodEntryMutation();

  return (
    <Box>
      <NextLink href="/food-entry/edit/[id]" as={`/food-entry/edit/${id}`}>
        <IconButton
          as={Link}
          mr={4}
          icon={<FiEdit />}
          aria-label="Edit Entry"
        />
      </NextLink>
      <IconButton
        icon={<MdDelete />}
        aria-label="Delete Entry"
        onClick={() => {
          deleteEntry({
            variables: { id, userId: creatorId },
            update: (cache) => {
              cache.evict({ id: "FoodEntry:" + id });
            },
          });
        }}
      />
    </Box>
  );
};
