import { api } from './api';

export const searchApi = api.injectEndpoints({
    endpoints: (builder) => ({
        search: builder.query({
            query: (params) => ({
                url: '/search',
                params,
            }),
            providesTags: ['Product'],
            // Keep results cached for 60s after component unmounts (e.g. navigating to product detail and back)
            keepUnusedDataFor: 60,
        }),
    }),
});

export const { useSearchQuery } = searchApi;
