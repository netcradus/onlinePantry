import { Box, Container, Typography, TextField, Paper, Alert, Stack } from '@mui/material';
import { ShoppingBag, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import axios from 'axios';
import { PantryButton } from '../../components/ui/PantryButton';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const baseUrl = import.meta.env.VITE_API_URL || '';
            const response = await axios.post(`${baseUrl}/api/v1/auth/login`, { email, password });
            const { user, accessToken } = response.data.data;

            if (user.role !== 'admin' && user.role !== 'vendor') {
                throw new Error('Unauthorized: Staff access only');
            }

            dispatch(setCredentials({ user, token: accessToken }));
            navigate(user.role === 'admin' ? '/admin/dashboard' : '/vendor/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'var(--pantry-cream)',
            p: 2,
            background: 'radial-gradient(circle at top right, var(--pantry-green-50), transparent), radial-gradient(circle at bottom left, var(--pantry-amber-50), transparent)'
        }}>
            <Container maxWidth="xs">
                <Paper elevation={0} sx={{
                    p: { xs: 4, md: 6 },
                    borderRadius: '24px',
                    textAlign: 'center',
                    border: '1.5px solid var(--pantry-gray-100)',
                    bgcolor: 'white',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.05)'
                }}>
                    <Box sx={{ mb: 5 }}>
                        <Box sx={{
                            display: 'inline-flex',
                            p: 2,
                            borderRadius: '16px',
                            bgcolor: 'var(--pantry-green-600)',
                            color: 'white',
                            mb: 3,
                            boxShadow: '0 8px 16px rgba(46, 125, 50, 0.2)'
                        }}>
                            <ShoppingBag size={32} />
                        </Box>
                        <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>Pantry Portal</Typography>
                        <Typography variant="body2" sx={{ color: 'var(--pantry-gray-400)', fontWeight: 500 }}>Admin & Vendor Control Panel</Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 4, borderRadius: '12px', fontWeight: 600 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={2.5}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                variant="outlined"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                variant="outlined"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Stack>
                        
                        <PantryButton
                            fullWidth
                            variant="primary"
                            size="large"
                            type="submit"
                            loading={loading}
                            sx={{ mt: 5, height: 54, borderRadius: '24px', fontSize: '16px', fontWeight: 700 }}
                        >
                            Access Dashboard
                        </PantryButton>

                        <Typography 
                            variant="caption" 
                            sx={{ 
                                display: 'block', 
                                mt: 4, 
                                color: 'var(--pantry-gray-400)', 
                                fontWeight: 500,
                                cursor: 'pointer',
                                '&:hover': { color: 'var(--pantry-green-600)' }
                            }}
                            onClick={() => navigate('/')}
                        >
                            &larr; Back to Storefront
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
