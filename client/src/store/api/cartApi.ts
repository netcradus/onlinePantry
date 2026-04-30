
import { api } from './api';
// import { Cart } from '@/types/cart';

export const cartApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query({
            query: () => '/cart',
            providesTags: ['Cart'],
        }),
        addToCart: builder.mutation({
            query: ({ productId, quantity }) => ({
                url: '/cart',
                method: 'POST',
                body: { productId, quantity },
            }),
            invalidatesTags: ['Cart'],
        }),
        removeFromCart: builder.mutation({
            query: (productId) => ({
                url: `/cart/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),
        updateCartQuantity: builder.mutation({
            query: ({ productId, quantity }) => ({
                url: '/cart',
                method: 'PATCH',
                body: { productId, quantity },
            }),
            invalidatesTags: ['Cart'],
        }),
    }),
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useRemoveFromCartMutation,
    useUpdateCartQuantityMutation,
} = cartApi;
