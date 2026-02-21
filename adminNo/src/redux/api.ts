import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../utils/config';
import {
  LoginResponse,
  ProfileResponse,
  ServiceCategoryResponse,
  ServiceResponse,
  NotificationType,
  FaqResponse,
  SettingResponse,
  FaqCategoryResponse,
} from '../types/DefinedTypes';
import { toast } from 'react-toastify';

export const serverinstance = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        headers.set('Authorization', `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'profile',
    'getServiceCategory',
    'getService',
    'getsetting',
    'getfaq',
    'getfaqcategory',
    'getuser',
    'getnotification',
    'getslider',
  ],

  endpoints: (builder) => ({
    // auth apis
    getProfile: builder.query<ProfileResponse, void>({
      query: () => 'auth/profile',
      providesTags: ['profile'],
    }),

    login: builder.mutation<LoginResponse, { email: string; password: string }>(
      {
        query: (data) => ({
          url: 'auth/signin',
          method: 'POST',
          body: data,
        }),
        async onQueryStarted(_, { queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            localStorage.setItem('adminToken', data.token);
            toast.success(data?.msg);
          } catch (error) {
            toast.error('Login failed');
          }
        },
        invalidatesTags: ['profile'],
      },
    ),

    saveNotificationToken: builder.mutation<
      LoginResponse,
      { notification_token: string }
    >({
      query: (data) => ({
        url: 'auth/saveNotificationToken',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // toast.success(data?.msg);
        } catch (error) {
          // toast.error('Login failed');
        }
      },
      invalidatesTags: ['profile'],
    }),

    // Curd Category

    getServiceCategory: builder.query<
      ServiceCategoryResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `category?page=${page}&limit=${limit}`,
      providesTags: ['getServiceCategory'],
    }),

    addsServiceCategory: builder.mutation<ServiceCategoryResponse, FormData>({
      query: (data) => ({
        url: 'category',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('add category res', data);

          toast.success(data?.msg);
        } catch (error) {
          toast.error('Add Service category failed');
        }
      },
      invalidatesTags: ['getServiceCategory'],
    }),

    editServiceCategory: builder.mutation<
      ServiceCategoryResponse,
      { categoryId: string; formData: FormData }
    >({
      query: ({ categoryId, formData }) => ({
        url: `category/${categoryId}`,
        method: 'PUT',
        body: formData,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('Update category response:', data);
          toast.success(data?.msg);
        } catch (error) {
          toast.error('Update Service category failed');
        }
      },
      invalidatesTags: ['getServiceCategory'],
    }),

    editProviderPassword: builder.mutation<
      ServiceCategoryResponse,
      { providerId: number; formData: FormData }
    >({
      query: ({ providerId, formData }) => ({
        url: `provider/${providerId}`,
        method: 'PUT',
        body: formData,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Update provider password response:', data);
          toast.success(data?.msg);
        } catch (error) {
          toast.error('Update provider password failed');
        }
      },
    }),

    deleteServiceCategory: builder.mutation<
      ServiceCategoryResponse,
      { categoryId: string | undefined }
    >({
      query: ({ categoryId }) => ({
        url: `category/${categoryId}`,
        method: 'DELETE',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('Update category response:', data);
          toast.success(data?.msg);
        } catch (error) {
          toast.error('Update Service category failed');
        }
      },
      invalidatesTags: ['getServiceCategory'],
    }),

    blockServiceCategory: builder.mutation<
      ServiceCategoryResponse,
      { categoryId: string }
    >({
      query: ({ categoryId }) => ({
        url: `category/category-block/${categoryId}`,
        method: 'GET',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('Update category response:', data);
          toast.success(data?.msg);
        } catch (error) {
          toast.error('Update Service category failed');
        }
      },
      invalidatesTags: ['getServiceCategory'],
    }),

    //  Curd of Service

    getService: builder.query<
      ServiceResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `service?page=${page}&limit=${limit}`,
      providesTags: ['getService'],
    }),

    addsService: builder.mutation<ServiceResponse, FormData>({
      query: (data) => ({
        url: 'service',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('add category res', data);

          toast.success(data?.msg);
        } catch (error) {
          toast.error('Add Service category failed');
        }
      },
      invalidatesTags: ['getService'],
    }),

    editService: builder.mutation<
      ServiceResponse,
      { serviceId: string; formData: FormData }
    >({
      query: ({ serviceId, formData }) => ({
        url: `service/${serviceId}`,
        method: 'PUT',
        body: formData,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('Update category response:', data);
          toast.success(data?.msg);
        } catch (error) {
          toast.error('Update Service category failed');
        }
      },
      invalidatesTags: ['getService'],
    }),

    deleteService: builder.mutation<
      ServiceResponse,
      { serviceId: string | undefined }
    >({
      query: ({ serviceId }) => ({
        url: `service/${serviceId}`,
        method: 'DELETE',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('Update category response:', data);
          toast.success(data?.msg);
        } catch (error) {
          toast.error('Update Service category failed');
        }
      },
      invalidatesTags: ['getService'],
    }),

    blockService: builder.mutation<ServiceResponse, { serviceId: string }>({
      query: ({ serviceId }) => ({
        url: `service/service-block/${serviceId}`,
        method: 'GET',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('Update category response:', data);
          toast.success(data?.msg);
        } catch (error) {
          toast.error('Update Service category failed');
        }
      },
      invalidatesTags: ['getService'],
    }),

    // notification

    sendNotification: builder.mutation<NotificationType, FormData>({
      query: (data) => ({
        url: 'notification/senAppNotification',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('add notification res', data);

          toast.success(data?.msg);
        } catch (error) {
          toast.error('Add notification failed');
        }
      },
    }),

    //  Faq

    getFaq: builder.query<FaqResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `faq?page=${page}&limit=${limit}`,
      providesTags: ['getfaq'],
    }),

    addsFaq: builder.mutation<
      ServiceCategoryResponse,
      { question: string; answer: string }
    >({
      query: (data) => ({
        url: 'faq',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('add faq res', data);

          toast.success(data?.msg);
        } catch (error) {
          toast.error('Add faq failed');
        }
      },
      invalidatesTags: ['getfaq'],
    }),

    editFaq: builder.mutation<
      ServiceCategoryResponse,
      { faqId: string; formData: { question: string; answer: string } }
    >({
      query: ({ faqId, formData }) => ({
        url: `faq/${faqId}`,
        method: 'PUT',
        body: formData,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('Update faq response:', data);
          toast.success(data?.msg);
        } catch (error) {
          toast.error('Update faq failed');
        }
      },
      invalidatesTags: ['getfaq'],
    }),

    deleteFaq: builder.mutation<
      ServiceCategoryResponse,
      { faqId: string | undefined }
    >({
      query: ({ faqId }) => ({
        url: `faq/${faqId}`,
        method: 'DELETE',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('Update faq response:', data);
          toast.success(data?.msg);
        } catch (error) {
          toast.error('Update faq failed');
        }
      },
      invalidatesTags: ['getfaq'],
    }),

    blockFaq: builder.mutation<ServiceCategoryResponse, { faqId: string }>({
      query: ({ faqId }) => ({
        url: `faq/faq-block/${faqId}`,
        method: 'GET',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('Update faq response:', data);
          toast.success(data?.msg);
        } catch (error) {
          toast.error('Update faq failed');
        }
      },
      invalidatesTags: ['getfaq'],
    }),

    // setting
    getSetting: builder.query<SettingResponse, void>({
      query: () => 'setting',
      providesTags: ['getsetting'],
    }),

    editSetting: builder.mutation<
      SettingResponse,
      {
        settingId: string;
        formData: {
          privacyPolicy?: string;
          whatsapp?: string;
          customerServices?: string;
          Website?: string;
          facebook?: string;
          twitter?: string;
          instagram?: string;
        };
      }
    >({
      query: ({ settingId, formData }) => ({
        url: `setting/${settingId}`,
        method: 'PUT',
        body: formData,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('Update faq response:', data);
          toast.success(data?.msg);
        } catch (error) {
          toast.error('Update faq failed');
        }
      },
      invalidatesTags: ['getsetting'],
    }),

    // faq category apis call here

    getFaqCategory: builder.query<
      FaqCategoryResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `faqcategory?page=${page}&limit=${limit}`,
      providesTags: ['getfaqcategory'],
    }),

    addsFaqCategory: builder.mutation<FaqCategoryResponse, { name: string }>({
      query: (data) => ({
        url: 'faqcategory',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('add category res', data);

          toast.success(data?.msg);
        } catch (error) {
          toast.error('Add Service category failed');
        }
      },
      invalidatesTags: ['getfaqcategory'],
    }),

    editFaqCategory: builder.mutation<
      FaqCategoryResponse,
      { categoryId: string; formData: { name: string } }
    >({
      query: ({ categoryId, formData }) => ({
        url: `faqcategory/${categoryId}`,
        method: 'PUT',
        body: formData,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('Update category response:', data);
          toast.success(data?.msg);
        } catch (error) {
          toast.error('Update Service category failed');
        }
      },
      invalidatesTags: ['getfaqcategory'],
    }),

    deleteFaqCategory: builder.mutation<
      FaqCategoryResponse,
      { categoryId: string | undefined }
    >({
      query: ({ categoryId }) => ({
        url: `faqcategory/${categoryId}`,
        method: 'DELETE',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('Update category response:', data);
          toast.success(data?.msg);
        } catch (error) {
          toast.error('Update Service category failed');
        }
      },
      invalidatesTags: ['getfaqcategory'],
    }),

    blockFaqCategory: builder.mutation<
      FaqCategoryResponse,
      { categoryId: string }
    >({
      query: ({ categoryId }) => ({
        url: `faqcategory/faqcategory-block/${categoryId}`,
        method: 'GET',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('Update category response:', data);
          toast.success(data?.msg);
        } catch (error) {
          toast.error('Update Service category failed');
        }
      },
      invalidatesTags: ['getfaqcategory'],
    }),

    getProviderList: builder.query<
      ServiceResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `provider?page=${page}&limit=${limit}`,
      providesTags: ['getService'],
    }),

    editProvider: builder.mutation<
      ServiceResponse,
      { serviceId: string; formData: FormData }
    >({
      query: ({ serviceId, formData }) => ({
        url: `provider/${serviceId}`,
        method: 'PUT',
        body: formData,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('Update category response:', data);
          toast.success(data?.msg);
        } catch (error) {
          toast.error('Update Service category failed');
        }
      },
      invalidatesTags: ['getService'],
    }),

    // now

    getDashboardData: builder.query<ServiceCategoryResponse, void>({
      query: () => `dashboard`,
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

    getUserList: builder.query<
      ServiceResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => `users?page=${page}&limit=${limit}`,
      providesTags: ['getuser'],
    }),

    getBooking: builder.query({
      query: ({ page, limit, type }) =>
        `bookings?page=${page}&limit=${limit}&type=${type}`,
    }),

    // slider

    getSlider: builder.query<
      ServiceCategoryResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `sliders?page=${page}&limit=${limit}`,
      providesTags: ['getslider'],
    }),

    addsSlider: builder.mutation<ServiceCategoryResponse, FormData>({
      query: (data) => ({
        url: 'sliders',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('add sliders res', data);

          toast.success(data?.msg);
        } catch (error) {
          toast.error('Add sliders failed');
        }
      },
      invalidatesTags: ['getslider'],
    }),

    editSlider: builder.mutation<
      ServiceCategoryResponse,
      { categoryId: string; formData: FormData }
    >({
      query: ({ categoryId, formData }) => ({
        url: `sliders/${categoryId}`,
        method: 'PUT',
        body: formData,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('Update sliders response:', data);
          toast.success(data?.msg);
        } catch (error) {
          toast.error('Update sliders failed');
        }
      },
      invalidatesTags: ['getslider'],
    }),

    deleteSlider: builder.mutation<
      ServiceCategoryResponse,
      { categoryId: string | undefined }
    >({
      query: ({ categoryId }) => ({
        url: `sliders/${categoryId}`,
        method: 'DELETE',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('Update sliders response:', data);
          toast.success(data?.msg);
        } catch (error) {
          toast.error('Update sliders failed');
        }
      },
      invalidatesTags: ['getslider'],
    }),

    editUser: builder.mutation<
      ServiceCategoryResponse,
      { id: string; formData: any }
    >({
      query: ({ id, formData }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body: formData,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('Update users response:', data);
          toast.success(data?.msg);
        } catch (error) {
          toast.error('Update user failed');
        }
      },
      invalidatesTags: ['getuser'],
    }),

    editAdminProfile: builder.mutation<
      ServiceCategoryResponse,
      { formData: FormData }
    >({
      query: ({ formData }) => ({
        url: `auth/profile`,
        method: 'POST',
        body: formData,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log('Update admin profile response:', data);
          toast.success(data?.msg);
        } catch (error) {
          toast.error('Update admin profile failed');
        }
      },
      invalidatesTags: ['profile'],
    }),

    // now
  }),
});

export const {
  useGetProfileQuery,
  useLoginMutation,
  useGetServiceCategoryQuery,
  useAddsServiceCategoryMutation,
  useEditServiceCategoryMutation,
  useDeleteServiceCategoryMutation,
  useBlockServiceCategoryMutation,
  useGetServiceQuery,
  useAddsServiceMutation,
  useEditServiceMutation,
  useDeleteServiceMutation,
  useBlockServiceMutation,
  useSendNotificationMutation,
  useGetFaqQuery,
  useAddsFaqMutation,
  useDeleteFaqMutation,
  useEditFaqMutation,
  useBlockFaqMutation,
  useGetSettingQuery,
  useEditSettingMutation,
  useGetFaqCategoryQuery,
  useAddsFaqCategoryMutation,
  useBlockFaqCategoryMutation,
  useDeleteFaqCategoryMutation,
  useEditFaqCategoryMutation,
  useGetProviderListQuery,
  useEditProviderMutation,
  useSaveNotificationTokenMutation,

  // now working
  useGetDashboardDataQuery,
  useGetNotificationQuery,
  useSeenNotificationMutation,
  useGetUserListQuery,
  useGetBookingQuery,

  useGetSliderQuery,
  useDeleteSliderMutation,
  useEditSliderMutation,
  useAddsSliderMutation,

  useEditUserMutation,

  useEditAdminProfileMutation,

  useEditProviderPasswordMutation,
} = serverinstance;
