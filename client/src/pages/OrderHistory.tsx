import React, { useEffect } from 'react';
import { Box, Container, Typography, Paper, Grid, Stack, Divider, IconButton, CircularProgress, Avatar } from '@mui/material';
import { useGetMyOrdersQuery } from '../store/api/orderApi';
import { ShoppingBag, ChevronRight, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PantryButton } from '../components/ui/PantryButton';
import { PantryBadge } from '../components/ui/PantryBadge';
import { useSocket } from '../context/SocketContext';

const OrderHistory = () => {
    const navigate = useNavigate();
    const { data: ordersData, isLoading: isOrdersLoading, refetch: refetchOrders } = useGetMyOrdersQuery(undefined);
    const { socket } = useSocket();

    useEffect(() => {
        if (socket) {
            socket.on('order_update', () => refetchOrders());
            return () => { socket.off('order_update'); };
        }
    }, [socket, refetchOrders]);

    const orders = ordersData?.data?.orders || [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'success';
            case 'dispatched': return 'info';
            case 'cancelled': return 'error';
            case 'confirmed': return 'primary';
            default: return 'warning';
        }
    };

    if (isOrdersLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}><CircularProgress color="primary" /></Box>;

    return (
        <Box sx={{ py: { xs: 4, md: 8 }, bgcolor: 'var(--pantry-cream)', minHeight: '100vh' }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 3 }}>
                    <Box>
                        <Typography variant="h1" sx={{ fontWeight: 800, mb: 1 }}>Order History</Typography>
                        <Typography variant="body1" sx={{ color: 'var(--pantry-gray-400)', fontWeight: 500 }}>Track your fresh deliveries</Typography>
                    </Box>
                    <IconButton onClick={() => refetchOrders()} sx={{ color: 'var(--pantry-green-600)', bgcolor: 'var(--pantry-green-50)', borderRadius: 3 }}>
                        <RefreshCcw size={20} />
                    </IconButton>
                </Box>

                <Stack spacing={4}>
                    {orders.map((order: any) => (
                        <Paper 
                            key={order._id} 
                            elevation={0} 
                            sx={{ 
                                p: { xs: 3, md: 4 }, 
                                borderRadius: '24px', 
                                border: '1.5px solid var(--pantry-gray-100)',
                                bgcolor: 'white',
                                transition: '0.2s',
                                '&:hover': { borderColor: 'var(--pantry-green-100)', boxShadow: '0 12px 24px rgba(0,0,0,0.02)' }
                            }}
                        >
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>Order #{order._id.slice(-8).toUpperCase()}</Typography>
                                    <Typography variant="body2" sx={{ color: 'var(--pantry-gray-400)', fontWeight: 500 }}>
                                        Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </Typography>
                                </Box>
                                <Stack direction="row" spacing={2} alignItems="center" alignSelf={{ xs: 'flex-start', sm: 'center' }}>
                                    <PantryBadge label={order.orderStatus.replace(/_/g, ' ')} variant={getStatusColor(order.orderStatus) as any} />
                                    <IconButton size="small" onClick={() => navigate(`/order/${order._id}`)} sx={{ color: 'var(--pantry-gray-400)' }}>
                                        <ChevronRight size={20} />
                                    </IconButton>
                                </Stack>
                            </Box>

                            <Divider sx={{ mb: 4, borderColor: 'var(--pantry-gray-100)' }} />

                            <Grid container spacing={4}>
                                <Grid item xs={12} md={8}>
                                    <Stack spacing={3}>
                                        {order.items.map((item: any, idx: number) => (
                                            <Box key={idx} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 3 }, alignItems: { xs: 'flex-start', sm: 'center' } }}>
                                                <Box 
                                                    sx={{ 
                                                        width: { xs: 60, sm: 70 }, 
                                                        height: { xs: 60, sm: 70 }, 
                                                        bgcolor: 'var(--pantry-gray-50)', 
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        p: 1
                                                    }}
                                                >
                                                    <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                                </Box>
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{item.name}</Typography>
                                                    <Typography variant="caption" sx={{ color: 'var(--pantry-gray-400)', fontWeight: 600 }}>Qty: {item.quantity}</Typography>
                                                </Box>
                                                <Typography variant="h5" sx={{ fontWeight: 800, alignSelf: { xs: 'flex-end', sm: 'center' } }}>₹{(item.price * item.quantity).toFixed(2)}</Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ bgcolor: 'var(--pantry-green-50)', p: 4, borderRadius: '16px', border: '1.5px solid var(--pantry-green-100)' }}>
                                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: 'var(--pantry-green-800)' }}>Summary</Typography>
                                        <Stack spacing={2}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography sx={{ color: 'var(--pantry-green-800)', opacity: 0.7, fontWeight: 500, fontSize: '14px' }}>Total Amount</Typography>
                                                <Typography sx={{ fontWeight: 800, color: 'var(--pantry-green-800)' }}>₹{order.totalAmount.toFixed(2)}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography sx={{ color: 'var(--pantry-green-800)', opacity: 0.7, fontWeight: 500, fontSize: '14px' }}>Fulfillment</Typography>
                                                <Typography sx={{ fontWeight: 800, color: 'var(--pantry-green-600)', textTransform: 'capitalize' }}>
                                                    {order.orderStatus.replace(/_/g, ' ')}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                        <PantryButton 
                                            variant="primary" 
                                            fullWidth 
                                            sx={{ mt: 4, borderRadius: '24px', bgcolor: 'var(--pantry-green-600)' }} 
                                            startIcon={<RefreshCcw size={18} />}
                                        >
                                            Reorder All
                                        </PantryButton>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}

                    {orders.length === 0 && (
                        <Paper sx={{ py: 12, textAlign: 'center', borderRadius: '32px', border: '1.5px solid var(--pantry-gray-100)', bgcolor: 'white' }}>
                            <Box sx={{ color: 'var(--pantry-gray-100)', mb: 4 }}>
                                <ShoppingBag size={100} strokeWidth={1} />
                            </Box>
                            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>No orders found</Typography>
                            <Typography sx={{ color: 'var(--pantry-gray-400)', mb: 6, fontWeight: 500 }}>Your past deliveries will be listed here.</Typography>
                            <PantryButton variant="primary" onClick={() => navigate('/shop')} sx={{ px: 6, borderRadius: '24px' }}>
                                Browse the Pantry
                            </PantryButton>
                        </Paper>
                    )}
                </Stack>
            </Container>
        </Box>
    );
};

export default OrderHistory;
