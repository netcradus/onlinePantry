import React from 'react';
import { Box, Container, Typography, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Stack, IconButton } from '@mui/material';
import { useGetSubscriptionsQuery } from '../../store/api/subscriptionsApi';
import { PantryBadge } from '../../components/ui/PantryBadge';
import { RefreshCw, Calendar, User, ShoppingBag, Eye } from 'lucide-react';

const AdminSubscriptions = () => {
    const { data: subsData, isLoading } = useGetSubscriptionsQuery(undefined);

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}><CircularProgress /></Box>;

    const subscriptions = subsData?.data || [];

    return (
        <Box sx={{ py: 6, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>Recurring Subscriptions</Typography>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: 'white', border: '1px solid #eee' }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <RefreshCw size={18} color="#2E7D32" />
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{subscriptions.length} Active Plans</Typography>
                        </Stack>
                    </Paper>
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #eee' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f9f9f9' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Frequency</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Quantity</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Next Delivery</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subscriptions.map((sub: any) => (
                                <TableRow key={sub._id} hover>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <User size={16} color="#666" />
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{sub.userId?.firstName} {sub.userId?.lastName}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <ShoppingBag size={16} color="#666" />
                                            <Typography variant="body2">{sub.productId?.name}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ textTransform: 'capitalize' }}>{sub.frequency}</TableCell>
                                    <TableCell>{sub.quantity}</TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Calendar size={16} color="#666" />
                                            <Typography variant="body2">{new Date(sub.nextDeliveryDate).toLocaleDateString()}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <PantryBadge 
                                            label={sub.status} 
                                            variant={sub.status === 'active' ? 'success' : 'error'} 
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small"><Eye size={18} /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    );
};

export default AdminSubscriptions;
