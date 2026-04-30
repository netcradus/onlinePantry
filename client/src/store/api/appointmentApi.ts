import { api } from './api';

export const appointmentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAppointments: builder.query({
            query: () => '/appointments',
            providesTags: ['Appointment'],
        }),
        updateAppointmentStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/appointments/${id}/status`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: ['Appointment'],
        }),
    }),
});

export const {
    useGetAppointmentsQuery,
    useUpdateAppointmentStatusMutation,
} = appointmentApi;
