import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCartQuery, useRemoveFromCartMutation, useUpdateCartQuantityMutation } from '../store/api/cartApi';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Box, Container, Typography, Grid, Paper, IconButton, Divider, CircularProgress, Stack, Link } from '@mui/material';
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { PantryButton } from '../components/ui/PantryButton';

const Cart = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { data: cartData, isLoading } = useGetCartQuery(undefined, { skip: !isAuthenticated });
    
    const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();
    const [updateQuantity, { isLoading: isUpdating }] = useUpdateCartQuantityMutation();

    const cartItems = cartData?.data?.items || [];
    const subtotal = cartItems.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);
    const deliveryFee = subtotal >= 15 ? 0 : 2.50;
    const total = subtotal + deliveryFee;

    const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        try {
            await updateQuantity({ productId, quantity: newQuantity }).unwrap();
        } catch (error) {
            console.error("Failed to update quantity", error);
        }
    };

    const handleRemoveItem = async (productId: string) => {
        try {
            await removeFromCart(productId).unwrap();
        } catch (error) {
            console.error("Failed to remove item", error);
        }
    };

    if (!isAuthenticated || (cartItems.length === 0 && !isLoading)) {
        return (
            <Container sx={{ py: 12, textAlign: 'center' }}>
                <Box sx={{ color: 'var(--pantry-gray-100)', mb: 4 }}>
                    <ShoppingBag size={120} strokeWidth={1} />
                </Box>
                <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>Your trolley is empty</Typography>
                <Typography variant="body1" sx={{ color: 'var(--pantry-gray-400)', mb: 6, maxWidth: 400, mx: 'auto' }}>
                    Looks like you haven't added any fresh produce to your trolley yet. Let's find something delicious!
                </Typography>
                <PantryButton variant="primary" onClick={() => navigate('/shop')} sx={{ px: 6, py: 1.5, borderRadius: '24px' }}>
                    Start Shopping
                </PantryButton>
            </Container>
        );
    }

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    return (
        <Box sx={{ py: { xs: 4, md: 8 }, bgcolor: 'var(--pantry-cream)', minHeight: '90vh' }}>
            <Container maxWidth="xl">
                <Typography variant="h1" sx={{ fontWeight: 800, mb: 6 }}>Your Trolley</Typography>
                
                <Grid container spacing={4}>
                    {/* Items List */}
                    <Grid item xs={12} md={8}>
                        <Stack spacing={3}>
                            {cartItems.map((item: any) => (
                                <Paper 
                                    key={item.product._id}
                                    elevation={0} 
                                    sx={{ 
                                        p: 3, 
                                        borderRadius: '16px', 
                                        border: '1.5px solid var(--pantry-gray-100)',
                                        bgcolor: 'white'
                                    }}
                                >
                                    <Grid container spacing={3} alignItems="center">
                                        <Grid item xs={4} sm={2}>
                                            <Box 
                                                sx={{ 
                                                    aspectRatio: '1/1',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    bgcolor: 'var(--pantry-gray-50)',
                                                    borderRadius: '12px',
                                                    p: 1
                                                }}
                                                onClick={() => navigate(`/product/${item.product._id}`)}
                                            >
                                                <img src={item.product.images[0]} alt={item.product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                            </Box>
                                        </Grid>
                                        
                                        <Grid item xs={8} sm={5}>
                                            <Typography variant="body2" sx={{ color: 'var(--pantry-green-600)', fontWeight: 700, mb: 0.5 }}>{item.product.brand}</Typography>
                                            <Typography 
                                                variant="h5" 
                                                sx={{ 
                                                    fontWeight: 700, 
                                                    cursor: 'pointer',
                                                    '&:hover': { color: 'var(--pantry-green-600)' } 
                                                }}
                                                onClick={() => navigate(`/product/${item.product._id}`)}
                                            >
                                                {item.product.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'var(--pantry-gray-400)', mt: 0.5 }}>{item.product.weight}</Typography>
                                        </Grid>

                                        <Grid item xs={6} sm={3}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--pantry-green-600)', borderRadius: '24px', px: 1, width: 'fit-content' }}>
                                                <IconButton size="small" onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)} disabled={item.quantity <= 1 || isUpdating} sx={{ color: 'var(--pantry-green-600)' }}>
                                                    <Minus size={18} />
                                                </IconButton>
                                                <Typography sx={{ width: 32, textAlign: 'center', fontWeight: 800 }}>{item.quantity}</Typography>
                                                <IconButton size="small" onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)} disabled={isUpdating} sx={{ color: 'var(--pantry-green-600)' }}>
                                                    <Plus size={18} />
                                                </IconButton>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={6} sm={2} sx={{ textAlign: 'right' }}>
                                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>£{(item.product.price * item.quantity).toFixed(2)}</Typography>
                                            <IconButton 
                                                size="small"
                                                sx={{ color: 'var(--pantry-gray-400)', '&:hover': { color: 'var(--pantry-sale)' } }} 
                                                onClick={() => handleRemoveItem(item.product._id)} 
                                                disabled={isRemoving}
                                            >
                                                <Trash2 size={18} />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))}
                        </Stack>
                        
                        <PantryButton 
                            variant="ghost" 
                            onClick={() => navigate('/shop')} 
                            sx={{ mt: 4, color: 'var(--pantry-green-600)', fontWeight: 700 }}
                        >
                            &larr; Add more items
                        </PantryButton>
                    </Grid>

                    {/* Summary Sidebar */}
                    <Grid item xs={12} md={4}>
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 4, 
                                borderRadius: '20px', 
                                position: 'sticky', 
                                top: 120,
                                border: '1.5px solid var(--pantry-gray-100)',
                                bgcolor: 'white'
                            }}
                        >
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Order Summary</Typography>
                            
                            <Stack spacing={2} sx={{ mb: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ color: 'var(--pantry-gray-400)', fontWeight: 500 }}>Subtotal</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>£{subtotal.toFixed(2)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ color: 'var(--pantry-gray-400)', fontWeight: 500 }}>Delivery Fee</Typography>
                                    <Typography sx={{ fontWeight: 700, color: deliveryFee === 0 ? 'var(--pantry-green-600)' : 'inherit' }}>
                                        {deliveryFee === 0 ? 'FREE' : `£${deliveryFee.toFixed(2)}`}
                                    </Typography>
                                </Box>
                                {deliveryFee > 0 && (
                                    <Typography variant="caption" sx={{ color: 'var(--pantry-green-600)', fontWeight: 600 }}>
                                        Add £{(15 - subtotal).toFixed(2)} more for FREE delivery
                                    </Typography>
                                )}
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h4" sx={{ fontWeight: 800 }}>Total</Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'var(--pantry-green-600)' }}>
                                        £{total.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Stack>
  
                            <PantryButton 
                                variant="primary" 
                                fullWidth 
                                onClick={() => navigate('/checkout')}
                                sx={{ py: 2, borderRadius: '24px', fontSize: '18px', fontWeight: 800, bgcolor: 'var(--pantry-green-600)', mb: 3 }}
                            >
                                Checkout <ArrowRight size={20} style={{ marginLeft: 8 }} />
                            </PantryButton>
  
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <ShieldCheck size={20} color="var(--pantry-green-600)" />
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--pantry-gray-800)' }}>
                                        Secure 256-bit SSL encrypted payments
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Truck size={20} color="var(--pantry-green-600)" />
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--pantry-gray-800)' }}>
                                        Contactless farm-fresh delivery
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Cart;
