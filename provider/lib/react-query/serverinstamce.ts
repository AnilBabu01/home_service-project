import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
  QueryReturnValue,
} from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../src/utils/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const serverinstance = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await AsyncStorage.getItem("adminToken");
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["profile", "getService", "getMessage", "getnotification"],
  endpoints: (builder) => ({
    // Auth apis call
    getProfile: builder.query({
      query: () => "auth/profile",
      providesTags: ["profile"],
    }),

    login: builder.mutation({
      query: (data) => ({
        url: "auth/signin",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          await AsyncStorage.setItem("adminToken", data.token);

          console.log("ss", data);

          dispatch(serverinstance.util.invalidateTags(["profile"]));
        } catch (error) {
          console.log("Login Error:", error);
        }
      },
      invalidatesTags: ["profile"],
    }),

    logout: builder.mutation<string, void>({
      queryFn: async (_, { dispatch }) => {
        try {
          await AsyncStorage.removeItem("adminToken");
          dispatch(serverinstance.util.resetApiState());

          return { data: "Logged out" }; // ✅ Correct return type
        } catch (error: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: { message: error.message },
            },
          } as QueryReturnValue<string, FetchBaseQueryError, undefined>; // ✅ Ensure correct return type
        }
      },
      invalidatesTags: ["profile"],
    }),

    getBooking: builder.query({
      query: ({ page, limit, type }) =>
        `booking?page=${page}&limit=${limit}&type=${type}`,
    }),

    editProfile: builder.mutation({
      query: (data) => ({
        url: "auth/profile",
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          console.log("dd", data);

          dispatch(serverinstance.util.invalidateTags(["profile"]));
        } catch (error) {
          console.log("Login Error:", error);
        }
      },
      invalidatesTags: ["profile"],
    }),

    editService: builder.mutation({
      query: (data) => ({
        url: "update-service",
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          console.log("dd", data);

          dispatch(serverinstance.util.invalidateTags(["profile"]));
        } catch (error) {
          console.log("Login Error:", error);
        }
      },
      invalidatesTags: ["profile"],
    }),

    editPlan: builder.mutation({
      query: (data) => ({
        url: "update-plan",
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          console.log("dd", data);

          dispatch(serverinstance.util.invalidateTags(["profile"]));
        } catch (error) {
          console.log("Login Error:", error);
        }
      },
      invalidatesTags: ["profile"],
    }),

    editTimeSlot: builder.mutation({
      query: (data) => ({
        url: "update-timeslot",
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          console.log("dd", data);

          dispatch(serverinstance.util.invalidateTags(["profile"]));
        } catch (error) {
          console.log("Login Error:", error);
        }
      },
      invalidatesTags: ["profile"],
    }),

    getNotification: builder.query({
      query: () => "notification",
      providesTags: ["getnotification"],
    }),

    seenNotification: builder.mutation({
      query: () => ({
        url: `notification`,
        method: "PUT",
      }),
      invalidatesTags: ["getnotification"],
    }),

    getMessages: builder.query({
      query: ({ chatId, page = 1, limit = 10, type = "provider" }) =>
        `https://001406ff4ce6.ngrok-free.app/api/chats/${chatId}/?page=${page}&limit=${limit}&type=${type}`,

      transformResponse: (response) => {
        console.log("Fetched Messages:", response);
        return response;
      },

      providesTags: ["getMessage"],
    }),

    sendMessage: builder.mutation({
      query: (data) => ({
        url: "https://001406ff4ce6.ngrok-free.app/api/chats",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Added to chats:", data);

          if (data?.chatId || arg?.chatId) {
            dispatch(
              serverinstance.endpoints.getMessages.initiate({
                chatId: data?.chatId || arg?.chatId,
                limit: 10,
                page: 1,
              })
            );
          }
        } catch (error) {
          console.log("Add chats Error:", error);
        }
      },
      invalidatesTags: ["getMessage"],
    }),

    getRooms: builder.query({
      query: ({ type }) =>
        `https://001406ff4ce6.ngrok-free.app/api/chats/rooms?type=${type}`,
    }),

    bookingCancel: builder.mutation({
      query: ({ id, body }) => ({
        url: `booking/cancel/${id}`,
        method: "DELETE",
        body,
      }),
    }),

    bookingComplete: builder.mutation({
      query: (id) => ({
        url: `booking/complete/${id}`,
        method: "PUT",
      }),
    }),


  }),
});

export const {
  useGetProfileQuery,
  useEditProfileMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetBookingQuery,
  useGetNotificationQuery,
  useEditServiceMutation,
  useEditPlanMutation,
  useEditTimeSlotMutation,

  // chats
  useSendMessageMutation,
  useGetMessagesQuery,
  useGetRoomsQuery,

  // booing
  useBookingCancelMutation,
  useBookingCompleteMutation,
  useSeenNotificationMutation,
} = serverinstance;
