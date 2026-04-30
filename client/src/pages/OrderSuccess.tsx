import { Box, Container, Typography, Paper, Stack } from '@mui/material';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PantryButton } from '../components/ui/PantryButton';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state?.orderId;

    return (
        <Box sx={{ 
            py: { xs: 8, md: 15 }, 
            bgcolor: 'var(--pantry-cream)', 
            minHeight: '90vh', 
            display: 'flex', 
            alignItems: 'center',
            background: 'radial-gradient(circle at 50% 50%, var(--pantry-green-50), transparent)'
        }}>
            <Container maxWidth="sm">
                <Paper elevation={0} sx={{ 
                    p: { xs: 4, md: 8 }, 
                    textAlign: 'center', 
                    borderRadius: '32px', 
                    border: '1.5px solid var(--pantry-gray-100)',
                    bgcolor: 'white',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.05)'
                }}>
                    <Box sx={{ mb: 5, display: 'inline-flex', p: 3, borderRadius: '50%', bgcolor: 'var(--pantry-green-50)', color: 'var(--pantry-green-600)' }}>
                        <CheckCircle2 size={80} strokeWidth={1.5} />
                    </Box>
                    
                    <Typography variant="h1" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '32px', md: '48px' } }}>
                        Order Placed!
                    </Typography>
                    
                    <Typography variant="body1" sx={{ color: 'var(--pantry-gray-400)', fontSize: '18px', mb: 1, fontWeight: 500 }}>
                        Your harvest is being prepared.
                    </Typography>
                    
                    {orderId && (
                        <Typography variant="caption" sx={{ display: 'block', mb: 4, color: 'var(--pantry-green-600)', fontWeight: 800, letterSpacing: 1 }}>
                            ORDER ID: #{orderId.slice(-8).toUpperCase()}
                        </Typography>
                    )}

                    <Typography variant="body2" sx={{ color: 'var(--pantry-gray-400)', mb: 6, lineHeight: 1.6, maxWidth: 320, mx: 'auto' }}>
                        We've received your order and our team is already hand-picking the freshest produce for you. 
                        You'll receive a notification once your delivery is on the way.
                    </Typography>

                    <Stack spacing={2}>
                        <PantryButton
                            variant="primary"
                            fullWidth
                            onClick={() => navigate('/orders')}
                            sx={{ height: 56, borderRadius: '28px', fontSize: '16px', fontWeight: 700 }}
                        >
                            Track My Delivery
                        </PantryButton>
                        <PantryButton
                            variant="ghost"
                            fullWidth
                            startIcon={<ShoppingBag size={20} />}
                            onClick={() => navigate('/shop')}
                            sx={{ color: 'var(--pantry-green-600)', fontWeight: 700 }}
                        >
                            Back to the Pantry
                        </PantryButton>
                    </Stack>

                    <Box sx={{ mt: 8, pt: 4, borderTop: '1.5px solid var(--pantry-gray-50)', display: 'flex', justifyContent: 'center', gap: 4 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--pantry-green-600)' }}>100%</Typography>
                            <Typography variant="caption" sx={{ color: 'var(--pantry-gray-400)', fontWeight: 600 }}>Organic</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--pantry-amber-600)' }}>90m</Typography>
                            <Typography variant="caption" sx={{ color: 'var(--pantry-gray-400)', fontWeight: 600 }}>Delivery</Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default OrderSuccess;
