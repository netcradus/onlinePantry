import React from 'react';
import { Box, Container, Typography, Paper, Grid, Divider, CircularProgress, Stack, Avatar, Chip } from '@mui/material';
import { useGetUserDetailsQuery } from '../../store/api/userApi';
import { useParams, useNavigate } from 'react-router-dom';
import { User, MapPin, ShoppingBag, Calendar, Phone, Mail } from 'lucide-react';
import { PantryButton } from '../../components/ui/PantryButton';

const AdminUserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading } = useGetUserDetailsQuery(id);

    if (isLoading) return <Box sx={{ py: 10, textAlign: 'center' }}><CircularProgress color="primary" /></Box>;

    const user = data?.data?.user;
    const orders = data?.data?.orders || [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'success';
            case 'cancelled': return 'error';
            case 'dispatched': return 'info';
            default: return 'warning';
        }
    };

    return (
        <Box sx={{ py: 6, bgcolor: 'var(--pantry-cream)', minHeight: '100vh' }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
                    <Box>
                        <Typography variant="h1" sx={{ fontWeight: 800, mb: 1 }}>Customer Insights</Typography>
                        <Typography variant="body1" sx={{ color: 'var(--pantry-gray-400)' }}>Detailed profile and transaction history for {user?.firstName}</Typography>
                    </Box>
                    <PantryButton variant="ghost" onClick={() => navigate('/admin/users')} sx={{ color: 'var(--pantry-green-600)', fontWeight: 700 }}>
                        &larr; Back to Directory
                    </PantryButton>
                </Box>

                <Grid container spacing={4}>
                    {/* User Profile Info */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1.5px solid var(--pantry-gray-100)', bgcolor: 'white' }}>
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Avatar 
                                    sx={{ 
                                        width: 100, 
                                        height: 100, 
                                        mx: 'auto', 
                                        mb: 2, 
                                        bgcolor: 'var(--pantry-green-600)', 
                                        fontSize: '2.5rem', 
                                        fontWeight: 800,
                                        boxShadow: '0 8px 24px rgba(46, 125, 50, 0.2)'
                                    }}
                                >
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </Avatar>
                                <Typography variant="h3" sx={{ fontWeight: 800 }}>{user?.firstName} {user?.lastName}</Typography>
                                <Chip 
                                    label={`Member since ${new Date(user?.createdAt).getFullYear()}`} 
                                    size="small" 
                                    sx={{ mt: 1, bgcolor: 'var(--pantry-green-50)', color: 'var(--pantry-green-600)', fontWeight: 700, fontSize: '11px' }} 
                                />
                            </Box>

                            <Divider sx={{ mb: 4, borderColor: 'var(--pantry-gray-100)' }} />

                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'var(--pantry-gray-400)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Email Address</Typography>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.5 }}>
                                        <Mail size={16} color="var(--pantry-green-600)" />
                                        <Typography sx={{ fontWeight: 600 }}>{user?.email}</Typography>
                                    </Stack>
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'var(--pantry-gray-400)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Phone Number</Typography>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.5 }}>
                                        <Phone size={16} color="var(--pantry-green-600)" />
                                        <Typography sx={{ fontWeight: 600 }}>{user?.phone || 'Not provided'}</Typography>
                                    </Stack>
                                </Box>
                            </Stack>

                            <Box sx={{ mt: 6 }}>
                                <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <MapPin size={20} color="var(--pantry-green-600)" /> Delivery Addresses
                                </Typography>
                                <Stack spacing={2}>
                                    {user?.addresses?.length > 0 ? (
                                        user.addresses.map((addr: any, idx: number) => (
                                            <Paper key={idx} variant="outlined" sx={{ p: 2, borderRadius: '12px', border: '1.5px solid var(--pantry-gray-100)', bgcolor: 'var(--pantry-gray-50)' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{addr.street}</Typography>
                                                <Typography variant="caption" sx={{ color: 'var(--pantry-gray-400)', fontWeight: 500 }}>
                                                    {addr.city}, {addr.state} - {addr.zip}
                                                </Typography>
                                            </Paper>
                                        ))
                                    ) : (
                                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'var(--pantry-gray-400)' }}>No addresses saved yet.</Typography>
                                    )}
                                </Stack>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Order History */}
                    <Grid item xs={12} md={8}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1.5px solid var(--pantry-gray-100)', bgcolor: 'white', minHeight: 600 }}>
                            <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <ShoppingBag size={24} color="var(--pantry-green-600)" /> Order History
                            </Typography>
                            
                            <Stack spacing={3}>
                                {orders.length > 0 ? (
                                    orders.map((order: any) => (
                                        <Paper key={order._id} sx={{ p: 3, borderRadius: '16px', border: '1.5px solid var(--pantry-gray-100)', bgcolor: 'white' }}>
                                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: 2 }}>
                                                <Box>
                                                    <Typography sx={{ fontWeight: 800 }}>Order #{order._id.slice(-6).toUpperCase()}</Typography>
                                                    <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                                                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'var(--pantry-gray-400)' }}>
                                                            <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                                                        </Typography>
                                                        <Chip 
                                                            label={order.orderStatus} 
                                                            size="small" 
                                                            color={getStatusColor(order.orderStatus) as any}
                                                            sx={{ height: 20, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}
                                                        />
                                                    </Stack>
                                                </Box>
                                                <Typography variant="h4" sx={{ fontWeight: 800 }}>₹{order.totalAmount.toFixed(2)}</Typography>
                                            </Box>
                                            
                                            <Box sx={{ mt: 2, p: 2, bgcolor: 'var(--pantry-gray-50)', borderRadius: '12px' }}>
                                                {order.items.map((item: any, idx: number) => (
                                                    <Box key={idx} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 1, mb: idx < order.items.length - 1 ? 2 : 0 }}>
                                                        <Typography variant="body2" sx={{ color: 'var(--pantry-gray-800)', fontWeight: 700 }}>
                                                            {item.name} <Box component="span" sx={{ color: 'var(--pantry-gray-400)', fontWeight: 500 }}>x {item.quantity}</Box>
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 800 }}>₹{(item.price * item.quantity).toFixed(2)}</Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Paper>
                                    ))
                                ) : (
                                    <Box sx={{ py: 10, textAlign: 'center', border: '2px dashed var(--pantry-gray-100)', borderRadius: '24px' }}>
                                        <ShoppingBag size={48} color="var(--pantry-gray-100)" strokeWidth={1} style={{ marginBottom: 16 }} />
                                        <Typography variant="body1" sx={{ color: 'var(--pantry-gray-400)', fontWeight: 500 }}>No orders placed by this customer yet.</Typography>
                                    </Box>
                                )}
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AdminUserDetails;
