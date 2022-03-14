import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: string;
};

export type CostLimitExceedResponse = {
  __typename?: 'CostLimitExceedResponse';
  limitExceeded: Scalars['Boolean'];
  month: Scalars['String'];
};

export type FetchMultipleUsersEntriesInput = {
  dateFrom: Scalars['DateTime'];
  dateTo: Scalars['DateTime'];
  userIds: Array<Scalars['Float']>;
};

export type FetchUserEntriesInput = {
  dateFrom: Scalars['DateTime'];
  dateTo: Scalars['DateTime'];
  userId: Scalars['Float'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type FoodEntry = {
  __typename?: 'FoodEntry';
  calories: Scalars['Float'];
  creator: User;
  creatorId: Scalars['Float'];
  date: Scalars['DateTime'];
  id: Scalars['Float'];
  name: Scalars['String'];
  price?: Maybe<Scalars['Float']>;
};

export type FoodEntryInput = {
  calories: Scalars['Float'];
  creatorId: Scalars['Float'];
  date: Scalars['DateTime'];
  name: Scalars['String'];
  price?: InputMaybe<Scalars['Float']>;
};

export type FoodEntryResponse = {
  __typename?: 'FoodEntryResponse';
  entry?: Maybe<FoodEntry>;
  errors?: Maybe<Array<FieldError>>;
};

export type MultipleUsersEntriesResponse = {
  __typename?: 'MultipleUsersEntriesResponse';
  groupedEntries: Array<UserEntriesGroup>;
  userId: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createFoodEntry: FoodEntryResponse;
  deleteFoodEntry: Scalars['Boolean'];
  login: UserResponse;
  updateFoodEntry: FoodEntryResponse;
};


export type MutationCreateFoodEntryArgs = {
  input: FoodEntryInput;
};


export type MutationDeleteFoodEntryArgs = {
  id: Scalars['Float'];
  userId: Scalars['Float'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationUpdateFoodEntryArgs = {
  id: Scalars['Float'];
  input: FoodEntryInput;
};

export type Query = {
  __typename?: 'Query';
  FoodEntry?: Maybe<FoodEntry>;
  exceededLimit: Array<CostLimitExceedResponse>;
  getAllNormalUsers: Array<User>;
  getMultipleUsersEntries: Array<MultipleUsersEntriesResponse>;
  getUserEntries: Array<UserEntriesGroup>;
  me?: Maybe<User>;
};


export type QueryFoodEntryArgs = {
  id: Scalars['Float'];
  userId: Scalars['Float'];
};


export type QueryExceededLimitArgs = {
  input: FetchUserEntriesInput;
};


export type QueryGetMultipleUsersEntriesArgs = {
  input: FetchMultipleUsersEntriesInput;
};


export type QueryGetUserEntriesArgs = {
  input: FetchUserEntriesInput;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  isAdmin: Scalars['Boolean'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserEntriesGroup = {
  __typename?: 'UserEntriesGroup';
  caloriesTotal: Scalars['Float'];
  count: Scalars['Float'];
  date: Scalars['String'];
  entries: Array<FoodEntry>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  accessToken?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type CreateFoodEntryMutationVariables = Exact<{
  input: FoodEntryInput;
}>;


export type CreateFoodEntryMutation = { __typename?: 'Mutation', createFoodEntry: { __typename?: 'FoodEntryResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, entry?: { __typename?: 'FoodEntry', id: number, name: string, calories: number, date: string, price?: number | null, creatorId: number } | null } };

export type DeleteFoodEntryMutationVariables = Exact<{
  userId: Scalars['Float'];
  id: Scalars['Float'];
}>;


export type DeleteFoodEntryMutation = { __typename?: 'Mutation', deleteFoodEntry: boolean };

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', accessToken?: string | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, isAdmin: boolean } | null } };

export type UpdateFoodEntryMutationVariables = Exact<{
  id: Scalars['Float'];
  input: FoodEntryInput;
}>;


export type UpdateFoodEntryMutation = { __typename?: 'Mutation', updateFoodEntry: { __typename?: 'FoodEntryResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, entry?: { __typename?: 'FoodEntry', id: number, name: string, calories: number, date: string, price?: number | null, creatorId: number } | null } };

export type AllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllUsersQuery = { __typename?: 'Query', getAllNormalUsers: Array<{ __typename?: 'User', id: number }> };

export type GetExceededLimitQueryVariables = Exact<{
  input: FetchUserEntriesInput;
}>;


export type GetExceededLimitQuery = { __typename?: 'Query', exceededLimit: Array<{ __typename?: 'CostLimitExceedResponse', month: string, limitExceeded: boolean }> };

export type GetFoodEntryQueryVariables = Exact<{
  id: Scalars['Float'];
  userId: Scalars['Float'];
}>;


export type GetFoodEntryQuery = { __typename?: 'Query', FoodEntry?: { __typename?: 'FoodEntry', id: number, name: string, calories: number, date: string, price?: number | null, creatorId: number, creator: { __typename?: 'User', username: string } } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string, isAdmin: boolean } | null };

export type GetMultipleUsersEntriesQueryVariables = Exact<{
  input: FetchMultipleUsersEntriesInput;
}>;


export type GetMultipleUsersEntriesQuery = { __typename?: 'Query', getMultipleUsersEntries: Array<{ __typename?: 'MultipleUsersEntriesResponse', userId: number, groupedEntries: Array<{ __typename?: 'UserEntriesGroup', date: string, count: number, caloriesTotal: number }> }> };

export type GetUserEntriesQueryVariables = Exact<{
  input: FetchUserEntriesInput;
}>;


export type GetUserEntriesQuery = { __typename?: 'Query', getUserEntries: Array<{ __typename?: 'UserEntriesGroup', date: string, caloriesTotal: number, entries: Array<{ __typename?: 'FoodEntry', id: number, name: string, calories: number, date: string, price?: number | null, creatorId: number }> }> };


export const CreateFoodEntryDocument = gql`
    mutation CreateFoodEntry($input: FoodEntryInput!) {
  createFoodEntry(input: $input) {
    errors {
      field
      message
    }
    entry {
      id
      name
      calories
      date
      price
      creatorId
    }
  }
}
    `;
export type CreateFoodEntryMutationFn = Apollo.MutationFunction<CreateFoodEntryMutation, CreateFoodEntryMutationVariables>;

/**
 * __useCreateFoodEntryMutation__
 *
 * To run a mutation, you first call `useCreateFoodEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFoodEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFoodEntryMutation, { data, loading, error }] = useCreateFoodEntryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateFoodEntryMutation(baseOptions?: Apollo.MutationHookOptions<CreateFoodEntryMutation, CreateFoodEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFoodEntryMutation, CreateFoodEntryMutationVariables>(CreateFoodEntryDocument, options);
      }
export type CreateFoodEntryMutationHookResult = ReturnType<typeof useCreateFoodEntryMutation>;
export type CreateFoodEntryMutationResult = Apollo.MutationResult<CreateFoodEntryMutation>;
export type CreateFoodEntryMutationOptions = Apollo.BaseMutationOptions<CreateFoodEntryMutation, CreateFoodEntryMutationVariables>;
export const DeleteFoodEntryDocument = gql`
    mutation DeleteFoodEntry($userId: Float!, $id: Float!) {
  deleteFoodEntry(userId: $userId, id: $id)
}
    `;
export type DeleteFoodEntryMutationFn = Apollo.MutationFunction<DeleteFoodEntryMutation, DeleteFoodEntryMutationVariables>;

/**
 * __useDeleteFoodEntryMutation__
 *
 * To run a mutation, you first call `useDeleteFoodEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFoodEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFoodEntryMutation, { data, loading, error }] = useDeleteFoodEntryMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteFoodEntryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFoodEntryMutation, DeleteFoodEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteFoodEntryMutation, DeleteFoodEntryMutationVariables>(DeleteFoodEntryDocument, options);
      }
export type DeleteFoodEntryMutationHookResult = ReturnType<typeof useDeleteFoodEntryMutation>;
export type DeleteFoodEntryMutationResult = Apollo.MutationResult<DeleteFoodEntryMutation>;
export type DeleteFoodEntryMutationOptions = Apollo.BaseMutationOptions<DeleteFoodEntryMutation, DeleteFoodEntryMutationVariables>;
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    errors {
      field
      message
    }
    accessToken
    user {
      id
      username
      isAdmin
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const UpdateFoodEntryDocument = gql`
    mutation UpdateFoodEntry($id: Float!, $input: FoodEntryInput!) {
  updateFoodEntry(id: $id, input: $input) {
    errors {
      field
      message
    }
    entry {
      id
      name
      calories
      date
      price
      creatorId
    }
  }
}
    `;
export type UpdateFoodEntryMutationFn = Apollo.MutationFunction<UpdateFoodEntryMutation, UpdateFoodEntryMutationVariables>;

/**
 * __useUpdateFoodEntryMutation__
 *
 * To run a mutation, you first call `useUpdateFoodEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFoodEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFoodEntryMutation, { data, loading, error }] = useUpdateFoodEntryMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateFoodEntryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFoodEntryMutation, UpdateFoodEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFoodEntryMutation, UpdateFoodEntryMutationVariables>(UpdateFoodEntryDocument, options);
      }
export type UpdateFoodEntryMutationHookResult = ReturnType<typeof useUpdateFoodEntryMutation>;
export type UpdateFoodEntryMutationResult = Apollo.MutationResult<UpdateFoodEntryMutation>;
export type UpdateFoodEntryMutationOptions = Apollo.BaseMutationOptions<UpdateFoodEntryMutation, UpdateFoodEntryMutationVariables>;
export const AllUsersDocument = gql`
    query AllUsers {
  getAllNormalUsers {
    id
  }
}
    `;

/**
 * __useAllUsersQuery__
 *
 * To run a query within a React component, call `useAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllUsersQuery(baseOptions?: Apollo.QueryHookOptions<AllUsersQuery, AllUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllUsersQuery, AllUsersQueryVariables>(AllUsersDocument, options);
      }
export function useAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllUsersQuery, AllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllUsersQuery, AllUsersQueryVariables>(AllUsersDocument, options);
        }
export type AllUsersQueryHookResult = ReturnType<typeof useAllUsersQuery>;
export type AllUsersLazyQueryHookResult = ReturnType<typeof useAllUsersLazyQuery>;
export type AllUsersQueryResult = Apollo.QueryResult<AllUsersQuery, AllUsersQueryVariables>;
export const GetExceededLimitDocument = gql`
    query GetExceededLimit($input: FetchUserEntriesInput!) {
  exceededLimit(input: $input) {
    month
    limitExceeded
  }
}
    `;

/**
 * __useGetExceededLimitQuery__
 *
 * To run a query within a React component, call `useGetExceededLimitQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExceededLimitQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExceededLimitQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetExceededLimitQuery(baseOptions: Apollo.QueryHookOptions<GetExceededLimitQuery, GetExceededLimitQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetExceededLimitQuery, GetExceededLimitQueryVariables>(GetExceededLimitDocument, options);
      }
export function useGetExceededLimitLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetExceededLimitQuery, GetExceededLimitQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetExceededLimitQuery, GetExceededLimitQueryVariables>(GetExceededLimitDocument, options);
        }
export type GetExceededLimitQueryHookResult = ReturnType<typeof useGetExceededLimitQuery>;
export type GetExceededLimitLazyQueryHookResult = ReturnType<typeof useGetExceededLimitLazyQuery>;
export type GetExceededLimitQueryResult = Apollo.QueryResult<GetExceededLimitQuery, GetExceededLimitQueryVariables>;
export const GetFoodEntryDocument = gql`
    query GetFoodEntry($id: Float!, $userId: Float!) {
  FoodEntry(id: $id, userId: $userId) {
    id
    name
    calories
    date
    price
    creatorId
    creator {
      username
    }
  }
}
    `;

/**
 * __useGetFoodEntryQuery__
 *
 * To run a query within a React component, call `useGetFoodEntryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFoodEntryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFoodEntryQuery({
 *   variables: {
 *      id: // value for 'id'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetFoodEntryQuery(baseOptions: Apollo.QueryHookOptions<GetFoodEntryQuery, GetFoodEntryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFoodEntryQuery, GetFoodEntryQueryVariables>(GetFoodEntryDocument, options);
      }
export function useGetFoodEntryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFoodEntryQuery, GetFoodEntryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFoodEntryQuery, GetFoodEntryQueryVariables>(GetFoodEntryDocument, options);
        }
export type GetFoodEntryQueryHookResult = ReturnType<typeof useGetFoodEntryQuery>;
export type GetFoodEntryLazyQueryHookResult = ReturnType<typeof useGetFoodEntryLazyQuery>;
export type GetFoodEntryQueryResult = Apollo.QueryResult<GetFoodEntryQuery, GetFoodEntryQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    username
    isAdmin
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const GetMultipleUsersEntriesDocument = gql`
    query GetMultipleUsersEntries($input: FetchMultipleUsersEntriesInput!) {
  getMultipleUsersEntries(input: $input) {
    userId
    groupedEntries {
      date
      count
      caloriesTotal
    }
  }
}
    `;

/**
 * __useGetMultipleUsersEntriesQuery__
 *
 * To run a query within a React component, call `useGetMultipleUsersEntriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMultipleUsersEntriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMultipleUsersEntriesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetMultipleUsersEntriesQuery(baseOptions: Apollo.QueryHookOptions<GetMultipleUsersEntriesQuery, GetMultipleUsersEntriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMultipleUsersEntriesQuery, GetMultipleUsersEntriesQueryVariables>(GetMultipleUsersEntriesDocument, options);
      }
export function useGetMultipleUsersEntriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMultipleUsersEntriesQuery, GetMultipleUsersEntriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMultipleUsersEntriesQuery, GetMultipleUsersEntriesQueryVariables>(GetMultipleUsersEntriesDocument, options);
        }
export type GetMultipleUsersEntriesQueryHookResult = ReturnType<typeof useGetMultipleUsersEntriesQuery>;
export type GetMultipleUsersEntriesLazyQueryHookResult = ReturnType<typeof useGetMultipleUsersEntriesLazyQuery>;
export type GetMultipleUsersEntriesQueryResult = Apollo.QueryResult<GetMultipleUsersEntriesQuery, GetMultipleUsersEntriesQueryVariables>;
export const GetUserEntriesDocument = gql`
    query GetUserEntries($input: FetchUserEntriesInput!) {
  getUserEntries(input: $input) {
    date
    caloriesTotal
    entries {
      id
      name
      calories
      date
      price
      creatorId
    }
  }
}
    `;

/**
 * __useGetUserEntriesQuery__
 *
 * To run a query within a React component, call `useGetUserEntriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserEntriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserEntriesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetUserEntriesQuery(baseOptions: Apollo.QueryHookOptions<GetUserEntriesQuery, GetUserEntriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserEntriesQuery, GetUserEntriesQueryVariables>(GetUserEntriesDocument, options);
      }
export function useGetUserEntriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserEntriesQuery, GetUserEntriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserEntriesQuery, GetUserEntriesQueryVariables>(GetUserEntriesDocument, options);
        }
export type GetUserEntriesQueryHookResult = ReturnType<typeof useGetUserEntriesQuery>;
export type GetUserEntriesLazyQueryHookResult = ReturnType<typeof useGetUserEntriesLazyQuery>;
export type GetUserEntriesQueryResult = Apollo.QueryResult<GetUserEntriesQuery, GetUserEntriesQueryVariables>;