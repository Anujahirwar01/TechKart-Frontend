import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import type {
  AllUsersResponse,
  DeleteUserRequest,
  MessageResponse,
  UserResponse,
} from "../../types/api-types";
import type { User } from "../../types/types";

export const userAPI = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/`,
  }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({
        url: "new",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),

    deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
      query: ({ userId, adminUserId }) => ({
        url: `${userId}?id=${adminUserId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),

    allUsers: builder.query<AllUsersResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["users"],
    }),
  }),
});

export const getUser = async (id: string) => {
  try {
    const { data }: { data: UserResponse } = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/v1/user/${id}`,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const getDemoAdminUser = async () => {
  const { data }: { data: UserResponse } = await axios.get(
    `${import.meta.env.VITE_SERVER}/api/v1/user/demo/login`
  );
  return data;
};

export const { useLoginMutation, useAllUsersQuery, useDeleteUserMutation } =
  userAPI;