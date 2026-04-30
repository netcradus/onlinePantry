
import { api } from './api';

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        sendOtp: builder.mutation({
            query: (data) => ({
                url: '/auth/send-otp',
                method: 'POST',
                body: data,
            }),
        }),
        verifyOtp: builder.mutation({
            query: (data) => ({
                url: '/auth/verify-otp',
                method: 'POST',
                body: data,
            }),
        }),
        registerCustomer: builder.mutation({
            query: (data) => ({
                url: '/auth/register-customer',
                method: 'POST',
                body: data,
            }),
        }),
        // Existing login (admin) might be using axios in Login.tsx, but we can migrate or keep separate. 
        // Ideally consistency is better.
    }),
});

export const {
    useSendOtpMutation,
    useVerifyOtpMutation,
    useRegisterCustomerMutation,
} = authApi;
