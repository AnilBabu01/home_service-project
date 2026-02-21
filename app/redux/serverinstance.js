import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../utils/config'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const serverinstance = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: async (headers) => {
            const token = await AsyncStorage.getItem('adminToken')
            if (token) {
                headers.set('Authorization', `${token}`)
            }
            return headers
        },
    }),
    tagTypes: [
        'profile',
        'getService',
        'getMessage',
        'getnotification',
        'timeSlots',
    ],
    endpoints: (builder) => ({
        // Auth apis call
        getProfile: builder.query({
            query: () => 'auth/profile',
            providesTags: ['profile'],
        }),

        getTimeSlotByProviderId: builder.query({
            query: (providerId) => {
                console.log('Provider ID:', providerId)
                return `getTimeSlotByProviderId/${providerId}`
            },
            providesTags: ['timeSlots'],
        }),

        // Edit profile api call here

        editProfile: builder.mutation({
            query: (data) => ({
                url: 'auth/profile',
                method: 'PUT',
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled

                    console.log('dd', data)

                    dispatch(serverinstance.util.invalidateTags(['profile']))
                } catch (error) {
                    console.log('Login Error:', error)
                }
            },
            invalidatesTags: ['profile'],
        }),

        completeProfile: builder.mutation({
            query: (data) => ({
                url: 'auth/profile',
                method: 'PUT',
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled

                    console.log('dd', data)
                    dispatch(serverinstance.util.invalidateTags(['profile']))
                } catch (error) {
                    console.log('Login Error:', error)
                }
            },
            invalidatesTags: ['profile'],
        }),

        logWithSocialMedia: builder.mutation({
            queryFn: async ({ idToken }, { dispatch }) => {
                try {
                    await AsyncStorage.setItem('adminToken', idToken)
                    await AsyncStorage.setItem(
                        'tokenFetchedAt',
                        Date.now().toString()
                    )

                    console.log('ddd', idToken)

                    dispatch(serverinstance.util.invalidateTags(['profile']))

                    return {
                        data: { msg: 'login from social', idToken },
                    }
                } catch (error) {
                    return {
                        error: {
                            status: 'CUSTOM_ERROR',
                            message: error.message,
                        },
                    }
                }
            },
        }),

        login: builder.mutation({
            query: (data) => ({
                url: 'auth/signin',
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled
                    // await AsyncStorage.setItem('adminToken', data.token)

                    // // Force refetch of user profile after login
                    dispatch(serverinstance.util.invalidateTags(['profile']))
                } catch (error) {
                    console.log('Login Error:', error)
                }
            },
            invalidatesTags: ['profile'],
        }),

        register: builder.mutation({
            query: (data) => ({
                url: 'auth/signup',
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled
                    // await AsyncStorage.setItem('adminToken', data.token)

                    // Force refetch of user profile after register
                    // dispatch(serverinstance.util.invalidateTags(['profile']))
                } catch (error) {
                    console.log('Login Error:', error)
                }
            },
            // invalidatesTags: ['profile'],
        }),

        logout: builder.mutation({
            queryFn: async (_, { dispatch }) => {
                try {
                    await AsyncStorage.removeItem('adminToken')
                    dispatch(serverinstance.util.resetApiState())
                    return { data: 'Logged out' }
                } catch (error) {
                    return {
                        error: {
                            status: 'CUSTOM_ERROR',
                            message: error.message,
                        },
                    }
                }
            },
            invalidatesTags: ['profile'],
        }),

        // Home screen APIs
        getCategory: builder.query({
            query: () => 'categories',
            onQueryStarted: async (arg, { queryFulfilled }) => {
                try {
                    const response = await queryFulfilled
                } catch (error) {
                    console.error('Error fetching categories:', error)
                }
            },
        }),

        getSetting: builder.query({
            query: () => 'setting',
        }),

        // faq

        getFaqCategory: builder.query({
            query: () => 'faqcategory',
        }),

        getFaq: builder.mutation({
            query: (data) => ({
                url: 'faq',
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled
                    // console.log('get data is', data)
                } catch (error) {
                    console.log('faq Error:', error)
                }
            },
        }),

        getService: builder.mutation({
            query: (data) => ({
                url: 'services',
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled
                    // console.log('get data is', data)
                } catch (error) {
                    console.log('faq Error:', error)
                }
            },
        }),

        getFavouriteService: builder.mutation({
            query: (data) => ({
                url: 'favourite',
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled
                    // console.log('get data is', data)
                } catch (error) {
                    console.log('faq Error:', error)
                }
            },
        }),

        addFavouriteService: builder.mutation({
            query: (data) => ({
                url: 'addfavourite',
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled
                    console.log('Added to Favourite:', data)

                    // Fetch the updated favourite list
                    dispatch(
                        serverinstance.endpoints.getFavouriteService.initiate({
                            categories: [],
                            limit: 10,
                            page: 1,
                        })
                    )
                } catch (error) {
                    console.log('Add Favourite Error:', error)
                }
            },
        }),

        addReview: builder.mutation({
            query: (data) => ({
                url: 'addreview',
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled
                    console.log('Added to addreview:', data)

                    // Fetch the updated favourite list
                    dispatch(
                        serverinstance.endpoints.getFavouriteService.initiate({
                            categories: [],
                            limit: 10,
                            page: 1,
                        })
                    )
                } catch (error) {
                    console.log('Add addreview Error:', error)
                }
            },
        }),

        addReviewLike: builder.mutation({
            query: (data) => ({
                url: 'addreviewlike',
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled
                    console.log('Added to addreviewlike:', data)

                    // Fetch the updated favourite list
                    dispatch(
                        serverinstance.endpoints.getFavouriteService.initiate({
                            categories: [],
                            limit: 10,
                            page: 1,
                        })
                    )
                } catch (error) {
                    console.log('Add addreviewlike Error:', error)
                }
            },
        }),

        getNotification: builder.query({
            query: () => 'notification',
            providesTags: ['getnotification'],
        }),

        seenNotification: builder.mutation({
            query: () => ({
                url: `notification`,
                method: 'PUT',
            }),
            invalidatesTags: ['getnotification'],
        }),

        addBooking: builder.mutation({
            query: (data) => ({
                url: 'booking',
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled
                    console.log('Added to booking:', data)

                    // Fetch the updated favourite list
                    dispatch(
                        serverinstance.endpoints.getFavouriteService.initiate({
                            categories: [],
                            limit: 10,
                            page: 1,
                        })
                    )
                } catch (error) {
                    console.log('Add booking Error:', error)
                }
            },
        }),

        getBooking: builder.query({
            query: ({ page, limit, type }) =>
                `booking?page=${page}&limit=${limit}&type=${type}`,
        }),

        getSlotByID: builder.query({
            query: ({ id }) => `getTimeSlotByProviderId?page=${id}`,
        }),

        getServiceByIdApp: builder.query({
            query: ({ id }) => `getServiceByIdApp/${id}`,
        }),

        changePassword: builder.mutation({
            query: (data) => ({
                url: 'auth/changePassword',
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled

                    console.log('dd', data)
                    dispatch(serverinstance.util.invalidateTags(['profile']))
                } catch (error) {
                    console.log('Login Error:', error)
                }
            },
            invalidatesTags: ['profile'],
        }),

        getMessages: builder.query({
            query: ({ chatId, page = 1, limit = 10 }) =>
                `https://001406ff4ce6.ngrok-free.app/api/chats/${chatId}/?page=${page}&limit=${limit}`,
            providesTags: ['getMessage'],
        }),

        sendMessage: builder.mutation({
            query: (data) => ({
                url: 'https://001406ff4ce6.ngrok-free.app/api/chats',
                method: 'POST',
                body: data,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled

                    console.log('Added to chats:', data)

                    // Ensure chatId exists in response or argument
                    if (data?.chatId || arg?.chatId) {
                        dispatch(
                            serverinstance.endpoints.getMessages.initiate({
                                chatId: data?.chatId || arg?.chatId, // Get the chatId
                                limit: 10,
                                page: 1,
                            })
                        )
                    }
                } catch (error) {
                    console.log('Add chats Error:', error)
                }
            },
            invalidatesTags: ['getMessage'], // Match providesTags in getMessages
        }),

        getRooms: builder.query({
            query: ({ type }) =>
                `https://001406ff4ce6.ngrok-free.app/api/chats/rooms?type=${type}`,
        }),

        bookingCancel: builder.mutation({
            query: ({ id, body }) => ({
                url: `booking/cancel/${id}`,
                method: 'DELETE',
                body,
            }),
        }),

        getSlider: builder.query({
            query: ({ page = 1, limit = 10 }) =>
                `sliders?page=${page}&limit=${limit}`,
        }),
    }),
})

export const {
    useGetProfileQuery,
    useLoginMutation,
    useLogoutMutation,

    useLogWithSocialMediaMutation,

    useGetCategoryQuery,
    useEditProfileMutation,
    useRegisterMutation,
    useGetSettingQuery,
    useGetFaqCategoryQuery,
    useGetFaqMutation,
    useGetServiceMutation,
    useGetFavouriteServiceMutation,
    useAddFavouriteServiceMutation,
    useCompleteProfileMutation,
    useAddReviewMutation,
    useAddReviewLikeMutation,

    useGetNotificationQuery,
    useSeenNotificationMutation,

    useAddBookingMutation,
    useGetBookingQuery,
    useChangePasswordMutation,
    // chats
    useSendMessageMutation,
    useGetMessagesQuery,
    useGetRoomsQuery,

    // get time slot by id
    useGetSlotByIDQuery,
    useBookingCancelMutation,

    useGetSliderQuery,

    useGetTimeSlotByProviderIdQuery,

    useGetServiceByIdAppQuery,
} = serverinstance
