import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Paper, TextField, Stepper, Step, StepLabel, Divider, Stack, RadioGroup, FormControlLabel, Radio, CircularProgress, Chip } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { useGetCartQuery } from '../store/api/cartApi';
import { useCreateOrderMutation } from '../store/api/orderApi';
import { MapPin, CreditCard, ShieldCheck, Truck, Clock, Smartphone, Banknote } from 'lucide-react';
import { PantryButton } from '../components/ui/PantryButton';

const steps = ['Delivery Info', 'Slot & Payment'];

const Checkout = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const { data: cartData, isLoading: isCartLoading } = useGetCartQuery(undefined, { skip: !isAuthenticated });
    const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();

    const [activeStep, setActiveStep] = useState(0);
    const [deliverySlot, setDeliverySlot] = useState('morning');
    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city: '',
        state: '',
        postcode: '',
        country: 'India',
        phone: user?.phone || '',
    });
    const [paymentMethod, setPaymentMethod] = useState('card');

    const cartItems = cartData?.data?.items || [];
    const subtotal = cartItems.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);
    const deliveryFee = subtotal > 499 ? 0 : 49;
    const loyaltyDiscount = subtotal > 1000 ? subtotal * 0.05 : 0;
    const total = subtotal + deliveryFee - loyaltyDiscount;

    useEffect(() => {
        if (!isCartLoading && cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, isCartLoading, navigate]);

    const handleNext = () => {
        if (activeStep === 0) {
            if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.postcode || !shippingAddress.phone) return;
        }
        setActiveStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handlePlaceOrder = async () => {
        try {
            const res = await createOrder({
                shippingAddress: {
                    street: shippingAddress.street,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    zip: shippingAddress.postcode,
                    country: shippingAddress.country,
                    phone: shippingAddress.phone,
                },
                paymentMethod,
                deliverySlot,
            }).unwrap();
            
            navigate('/order-success', { state: { orderId: res.data._id } });
        } catch (err) {
            console.error(err);
        }
    };

    if (isCartLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}><CircularProgress color="primary" /></Box>;

    return (
        <Box sx={{ py: { xs: 4, md: 8 }, bgcolor: 'var(--pantry-cream)', minHeight: '100vh' }}>
            <Container maxWidth="xl">
                <Typography variant="h1" sx={{ fontWeight: 800, mb: 6 }}>Checkout</Typography>
                
                <Stepper activeStep={activeStep} sx={{ 
                    mb: 8,
                    '& .MuiStepIcon-root.Mui-active': { color: 'var(--pantry-green-600)' },
                    '& .MuiStepIcon-root.Mui-completed': { color: 'var(--pantry-green-600)' },
                    '& .MuiStepLabel-label': { fontWeight: 600 }
                }}>
                    {steps.map((label) => (
                        <Step key={label}><StepLabel>{label}</StepLabel></Step>
                    ))}
                </Stepper>

                <Grid container spacing={5}>
                    <Grid item xs={12} md={8}>
                        {activeStep === 0 && (
                            <Paper elevation={0} sx={{ p: 5, borderRadius: '20px', border: '1.5px solid var(--pantry-gray-100)', bgcolor: 'white' }}>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                                    <MapPin size={28} color="var(--pantry-green-600)" />
                                    <Typography variant="h3" sx={{ fontWeight: 800 }}>Delivery Details</Typography>
                                </Stack>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField 
                                            fullWidth label="Full Address (House No, Building, Street)" 
                                            variant="outlined"
                                            value={shippingAddress.street}
                                            onChange={(e) => setShippingAddress(p => ({ ...p, street: e.target.value }))}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField 
                                            fullWidth label="City / Area" 
                                            value={shippingAddress.city}
                                            onChange={(e) => setShippingAddress(p => ({ ...p, city: e.target.value }))}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField 
                                            fullWidth label="Pincode" 
                                            value={shippingAddress.postcode}
                                            onChange={(e) => setShippingAddress(p => ({ ...p, postcode: e.target.value }))}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField 
                                            fullWidth label="Mobile Number for Delivery" 
                                            value={shippingAddress.phone}
                                            onChange={(e) => setShippingAddress(p => ({ ...p, phone: e.target.value }))}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                        />
                                    </Grid>
                                </Grid>
                                <PantryButton 
                                    variant="primary" 
                                    sx={{ mt: 6, borderRadius: '24px', px: 6, height: 52 }} 
                                    onClick={handleNext}
                                >
                                    Proceed to Payment
                                </PantryButton>
                            </Paper>
                        )}

                        {activeStep === 1 && (
                            <Stack spacing={4}>
                                {/* Delivery Slot */}
                                <Paper elevation={0} sx={{ p: 5, borderRadius: '20px', border: '1.5px solid var(--pantry-gray-100)', bgcolor: 'white' }}>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                                        <Clock size={28} color="var(--pantry-green-600)" />
                                        <Typography variant="h3" sx={{ fontWeight: 800 }}>Choose Delivery Slot</Typography>
                                    </Stack>
                                    <RadioGroup value={deliverySlot} onChange={(e) => setDeliverySlot(e.target.value)}>
                                        <Grid container spacing={2}>
                                            {[
                                                { id: 'morning', label: 'Morning (6 AM - 9 AM)', sub: 'Early harvest delivery' },
                                                { id: 'afternoon', label: 'Midday (11 AM - 2 PM)', sub: 'Perfect for lunch prep' },
                                                { id: 'evening', label: 'Evening (5 PM - 8 PM)', sub: 'Fresh for dinner' }
                                            ].map((slot) => (
                                                <Grid item xs={12} key={slot.id}>
                                                    <Paper 
                                                        variant="outlined" 
                                                        sx={{ 
                                                            p: 2, 
                                                            borderRadius: '12px', 
                                                            cursor: 'pointer',
                                                            borderColor: deliverySlot === slot.id ? 'var(--pantry-green-600)' : 'var(--pantry-gray-100)',
                                                            bgcolor: deliverySlot === slot.id ? 'var(--pantry-green-50)' : 'white'
                                                        }}
                                                        onClick={() => setDeliverySlot(slot.id)}
                                                    >
                                                        <FormControlLabel 
                                                            value={slot.id} 
                                                            control={<Radio sx={{ color: 'var(--pantry-green-600)', '&.Mui-checked': { color: 'var(--pantry-green-600)' } }} />} 
                                                            label={
                                                                <Box sx={{ ml: 1 }}>
                                                                    <Typography sx={{ fontWeight: 700 }}>{slot.label}</Typography>
                                                                    <Typography variant="caption" sx={{ color: 'var(--pantry-gray-400)' }}>{slot.sub}</Typography>
                                                                </Box>
                                                            } 
                                                        />
                                                    </Paper>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </RadioGroup>
                                </Paper>

                                {/* Payment Method */}
                                <Paper elevation={0} sx={{ p: 5, borderRadius: '20px', border: '1.5px solid var(--pantry-gray-100)', bgcolor: 'white' }}>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                                        <CreditCard size={28} color="var(--pantry-green-600)" />
                                        <Typography variant="h3" sx={{ fontWeight: 800 }}>Payment Method</Typography>
                                    </Stack>
                                    <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                        <Grid container spacing={2}>
                                            {[
                                                { id: 'upi', label: 'UPI / PhonePe / GPay', sub: 'Instant & Secure', icon: <Smartphone size={20} /> },
                                                { id: 'card', label: 'Credit / Debit Card', sub: 'All major cards accepted', icon: <CreditCard size={20} /> },
                                                { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when items arrive', icon: <Banknote size={20} /> }
                                            ].map((method) => (
                                                <Grid item xs={12} key={method.id}>
                                                    <Paper 
                                                        variant="outlined" 
                                                        sx={{ 
                                                            p: 2, 
                                                            borderRadius: '12px', 
                                                            cursor: 'pointer',
                                                            borderColor: paymentMethod === method.id ? 'var(--pantry-green-600)' : 'var(--pantry-gray-100)',
                                                            bgcolor: paymentMethod === method.id ? 'var(--pantry-green-50)' : 'white'
                                                        }}
                                                        onClick={() => setPaymentMethod(method.id)}
                                                    >
                                                        <FormControlLabel 
                                                            value={method.id} 
                                                            control={<Radio sx={{ color: 'var(--pantry-green-600)', '&.Mui-checked': { color: 'var(--pantry-green-600)' } }} />} 
                                                            label={
                                                                <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 1 }}>
                                                                    <Box sx={{ color: 'var(--pantry-green-600)' }}>{method.icon}</Box>
                                                                    <Box>
                                                                        <Typography sx={{ fontWeight: 700 }}>{method.label}</Typography>
                                                                        <Typography variant="caption" sx={{ color: 'var(--pantry-gray-400)' }}>{method.sub}</Typography>
                                                                    </Box>
                                                                </Stack>
                                                            } 
                                                        />
                                                    </Paper>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </RadioGroup>
                                    <Stack direction="row" spacing={2} sx={{ mt: 6 }}>
                                        <PantryButton variant="ghost" onClick={handleBack} sx={{ fontWeight: 700 }}>&larr; Back</PantryButton>
                                        <PantryButton variant="primary" onClick={handlePlaceOrder} loading={isCreating} sx={{ borderRadius: '24px', px: 6, flexGrow: 1 }}>
                                            Place Order • ₹{total.toFixed(2)}
                                        </PantryButton>
                                    </Stack>
                                </Paper>
                            </Stack>
                        )}
                    </Grid>

                    {/* Summary Sidebar */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: '20px', position: 'sticky', top: 120, border: '1.5px solid var(--pantry-gray-100)', bgcolor: 'white' }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Cart Items</Typography>
                            <Stack spacing={2.5} sx={{ mb: 4 }}>
                                {cartItems.map((item: any) => (
                                    <Box key={item.product._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box sx={{ maxWidth: '70%' }}>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.product.name}</Typography>
                                            <Typography variant="caption" sx={{ color: 'var(--pantry-gray-400)' }}>Qty: {item.quantity}</Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 800 }}>₹{(item.product.price * item.quantity).toFixed(2)}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                            <Divider sx={{ mb: 3 }} />
                            <Stack spacing={2} sx={{ mb: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ color: 'var(--pantry-gray-400)', fontWeight: 500 }}>Subtotal</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>₹{subtotal.toFixed(2)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ color: 'var(--pantry-gray-400)', fontWeight: 500 }}>Delivery</Typography>
                                    <Typography sx={{ fontWeight: 700, color: deliveryFee === 0 ? 'var(--pantry-green-600)' : 'inherit' }}>
                                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                                    </Typography>
                                </Box>
                                {loyaltyDiscount > 0 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography sx={{ color: 'var(--pantry-green-600)', fontWeight: 600 }}>Loyalty Discount (5%)</Typography>
                                        <Typography sx={{ fontWeight: 800, color: 'var(--pantry-green-600)' }}>-₹{loyaltyDiscount.toFixed(2)}</Typography>
                                    </Box>
                                )}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 800 }}>Total</Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'var(--pantry-green-600)' }}>
                                        ₹{total.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <ShieldCheck size={20} color="var(--pantry-green-600)" />
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--pantry-gray-800)' }}>Safe & Secure Checkout</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Truck size={20} color="var(--pantry-green-600)" />
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--pantry-gray-800)' }}>Freshly packed for you</Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Checkout;
