import { api } from './api';

export const orderApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (data) => ({
                url: '/orders',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Cart'],
        }),
        verifyPayment: builder.mutation({
            query: (data) => ({
                url: '/orders/verify',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Order', 'Cart'],
        }),
        getMyOrders: builder.query({
            query: () => '/orders/my-orders',
            providesTags: ['Order'],
        }),
        getAllOrders: builder.query({
            query: () => '/orders/admin/all',
            providesTags: ['Order'],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ orderId, status, confirmationDetails }) => ({
                url: '/orders/admin/status',
                method: 'PATCH',
                body: { orderId, status, confirmationDetails }
            }),
            invalidatesTags: ['Order']
        }),
        getRevenueStats: builder.query({
            query: () => '/orders/admin/revenue',
            providesTags: ['Order']
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useVerifyPaymentMutation,
    useGetMyOrdersQuery,
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
    useGetRevenueStatsQuery,
} = orderApi;
