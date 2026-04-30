
import { api } from './api';

export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getUserProfile: builder.query({
            query: () => '/users/profile',
            providesTags: ['User'],
        }),
        updateUserProfile: builder.mutation({
            query: (data) => ({
                url: '/users/profile',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        updateAddress: builder.mutation({
            query: (data) => ({
                url: '/users/address',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        sendEmailOtp: builder.mutation({
            query: (data) => ({
                url: '/users/send-email-otp',
                method: 'POST',
                body: data,
            }),
        }),
        verifyEmailOtp: builder.mutation({
            query: (data) => ({
                url: '/users/verify-email-otp',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        // Admin Endpoints
        getAllUsers: builder.query({
            query: () => '/users/admin/all',
            providesTags: ['User'],
        }),
        getUserDetails: builder.query({
            query: (userId) => `/users/admin/${userId}`,
            providesTags: ['User'],
        }),
    }),
});

export const {
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useUpdateAddressMutation,
    useSendEmailOtpMutation,
    useVerifyEmailOtpMutation,
    useGetAllUsersQuery,
    useGetUserDetailsQuery,
} = userApi;
