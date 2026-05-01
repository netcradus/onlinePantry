
import { api } from './api';

export const cartApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query({
            query: () => '/cart',
            providesTags: ['Cart'],
            // Keep the cached result for 60 seconds after the component unmounts
            keepUnusedDataFor: 60,
        }),

        addToCart: builder.mutation({
            query: ({ productId, quantity }) => ({
                url: '/cart',
                method: 'POST',
                body: { productId, quantity },
            }),
            // Optimistic update: increment item count immediately, refetch on error
            async onQueryStarted({ productId, quantity }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    api.util.updateQueryData('getCart', undefined, (draft) => {
                        if (!draft?.data) return;
                        const existing = draft.data.items?.find(
                            (item: any) => item.product?._id === productId || item.product === productId
                        );
                        if (existing) {
                            existing.quantity += quantity;
                        } else {
                            // Push a minimal placeholder; full data arrives on invalidation
                            draft.data.items = draft.data.items || [];
                            draft.data.items.push({
                                product: { _id: productId },
                                quantity,
                                price: 0,
                                name: '',
                                image: '',
                            });
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['Cart'],
        }),

        removeFromCart: builder.mutation({
            query: (productId) => ({
                url: `/cart/${productId}`,
                method: 'DELETE',
            }),
            // Optimistic update: remove immediately
            async onQueryStarted(productId, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    api.util.updateQueryData('getCart', undefined, (draft) => {
                        if (!draft?.data?.items) return;
                        draft.data.items = draft.data.items.filter(
                            (item: any) => item.product?._id !== productId && item.product !== productId
                        );
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['Cart'],
        }),

        updateCartQuantity: builder.mutation({
            query: ({ productId, quantity }) => ({
                url: '/cart',
                method: 'PATCH',
                body: { productId, quantity },
            }),
            // Optimistic update: change quantity immediately
            async onQueryStarted({ productId, quantity }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    api.util.updateQueryData('getCart', undefined, (draft) => {
                        if (!draft?.data?.items) return;
                        const item = draft.data.items.find(
                            (i: any) => i.product?._id === productId || i.product === productId
                        );
                        if (item) {
                            if (quantity <= 0) {
                                draft.data.items = draft.data.items.filter(
                                    (i: any) => i.product?._id !== productId && i.product !== productId
                                );
                            } else {
                                item.quantity = quantity;
                            }
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
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
