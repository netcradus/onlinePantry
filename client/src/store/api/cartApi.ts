
import { api } from './api';

// Cast helper – needed because injectEndpoints returns a new type,
// but the base `api` object used inside the same call doesn't know
// about 'getCart' yet, causing TS2345 / "never" errors.
const patchCart = (dispatch: any, recipe: (draft: any) => void) =>
    dispatch((api as any).util.updateQueryData('getCart', undefined, recipe));

export const cartApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query({
            query: () => '/cart',
            providesTags: ['Cart'],
            keepUnusedDataFor: 60,
        }),

        addToCart: builder.mutation({
            query: ({ productId, quantity }) => ({
                url: '/cart',
                method: 'POST',
                body: { productId, quantity },
            }),
            async onQueryStarted({ productId, quantity }, { dispatch, queryFulfilled }) {
                const patch = patchCart(dispatch, (draft: any) => {
                    if (!draft?.data) return;
                    const items: any[] = draft.data.items ?? [];
                    const existing = items.find(
                        (i: any) => i.product?._id === productId || i.product === productId
                    );
                    if (existing) {
                        existing.quantity += quantity;
                    } else {
                        items.push({ product: { _id: productId }, quantity, price: 0, name: '', image: '' });
                        draft.data.items = items;
                    }
                });
                try {
                    await queryFulfilled;
                } catch {
                    patch.undo();
                }
            },
            invalidatesTags: ['Cart'],
        }),

        removeFromCart: builder.mutation({
            query: (productId) => ({
                url: `/cart/${productId}`,
                method: 'DELETE',
            }),
            async onQueryStarted(productId, { dispatch, queryFulfilled }) {
                const patch = patchCart(dispatch, (draft: any) => {
                    if (!draft?.data?.items) return;
                    draft.data.items = draft.data.items.filter(
                        (i: any) => i.product?._id !== productId && i.product !== productId
                    );
                });
                try {
                    await queryFulfilled;
                } catch {
                    patch.undo();
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
            async onQueryStarted({ productId, quantity }, { dispatch, queryFulfilled }) {
                const patch = patchCart(dispatch, (draft: any) => {
                    if (!draft?.data?.items) return;
                    if (quantity <= 0) {
                        draft.data.items = draft.data.items.filter(
                            (i: any) => i.product?._id !== productId && i.product !== productId
                        );
                    } else {
                        const item = draft.data.items.find(
                            (i: any) => i.product?._id === productId || i.product === productId
                        );
                        if (item) item.quantity = quantity;
                    }
                });
                try {
                    await queryFulfilled;
                } catch {
                    patch.undo();
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
