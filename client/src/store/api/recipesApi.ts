import { api } from './api';

export const recipesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getRecipes: builder.query({
            query: (params) => ({
                url: '/recipes',
                params,
            }),
            providesTags: ['Recipe'],
        }),
        getRecipeBySlug: builder.query({
            query: (slug) => `/recipes/${slug}`,
            providesTags: (_result, _error, slug) => [{ type: 'Recipe', id: slug }],
        }),
        addRecipeToCart: builder.mutation({
            query: (id) => ({
                url: `/recipes/${id}/add-to-cart`,
                method: 'POST',
            }),
            invalidatesTags: ['Cart'],
        }),
        createRecipe: builder.mutation({
            query: (body) => ({
                url: '/recipes',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Recipe']
        }),
        deleteRecipe: builder.mutation({
            query: (id) => ({
                url: `/recipes/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Recipe']
        })
    }),
});

export const {
    useGetRecipesQuery,
    useGetRecipeBySlugQuery,
    useAddRecipeToCartMutation,
    useCreateRecipeMutation,
    useDeleteRecipeMutation
} = recipesApi;
