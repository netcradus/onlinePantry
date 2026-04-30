import { api } from './api';

export const subscriptionsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriptions: builder.query({
            query: () => '/subscriptions',
            providesTags: ['Subscription'],
        }),
        createSubscription: builder.mutation({
            query: (data) => ({
                url: '/subscriptions',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Subscription'],
        }),
        updateSubscription: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/subscriptions/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Subscription'],
        }),
        cancelSubscription: builder.mutation({
            query: (id) => ({
                url: `/subscriptions/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Subscription'],
        }),
        getSubscriptionHistory: builder.query({
            query: (id) => `/subscriptions/${id}/history`,
            providesTags: ['Order'],
        }),
    }),
});

export const {
    useGetSubscriptionsQuery,
    useCreateSubscriptionMutation,
    useUpdateSubscriptionMutation,
    useCancelSubscriptionMutation,
    useGetSubscriptionHistoryQuery,
} = subscriptionsApi;
