import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Grid, TextField, Avatar, List, ListItem, ListItemText, ListItemIcon, Divider, Stack, CircularProgress } from '@mui/material';
import { User, MapPin, LogOut, ChevronRight, Settings } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '../store/api/userApi';
import { logout } from '../store/slices/authSlice';
import { PantryButton } from '../components/ui/PantryButton';
import { PantryBadge } from '../components/ui/PantryBadge';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    
    const { data: profileData, isLoading: isProfileLoading } = useGetUserProfileQuery(undefined);
    const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        if (profileData?.data) {
            setFormData({
                firstName: profileData.data.firstName || '',
                lastName: profileData.data.lastName || '',
                phone: profileData.data.phone || '',
                email: profileData.data.email || ''
            });
        }
    }, [profileData]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleUpdate = async () => {
        try {
            await updateProfile(formData).unwrap();
        } catch (err) {
            console.error("Failed to update profile", err);
        }
    };

    if (isProfileLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}><CircularProgress color="primary" /></Box>;

    const user = profileData?.data;

    return (
        <Box sx={{ py: { xs: 4, md: 8 }, bgcolor: 'var(--pantry-cream)', minHeight: '100vh' }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Left Sidebar */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1.5px solid var(--pantry-gray-100)', bgcolor: 'white', textAlign: 'center' }}>
                            <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                                <Avatar 
                                    sx={{ 
                                        width: 100, 
                                        height: 100, 
                                        bgcolor: 'var(--pantry-green-600)', 
                                        fontSize: '2.5rem', 
                                        fontWeight: 800,
                                        boxShadow: '0 8px 24px rgba(46, 125, 50, 0.2)'
                                    }}
                                >
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </Avatar>
                                <Box sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'white', p: 0.5, borderRadius: '50%', border: '2px solid var(--pantry-gray-100)' }}>
                                    <Settings size={16} color="var(--pantry-gray-400)" />
                                </Box>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>{user?.firstName} {user?.lastName}</Typography>
                            <Typography variant="body2" sx={{ color: 'var(--pantry-gray-400)', mb: 4, fontWeight: 500 }}>
                                Member since {new Date(user?.createdAt).getFullYear()}
                            </Typography>
                            
                            <List component="nav" sx={{ textAlign: 'left', p: 0 }}>
                                {[
                                    { icon: <User size={18} />, label: 'Personal Details', idx: 0 },
                                    { icon: <MapPin size={18} />, label: 'Delivery Addresses', idx: 1 },
                                    { icon: <Settings size={18} />, label: 'Preferences', idx: 2 },
                                ].map((item) => (
                                    <ListItem 
                                        button 
                                        key={item.idx}
                                        selected={tabValue === item.idx}
                                        onClick={() => setTabValue(item.idx)}
                                        sx={{ 
                                            borderRadius: '12px', 
                                            mb: 1,
                                            py: 1.5,
                                            transition: '0.2s',
                                            '&.Mui-selected': { 
                                                bgcolor: 'var(--pantry-green-50)', 
                                                color: 'var(--pantry-green-600)',
                                                '&:hover': { bgcolor: 'var(--pantry-green-50)' }
                                            },
                                            '&:hover': { bgcolor: 'var(--pantry-gray-50)' }
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 700, fontSize: '14px' }} />
                                        <ChevronRight size={14} style={{ opacity: 0.5 }} />
                                    </ListItem>
                                ))}
                            </List>

                            <Divider sx={{ my: 3, borderColor: 'var(--pantry-gray-100)' }} />
                            <PantryButton 
                                variant="ghost" 
                                fullWidth 
                                startIcon={<LogOut size={18} />} 
                                onClick={handleLogout}
                                sx={{ color: 'var(--pantry-sale)', fontWeight: 700, '&:hover': { bgcolor: '#fff1f2' } }}
                            >
                                Sign Out
                            </PantryButton>
                        </Paper>
                    </Grid>

                    {/* Main Content */}
                    <Grid item xs={12} md={8}>
                        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', border: '1.5px solid var(--pantry-gray-100)', bgcolor: 'white', minHeight: 600 }}>
                            {tabValue === 0 && (
                                <Box>
                                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 4 }}>Personal Details</Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                fullWidth label="First Name" 
                                                variant="outlined"
                                                value={formData.firstName} 
                                                onChange={(e) => setFormData(p => ({ ...p, firstName: e.target.value }))}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField 
                                                fullWidth label="Last Name" 
                                                variant="outlined"
                                                value={formData.lastName} 
                                                onChange={(e) => setFormData(p => ({ ...p, lastName: e.target.value }))}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField 
                                                fullWidth label="Email Address" 
                                                value={formData.email} 
                                                disabled 
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'var(--pantry-gray-50)' } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField 
                                                fullWidth label="Phone Number" 
                                                value={formData.phone} 
                                                disabled 
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'var(--pantry-gray-50)' } }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <PantryButton 
                                        variant="primary" 
                                        sx={{ mt: 5, borderRadius: '24px', px: 6 }} 
                                        loading={isUpdating} 
                                        onClick={handleUpdate}
                                    >
                                        Update Profile
                                    </PantryButton>
                                </Box>
                            )}

                            {tabValue === 1 && (
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                        <Typography variant="h3" sx={{ fontWeight: 800 }}>My Addresses</Typography>
                                        <PantryButton variant="ghost" size="small" sx={{ color: 'var(--pantry-green-600)', fontWeight: 700 }}>+ Add New</PantryButton>
                                    </Box>
                                    <Stack spacing={3}>
                                        {user?.addresses?.map((addr: any, idx: number) => (
                                            <Paper key={idx} variant="outlined" sx={{ p: 3, borderRadius: '16px', position: 'relative', border: '1.5px solid var(--pantry-gray-100)' }}>
                                                {addr.isDefault && <PantryBadge label="Default" variant="success" sx={{ position: 'absolute', top: 16, right: 16 }} />}
                                                <Typography sx={{ fontWeight: 800, mb: 1, fontSize: '18px' }}>{addr.street}</Typography>
                                                <Typography variant="body2" sx={{ color: 'var(--pantry-gray-400)', fontWeight: 500 }}>{addr.city}, {addr.state} {addr.zip}</Typography>
                                                <Typography variant="body2" sx={{ color: 'var(--pantry-gray-400)', fontWeight: 500 }}>{addr.country}</Typography>
                                                <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
                                                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'var(--pantry-green-600)', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Edit</Typography>
                                                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'var(--pantry-sale)', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Delete</Typography>
                                                </Stack>
                                            </Paper>
                                        ))}
                                        {(!user?.addresses || user.addresses.length === 0) && (
                                            <Box sx={{ py: 6, textAlign: 'center', border: '2px dashed var(--pantry-gray-100)', borderRadius: '16px' }}>
                                                <Typography variant="body1" sx={{ color: 'var(--pantry-gray-400)', fontWeight: 500 }}>No addresses saved yet.</Typography>
                                            </Box>
                                        )}
                                    </Stack>
                                </Box>
                            )}

                            {tabValue === 2 && (
                                <Box sx={{ py: 10, textAlign: 'center' }}>
                                    <Settings size={64} color="var(--pantry-gray-100)" strokeWidth={1} />
                                    <Typography variant="h4" sx={{ fontWeight: 800, mt: 3, mb: 1 }}>Preferences</Typography>
                                    <Typography variant="body1" sx={{ color: 'var(--pantry-gray-400)', maxWidth: 300, mx: 'auto' }}>
                                        Notification and display settings will be available shortly.
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Profile;
