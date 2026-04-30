import { api } from './api';

export const slotsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSlots: builder.query({
            query: (params) => ({
                url: '/slots',
                params,
            }),
            providesTags: ['Slot'],
        }),
        createSlot: builder.mutation({
            query: (data) => ({
                url: '/slots',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Slot'],
        }),
        updateSlot: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/slots/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Slot'],
        }),
    }),
});

export const {
    useGetSlotsQuery,
    useCreateSlotMutation,
    useUpdateSlotMutation,
} = slotsApi;
