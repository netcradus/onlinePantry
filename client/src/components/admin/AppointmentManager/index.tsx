import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Chip } from '@mui/material';
import { useGetAppointmentsQuery, useUpdateAppointmentStatusMutation } from '../../../store/api/appointmentApi';
import { Calendar, Clock, User } from 'lucide-react';
import BackButton from '../../common/BackButton';

const AppointmentManager = () => {
    const { data, isLoading } = useGetAppointmentsQuery({});
    const [updateStatus] = useUpdateAppointmentStatusMutation();

    const handleStatusChange = async (id: string, status: string) => {
        await updateStatus({ id, status });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'error';
            case 'completed': return 'info';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ py: 6, minHeight: '100vh', bgcolor: '#f8fafc' }}>
            <Container maxWidth="lg">
                <BackButton to="/admin/dashboard" />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <Box sx={{ p: 1.5, bgcolor: '#ffedd5', borderRadius: 2, color: '#ea580c' }}>
                        <Calendar size={28} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: '800', color: '#1e293b' }}>Appointments</Typography>
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Patient</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Date/Time</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.data?.map((app: any) => (
                                <TableRow key={app._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ p: 1, bgcolor: '#f1f5f9', borderRadius: '50%' }}>
                                                <User size={16} color="#64748b" />
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" fontWeight="600" color="#334155">{app.name}</Typography>
                                                <Typography variant="caption" color="#64748b">{app.email}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={app.type}
                                            size="small"
                                            variant="outlined"
                                            sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b' }}>
                                            <Clock size={16} />
                                            <Typography variant="body2">
                                                {new Date(app.date).toLocaleDateString()} at {app.timeSlot}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            size="small"
                                            value={app.status}
                                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                            sx={{
                                                minWidth: 120,
                                                borderRadius: 2,
                                                fontSize: '0.875rem',
                                                '& .MuiSelect-select': { py: 0.5, px: 2 }
                                            }}
                                        >
                                            <MenuItem value="pending"><Typography variant="body2" color="warning.main">Pending</Typography></MenuItem>
                                            <MenuItem value="confirmed"><Typography variant="body2" color="success.main">Confirmed</Typography></MenuItem>
                                            <MenuItem value="completed"><Typography variant="body2" color="info.main">Completed</Typography></MenuItem>
                                            <MenuItem value="cancelled"><Typography variant="body2" color="error.main">Cancelled</Typography></MenuItem>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!data?.data || data?.data.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                                        <Typography color="text.secondary">No appointments found</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    );
};

export default AppointmentManager;
