import { Box, Container, Typography, Grid, Card, CardContent, Paper, Stack, Divider } from '@mui/material';
import { useGetProductsQuery } from '../../store/api/productApi';
import { useGetRecipesQuery } from '../../store/api/recipesApi';
import { useGetAllUsersQuery } from '../../store/api/userApi';
import { useGetAllOrdersQuery, useGetRevenueStatsQuery } from '../../store/api/orderApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Package, Users, ShoppingBag, PlusCircle, ArrowRight, TrendingUp, ChefHat, Activity } from 'lucide-react';
import { PantryButton } from '../../components/ui/PantryButton';

const AdminDashboard = () => {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            navigate('/login');
        }
    }, [isAuthenticated, user, navigate]);

    const { data: productsData } = useGetProductsQuery({ limit: 1 });
    const { data: recipesData } = useGetRecipesQuery({ limit: 1 });
    const { data: usersData } = useGetAllUsersQuery(undefined);
    const { data: ordersData } = useGetAllOrdersQuery(undefined);
    const { data: revenueData } = useGetRevenueStatsQuery(undefined);

    const stats = [
        {
            title: 'Revenue',
            count: `₹${revenueData?.data?.totalRevenue?.toLocaleString() || 0}`,
            link: '/admin/orders',
            color: 'var(--pantry-green-600)',
            bgColor: 'var(--pantry-green-50)',
            icon: <TrendingUp size={24} />
        },
        {
            title: 'Active Users',
            count: usersData?.data?.length || 0,
            link: '/admin/users',
            color: '#0284c7',
            bgColor: '#f0f9ff',
            icon: <Users size={24} />
        },
        {
            title: 'New Orders',
            count: ordersData?.data?.orders?.filter((o: any) => o.orderStatus === 'processing').length || 0,
            link: '/admin/orders',
            color: 'var(--pantry-sale)',
            bgColor: '#fff1f2',
            icon: <ShoppingBag size={24} />
        },
        {
            title: 'Stock Items',
            count: productsData?.data?.total || 0,
            link: '/admin/products',
            color: 'var(--pantry-amber-600)',
            bgColor: 'var(--pantry-amber-50)',
            icon: <Package size={24} />
        }
    ];

    return (
        <Box sx={{ py: 6, bgcolor: 'var(--pantry-cream)', minHeight: '100vh' }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Box>
                        <Typography variant="h1" sx={{ fontWeight: 800, mb: 1 }}>Pantry Manager</Typography>
                        <Typography variant="body1" sx={{ color: 'var(--pantry-gray-400)' }}>Fresh & Organic Admin Console</Typography>
                    </Box>
                    <Paper elevation={0} sx={{ p: 1.5, px: 3, borderRadius: '12px', bgcolor: 'white', border: '1px solid var(--pantry-gray-100)' }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Activity size={18} color="var(--pantry-green-600)" />
                            <Typography sx={{ fontWeight: 700, fontSize: '14px', color: 'var(--pantry-green-800)' }}>Operations Live</Typography>
                        </Stack>
                    </Paper>
                </Box>

                <Grid container spacing={3} sx={{ mb: 8 }}>
                    {stats.map((stat, idx) => (
                        <Grid item xs={12} sm={6} md={3} key={idx}>
                            <Card 
                                elevation={0} 
                                sx={{ 
                                    borderRadius: '16px', 
                                    border: '1px solid var(--pantry-gray-100)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.05)' }
                                }}
                                onClick={() => navigate(stat.link)}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                        <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: stat.bgColor, color: stat.color }}>{stat.icon}</Box>
                                        <ArrowRight size={18} color="var(--pantry-gray-100)" />
                                    </Stack>
                                    <Typography variant="h2" sx={{ fontWeight: 800, mb: 0.5 }}>{stat.count}</Typography>
                                    <Typography sx={{ fontWeight: 600, color: 'var(--pantry-gray-400)', fontSize: '14px' }}>{stat.title}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={5}>
                    <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 4, gap: 2 }}>
                            <Typography variant="h3" sx={{ fontWeight: 800 }}>Recent Activity</Typography>
                            <PantryButton variant="ghost" onClick={() => navigate('/admin/orders')} sx={{ color: 'var(--pantry-green-600)', fontWeight: 700 }}>
                                View All Orders &rarr;
                            </PantryButton>
                        </Box>
                        <Paper elevation={0} sx={{ borderRadius: '20px', overflow: 'hidden', border: '1.5px solid var(--pantry-gray-100)', bgcolor: 'white' }}>
                            {ordersData?.data?.orders?.slice(0, 6).map((order: any, idx: number) => (
                                <Box key={order._id} sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, borderBottom: idx < 5 ? '1px solid var(--pantry-gray-100)' : 'none', '&:hover': { bgcolor: 'var(--pantry-gray-50)' } }}>
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 700 }}>Order #{order._id.slice(-6).toUpperCase()}</Typography>
                                        <Typography variant="caption" sx={{ color: 'var(--pantry-gray-400)', fontWeight: 500 }}>{order.user?.firstName} {order.user?.lastName} • {new Date(order.createdAt).toLocaleDateString()}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                                        <Typography variant="body1" sx={{ fontWeight: 800 }}>₹{order.totalAmount.toFixed(2)}</Typography>
                                        <Box sx={{ color: 'var(--pantry-green-600)', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', mt: 0.5, letterSpacing: 0.5 }}>{order.orderStatus}</Box>
                                    </Box>
                                </Box>
                            ))}
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 4 }}>Quick Actions</Typography>
                        <Stack spacing={2}>
                            <PantryButton variant="primary" fullWidth startIcon={<PlusCircle size={20} />} onClick={() => navigate('/admin/products/new')} sx={{ height: 56, borderRadius: '16px' }}>
                                Add New Product
                            </PantryButton>
                            <PantryButton variant="ghost" fullWidth startIcon={<ChefHat size={20} />} onClick={() => navigate('/admin/recipes/new')} sx={{ height: 56, borderRadius: '16px', color: 'var(--pantry-green-600)', borderColor: 'var(--pantry-green-100)' }}>
                                Create Recipe
                            </PantryButton>
                            <Divider sx={{ my: 2 }} />
                            <PantryButton variant="ghost" fullWidth onClick={() => navigate('/admin/categories')} sx={{ height: 50, borderRadius: '12px', justifyContent: 'flex-start', px: 3 }}>Category Management</PantryButton>
                            <PantryButton variant="ghost" fullWidth onClick={() => navigate('/admin/users')} sx={{ height: 50, borderRadius: '12px', justifyContent: 'flex-start', px: 3 }}>User Directory</PantryButton>
                            <PantryButton variant="ghost" fullWidth onClick={() => navigate('/admin/slots')} sx={{ height: 50, borderRadius: '12px', justifyContent: 'flex-start', px: 3 }}>Delivery Slots</PantryButton>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AdminDashboard;
