import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
const defaultOptions =  {}
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
  month: Scalars['String'];
  limitExceeded: Scalars['Boolean'];
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
  id: Scalars['Float'];
  name: Scalars['String'];
  calories: Scalars['Float'];
  date: Scalars['DateTime'];
  price?: Maybe<Scalars['Float']>;
  creatorId: Scalars['Float'];
  creator: User;
};

export type FoodEntryInput = {
  creatorId: Scalars['Float'];
  date: Scalars['DateTime'];
  name: Scalars['String'];
  calories: Scalars['Float'];
  price?: Maybe<Scalars['Float']>;
};

export type FoodEntryResponse = {
  __typename?: 'FoodEntryResponse';
  errors?: Maybe<Array<FieldError>>;
  entry?: Maybe<FoodEntry>;
};

export type MultipleUsersEntriesResponse = {
  __typename?: 'MultipleUsersEntriesResponse';
  userId: Scalars['Float'];
  groupedEntries: Array<UserEntriesGroup>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createFoodEntry: FoodEntryResponse;
  updateFoodEntry?: Maybe<FoodEntryResponse>;
  deleteFoodEntry: Scalars['Boolean'];
  login: UserResponse;
};


export type MutationCreateFoodEntryArgs = {
  input: FoodEntryInput;
};


export type MutationUpdateFoodEntryArgs = {
  input: FoodEntryInput;
  id: Scalars['Float'];
};


export type MutationDeleteFoodEntryArgs = {
  userId: Scalars['Float'];
  id: Scalars['Float'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  FoodEntry?: Maybe<FoodEntry>;
  getUserEntries: Array<UserEntriesGroup>;
  getMultipleUsersEntries: Array<MultipleUsersEntriesResponse>;
  exceededLimit: Array<CostLimitExceedResponse>;
  me?: Maybe<User>;
  getAllNormalUsers: Array<User>;
};


export type QueryFoodEntryArgs = {
  userId: Scalars['Float'];
  id: Scalars['Float'];
};


export type QueryGetUserEntriesArgs = {
  input: FetchUserEntriesInput;
};


export type QueryGetMultipleUsersEntriesArgs = {
  input: FetchMultipleUsersEntriesInput;
};


export type QueryExceededLimitArgs = {
  input: FetchUserEntriesInput;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  username: Scalars['String'];
  isAdmin: Scalars['Boolean'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UserEntriesGroup = {
  __typename?: 'UserEntriesGroup';
  date: Scalars['String'];
  count: Scalars['Float'];
  caloriesTotal: Scalars['Float'];
  entries: Array<FoodEntry>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  accessToken?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type CreateFoodEntryMutationVariables = Exact<{
  input: FoodEntryInput;
}>;


export type CreateFoodEntryMutation = (
  { __typename?: 'Mutation' }
  & { createFoodEntry: (
    { __typename?: 'FoodEntryResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, entry?: Maybe<(
      { __typename?: 'FoodEntry' }
      & Pick<FoodEntry, 'id' | 'name' | 'calories' | 'date' | 'price' | 'creatorId'>
    )> }
  ) }
);

export type DeleteFoodEntryMutationVariables = Exact<{
  userId: Scalars['Float'];
  id: Scalars['Float'];
}>;


export type DeleteFoodEntryMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteFoodEntry'>
);

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & Pick<UserResponse, 'accessToken'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'isAdmin'>
    )> }
  ) }
);

export type UpdateFoodEntryMutationVariables = Exact<{
  id: Scalars['Float'];
  input: FoodEntryInput;
}>;


export type UpdateFoodEntryMutation = (
  { __typename?: 'Mutation' }
  & { updateFoodEntry?: Maybe<(
    { __typename?: 'FoodEntryResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, entry?: Maybe<(
      { __typename?: 'FoodEntry' }
      & Pick<FoodEntry, 'id' | 'name' | 'calories' | 'date' | 'price' | 'creatorId'>
    )> }
  )> }
);

export type AllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllUsersQuery = (
  { __typename?: 'Query' }
  & { getAllNormalUsers: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
  )> }
);

export type GetExceededLimitQueryVariables = Exact<{
  input: FetchUserEntriesInput;
}>;


export type GetExceededLimitQuery = (
  { __typename?: 'Query' }
  & { exceededLimit: Array<(
    { __typename?: 'CostLimitExceedResponse' }
    & Pick<CostLimitExceedResponse, 'month' | 'limitExceeded'>
  )> }
);

export type GetFoodEntryQueryVariables = Exact<{
  id: Scalars['Float'];
  userId: Scalars['Float'];
}>;


export type GetFoodEntryQuery = (
  { __typename?: 'Query' }
  & { FoodEntry?: Maybe<(
    { __typename?: 'FoodEntry' }
    & Pick<FoodEntry, 'id' | 'name' | 'calories' | 'date' | 'price' | 'creatorId'>
    & { creator: (
      { __typename?: 'User' }
      & Pick<User, 'username'>
    ) }
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'isAdmin'>
  )> }
);

export type GetMultipleUsersEntriesQueryVariables = Exact<{
  input: FetchMultipleUsersEntriesInput;
}>;


export type GetMultipleUsersEntriesQuery = (
  { __typename?: 'Query' }
  & { getMultipleUsersEntries: Array<(
    { __typename?: 'MultipleUsersEntriesResponse' }
    & Pick<MultipleUsersEntriesResponse, 'userId'>
    & { groupedEntries: Array<(
      { __typename?: 'UserEntriesGroup' }
      & Pick<UserEntriesGroup, 'date' | 'count' | 'caloriesTotal'>
    )> }
  )> }
);

export type GetUserEntriesQueryVariables = Exact<{
  input: FetchUserEntriesInput;
}>;


export type GetUserEntriesQuery = (
  { __typename?: 'Query' }
  & { getUserEntries: Array<(
    { __typename?: 'UserEntriesGroup' }
    & Pick<UserEntriesGroup, 'date' | 'caloriesTotal'>
    & { entries: Array<(
      { __typename?: 'FoodEntry' }
      & Pick<FoodEntry, 'id' | 'name' | 'calories' | 'date' | 'price' | 'creatorId'>
    )> }
  )> }
);


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