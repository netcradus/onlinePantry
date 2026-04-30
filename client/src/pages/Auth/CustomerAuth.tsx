import { useState } from 'react';
import { Box, Container, Typography, TextField, Paper, Alert, Stepper, Step, StepLabel, Stack, Chip } from '@mui/material';
import { useSendOtpMutation, useVerifyOtpMutation, useRegisterCustomerMutation } from '../../store/api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Smartphone, CheckCircle2, UserCircle2 } from 'lucide-react';
import PhoneInputWithCountry from '../../components/PhoneInputWithCountry';
import { PantryButton } from '../../components/ui/PantryButton';

const steps = ['Phone', 'Verify', 'Profile'];

const CustomerAuth = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        phone: '',
        otp: '',
        firstName: '',
        lastName: '',
        email: '',
    });
    const [error, setError] = useState('');
    const [verificationToken, setVerificationToken] = useState('');
    const [countryCode, setCountryCode] = useState('+91'); // Default to India

    const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
    const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
    const [registerCustomer, { isLoading: isRegistering }] = useRegisterCustomerMutation();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const fullPhone = `${countryCode}${formData.phone}`;
            await sendOtp({ phone: fullPhone }).unwrap();
            setActiveStep(1);
        } catch (err: any) {
            setError(err.data?.message || 'Failed to send OTP');
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const fullPhone = `${countryCode}${formData.phone}`;
            const response = await verifyOtp({ phone: fullPhone, otp: formData.otp }).unwrap();

            if (response.data?.isNewUser) {
                setVerificationToken(response.data.verificationToken);
                setActiveStep(2);
            } else {
                dispatch(setCredentials({ user: response.data.user, token: response.data.accessToken }));
                navigate(from, { replace: true });
            }
        } catch (err: any) {
            setError(err.data?.message || 'Invalid OTP');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const data = {
                ...formData,
                verificationToken,
            };
            const response = await registerCustomer(data).unwrap();

            dispatch(setCredentials({ user: response.data.user, token: response.data.accessToken }));
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.data?.message || 'Registration failed');
        }
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box component="form" onSubmit={handleSendOtp}>
                        <Stack spacing={4} alignItems="center" sx={{ mb: 4 }}>
                            <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'var(--pantry-green-50)', color: 'var(--pantry-green-600)' }}>
                                <Smartphone size={32} />
                            </Box>
                            <Typography variant="body1" sx={{ textAlign: 'center', color: 'var(--pantry-gray-400)', fontWeight: 500 }}>
                                We'll send a 6-digit OTP to verify your phone number
                            </Typography>
                        </Stack>
                        <PhoneInputWithCountry
                            countryCode={countryCode}
                            setCountryCode={setCountryCode}
                            phoneNumber={formData.phone}
                            setPhoneNumber={handleChange}
                        />
                        <PantryButton
                            fullWidth
                            variant="primary"
                            size="large"
                            type="submit"
                            loading={isSendingOtp}
                            sx={{ mt: 4, height: 54, borderRadius: '24px', fontSize: '16px', fontWeight: 700 }}
                        >
                            Get OTP
                        </PantryButton>
                    </Box>
                );
            case 1:
                return (
                    <Box component="form" onSubmit={handleVerifyOtp}>
                        <Stack spacing={4} alignItems="center" sx={{ mb: 4 }}>
                            <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'var(--pantry-amber-50)', color: 'var(--pantry-amber-600)' }}>
                                <CheckCircle2 size={32} />
                            </Box>
                            <Typography variant="body1" sx={{ textAlign: 'center', color: 'var(--pantry-gray-400)', fontWeight: 500 }}>
                                Enter the code sent to <strong>{countryCode} {formData.phone}</strong>
                            </Typography>
                        </Stack>
                        <TextField
                            fullWidth
                            label="6-Digit OTP"
                            name="otp"
                            value={formData.otp}
                            onChange={handleChange}
                            required
                            variant="outlined"
                            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '8px', fontSize: '20px', fontWeight: 800 } }}
                        />
                        <PantryButton
                            fullWidth
                            variant="primary"
                            size="large"
                            type="submit"
                            loading={isVerifyingOtp}
                            sx={{ mt: 2, height: 54, borderRadius: '24px', fontSize: '16px', fontWeight: 700 }}
                        >
                            Verify & Continue
                        </PantryButton>
                        <PantryButton
                            fullWidth
                            variant="ghost"
                            onClick={() => setActiveStep(0)}
                            sx={{ mt: 2, fontWeight: 700 }}
                        >
                            Change Number
                        </PantryButton>
                    </Box>
                );
            case 2:
                return (
                    <Box component="form" onSubmit={handleRegister}>
                        <Stack spacing={4} alignItems="center" sx={{ mb: 4 }}>
                            <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'var(--pantry-green-50)', color: 'var(--pantry-green-600)' }}>
                                <UserCircle2 size={32} />
                            </Box>
                            <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 800 }}>Complete Profile</Typography>
                        </Stack>
                        <Stack spacing={2.5}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Stack>
                        <PantryButton
                            fullWidth
                            variant="primary"
                            size="large"
                            type="submit"
                            loading={isRegistering}
                            sx={{ mt: 5, height: 54, borderRadius: '24px', fontSize: '16px', fontWeight: 700 }}
                        >
                            Join Online Pantry
                        </PantryButton>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'var(--pantry-cream)',
            py: 8,
            background: 'radial-gradient(circle at top left, var(--pantry-green-50), transparent), radial-gradient(circle at bottom right, var(--pantry-amber-50), transparent)'
        }}>
            <Container maxWidth="xs">
                <Paper elevation={0} sx={{ 
                    p: { xs: 4, md: 6 }, 
                    borderRadius: '32px', 
                    border: '1.5px solid var(--pantry-gray-100)',
                    bgcolor: 'white',
                    boxShadow: '0 30px 90px rgba(0,0,0,0.06)'
                }}>
                    <Box sx={{ mb: 5, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                            Online<Box component="span" sx={{ color: 'var(--pantry-green-600)' }}>Pantry</Box>
                        </Typography>
                        <Chip label="Fresh Groceries" size="small" sx={{ bgcolor: 'var(--pantry-green-50)', color: 'var(--pantry-green-600)', fontWeight: 700, fontSize: '11px' }} />
                    </Box>

                    <Stepper activeStep={activeStep} alternativeLabel sx={{ 
                        mb: 6,
                        '& .MuiStepIcon-root.Mui-active': { color: 'var(--pantry-green-600)' },
                        '& .MuiStepIcon-root.Mui-completed': { color: 'var(--pantry-green-600)' },
                        '& .MuiStepLabel-label': { fontWeight: 600, fontSize: '12px' }
                    }}>
                        {steps.map((label) => (
                            <Step key={label}><StepLabel>{label}</StepLabel></Step>
                        ))}
                    </Stepper>

                    {error && <Alert severity="error" sx={{ mb: 4, borderRadius: '12px', fontWeight: 600 }}>{error}</Alert>}

                    {renderStepContent(activeStep)}
                </Paper>
            </Container>
        </Box>
    );
};

export default CustomerAuth;
