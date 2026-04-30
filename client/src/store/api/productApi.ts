import { api } from './api';

export const productApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (params) => ({
                url: '/products',
                params,
            }),
            providesTags: (result) =>
                result?.data?.products
                    ? [
                        ...result.data.products.map(({ _id }: { _id: string }) => ({ type: 'Product' as const, id: _id })),
                        { type: 'Product' as const, id: 'LIST' },
                    ]
                    : [{ type: 'Product' as const, id: 'LIST' }],
        }),
        getProductById: builder.query({
            query: (id) => `/products/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Product', id }],
        }),
        createProduct: builder.mutation({
            query: (data) => ({
                url: '/products',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),
        updateProduct: builder.mutation({
            query: ({ id, body }) => ({
                url: `/products/${id}`,
                method: 'PATCH',
                body: body,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Product', id }, { type: 'Product', id: 'LIST' }],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi;
