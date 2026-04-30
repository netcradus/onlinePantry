import { api } from './api';

export const searchApi = api.injectEndpoints({
    endpoints: (builder) => ({
        search: builder.query({
            query: (params) => ({
                url: '/search',
                params,
            }),
            providesTags: ['Product'],
        }),
    }),
});

export const { useSearchQuery } = searchApi;
