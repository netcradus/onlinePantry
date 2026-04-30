import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL || '/api/v1',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Product', 'Blog', 'User', 'Order', 'Category', 'Cart', 'Review', 'Recipe', 'Slot', 'Subscription', 'Appointment'],
    endpoints: () => ({}),
});
