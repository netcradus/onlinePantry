import { AppBar, Toolbar, Typography, Container, Box, IconButton, Badge, Menu, MenuItem, Avatar, Drawer, List, ListItem, ListItemButton, ListItemText, Divider, InputBase, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import { logout } from '../../../store/slices/authSlice';
import { ShoppingBag, LogOut, User as UserIcon, LogIn, Menu as MenuIcon, Search, Bell, Heart } from 'lucide-react';
import { useState } from 'react';
import { useGetCartQuery } from '../../../store/api/cartApi';
import { PantryButton } from '../../ui/PantryButton';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    
    const { data: cartData } = useGetCartQuery(undefined, { 
        skip: !isAuthenticated || !user 
    });

    const cartItemCount = cartData?.data?.items?.length || 0;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAnnouncement, setShowAnnouncement] = useState(true);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        dispatch(logout());
        navigate('/login');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <>
            {/* 1. ANNOUNCEMENT BAR */}
            {showAnnouncement && (
                <Box sx={{ 
                    bgcolor: 'var(--pantry-amber-600)', 
                    color: 'var(--pantry-gray-800)', 
                    py: 1, 
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(90deg, #F9A825 0%, #FFCA28 50%, #F9A825 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 8s infinite linear',
                    '@keyframes shimmer': {
                        '0%': { backgroundPosition: '-200% center' },
                        '100%': { backgroundPosition: '200% center' }
                    }
                }}>
                    <Container maxWidth="xl">
                        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                            <Typography sx={{ fontWeight: 600, fontSize: '13px', textAlign: 'center' }}>
                                🚛 Free delivery on orders above $15 — Use code <Box component="span" sx={{ fontWeight: 800 }}>FRESH10</Box> for 10% off
                            </Typography>
                        </Stack>
                    </Container>
                </Box>
            )}

            <AppBar 
                position="sticky" 
                sx={{ 
                    bgcolor: 'white',
                    color: 'var(--pantry-gray-800)', 
                    borderBottom: '1px solid var(--pantry-gray-100)',
                    top: 0,
                    zIndex: 1100,
                }} 
                elevation={0}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ height: { xs: 70, md: 80 }, gap: { xs: 1, md: 4 } }}>
                        {/* Logo */}
                        <Box 
                            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                            onClick={() => navigate('/')}
                        >
                            <Typography
                                variant="h4"
                                noWrap
                                sx={{
                                    fontWeight: 800,
                                    color: 'var(--pantry-gray-800)',
                                    letterSpacing: -1,
                                    fontSize: { xs: '1.2rem', md: '1.5rem' }
                                }}
                            >
                                Online<Box component="span" sx={{ color: 'var(--pantry-green-600)' }}>Pantry</Box>
                            </Typography>
                        </Box>

                        {/* Search Bar (Desktop) */}
                        <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, maxWidth: 600 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: '4px 8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '100%',
                                    bgcolor: 'var(--pantry-gray-100)',
                                    borderRadius: '24px',
                                    border: '1.5px solid transparent',
                                    transition: '0.2s',
                                    '&:focus-within': {
                                        bgcolor: 'white',
                                        borderColor: 'var(--pantry-green-600)',
                                    }
                                }}
                            >
                                <Search size={18} color="var(--pantry-gray-400)" style={{ marginLeft: 8 }} />
                                <InputBase
                                    sx={{ ml: 1.5, flex: 1, fontSize: '14px', fontWeight: 500 }}
                                    placeholder="Search fresh mangoes, leafy greens..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </Paper>
                        </Box>

                        {/* Desktop Actions */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
                            <IconButton onClick={() => navigate('/wishlist')} sx={{ color: 'var(--pantry-gray-800)', display: { xs: 'none', md: 'flex' } }}>
                                <Heart size={22} />
                            </IconButton>
                            
                            <IconButton onClick={() => navigate('/cart')} sx={{ color: 'var(--pantry-gray-800)' }}>
                                <Badge badgeContent={cartItemCount} sx={{ '& .MuiBadge-badge': { bgcolor: 'var(--pantry-sale)', color: 'white', fontWeight: 800 } }}>
                                    <ShoppingBag size={22} />
                                </Badge>
                            </IconButton>

                            {isAuthenticated ? (
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1.5, 
                                        cursor: 'pointer',
                                        bgcolor: 'var(--pantry-gray-100)',
                                        px: 1.5,
                                        py: 0.75,
                                        borderRadius: '30px',
                                        transition: '0.2s',
                                        '&:hover': { bgcolor: 'var(--pantry-gray-200)' }
                                    }} 
                                    onClick={handleMenu}
                                >
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'var(--pantry-green-600)', fontWeight: 700, fontSize: '0.8rem' }}>
                                        {user?.firstName?.charAt(0)}
                                    </Avatar>
                                    <Typography sx={{ fontWeight: 700, fontSize: '14px', display: { xs: 'none', sm: 'block' } }}>
                                        {user?.firstName}
                                    </Typography>
                                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', ml: -0.5 }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                    </Box>
                                </Box>
                            ) : (
                                <PantryButton 
                                    variant="primary" 
                                    onClick={() => navigate('/login')} 
                                    sx={{ px: 3, borderRadius: '24px', height: 40 }}
                                >
                                    Sign In
                                </PantryButton>
                            )}
                            
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                PaperProps={{
                                    sx: { mt: 1.5, borderRadius: '12px', minWidth: 200, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }
                                }}
                            >
                                <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>My Profile</MenuItem>
                                <MenuItem onClick={() => { handleClose(); navigate('/orders'); }}>My Orders</MenuItem>
                                {user?.role === 'admin' && <MenuItem onClick={() => { handleClose(); navigate('/admin/dashboard'); }} sx={{ color: 'primary.main', fontWeight: 700 }}>Admin HQ</MenuItem>}
                                <Divider />
                                <MenuItem onClick={handleLogout} sx={{ color: 'error.main', fontWeight: 600 }}>
                                    <LogOut size={16} style={{ marginRight: 8 }} />
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
};

export default Header;
