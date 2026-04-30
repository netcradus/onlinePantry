import { api } from './api';

export const categoryApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => '/categories',
            providesTags: ['Category'],
        }),
        getCategoryById: builder.query({
            query: (id) => `/categories/${id}`,
            providesTags: (result, error, id) => [{ type: 'Category', id }],
        }),
        createCategory: builder.mutation({
            query: (body) => ({
                url: '/categories',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Category'],
        }),
        updateCategory: builder.mutation({
            query: ({ id, body }) => ({
                url: `/categories/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Category'],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;
