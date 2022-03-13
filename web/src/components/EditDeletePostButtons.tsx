import React from "react";
import { Box, IconButton, Link } from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import NextLink from "next/link";
import {
  GetUserEntriesDocument,
  GetUserEntriesQuery,
  useDeleteFoodEntryMutation,
} from "../generated/graphql";
import { isDefined } from "../utils/isDefined";

interface EditDeleteEntryButtonsProps {
  id: number;
  userId: number;
  dateFrom: string;
  dateTo: string;
}

export const EditDeleteEntryButtons: React.FC<EditDeleteEntryButtonsProps> = ({
  id,
  userId,
  dateFrom,
  dateTo,
}) => {
  const [deleteEntry] = useDeleteFoodEntryMutation();

  return (
    <Box>
      <NextLink
        href="/food-entry/edit/[id]/[creatorId]"
        as={`/food-entry/edit/${id}/${userId}`}
      >
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
            variables: { id, userId },
            update: (cache) => {
              cache.evict({ id: "FoodEntry:" + id });
              // If entry for that data is empty now, get rid of the whole date
              cache.updateQuery(
                {
                  query: GetUserEntriesDocument,
                  variables: {
                    input: { dateFrom, dateTo, userId },
                  },
                  overwrite: true,
                },
                (data: GetUserEntriesQuery | null) => {
                  if (!isDefined(data)) {
                    return null;
                  }

                  return {
                    ...data,
                    getUserEntries: data.getUserEntries.filter(
                      (entry) => entry.entries.length > 0
                    ),
                  };
                }
              );
            },
          });
        }}
      />
    </Box>
  );
};
