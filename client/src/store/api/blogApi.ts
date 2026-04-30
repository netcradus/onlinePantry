import { api } from './api';

export const blogApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getBlogs: builder.query({
            query: () => '/blogs',
            providesTags: ['Blog'],
        }),
        createBlog: builder.mutation({
            query: (data) => ({
                url: '/blogs',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Blog'],
        }),
        deleteBlog: builder.mutation({
            query: (id) => ({
                url: `/blogs/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Blog'],
        }),
    }),
});

export const {
    useGetBlogsQuery,
    useCreateBlogMutation,
    useDeleteBlogMutation,
} = blogApi;
