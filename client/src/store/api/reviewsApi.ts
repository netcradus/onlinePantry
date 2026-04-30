import { api } from './api';

export const reviewsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProductReviews: builder.query({
            query: ({ productId, page = 1, limit = 10, sort = 'recent' }) => ({
                url: `/reviews/product/${productId}`,
                params: { page, limit, sort },
            }),
            providesTags: (_result, _error, { productId }) => [{ type: 'Review', id: productId }],
        }),
        createReview: builder.mutation({
            query: ({ productId, ...body }) => ({
                url: `/reviews/product/${productId}`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _error, { productId }) => [
                { type: 'Review', id: productId },
                { type: 'Product', id: productId }
            ],
        }),
        voteHelpful: builder.mutation({
            query: (reviewId) => ({
                url: `/reviews/${reviewId}/helpful`,
                method: 'PUT',
            }),
            invalidatesTags: ['Review'],
        }),
    }),
});

export const {
    useGetProductReviewsQuery,
    useCreateReviewMutation,
    useVoteHelpfulMutation,
} = reviewsApi;
