import { useState, useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, AppBar, Typography, IconButton, Avatar, Menu, MenuItem, Divider, Stack, Paper, Container } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, Package, Users, ShoppingBag, 
    Tags, ChefHat, 
    Menu as MenuIcon, LogOut, ShieldCheck 
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const drawerWidth = 260;

const AdminLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state: any) => state.auth);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/admin/login');
        }
    }, [user, navigate]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/admin/login');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
        { text: 'Users', icon: <Users size={20} />, path: '/admin/users' },
        { text: 'Orders', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
        { text: 'Products', icon: <Package size={20} />, path: '/admin/products' },
        { text: 'Categories', icon: <Tags size={20} />, path: '/admin/categories' },
        { text: 'Recipes', icon: <ChefHat size={20} />, path: '/admin/recipes' },
    ];

    const drawer = (
        <Box sx={{ height: '100%', bgcolor: '#064e3b', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 4 }}>
                <Box sx={{ p: 1, bgcolor: 'primary.main', borderRadius: 3, boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
                    <ShieldCheck size={28} color="white" fill="white" />
                </Box>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: -1.5, lineHeight: 1 }}>Pantry HQ</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Management</Typography>
                </Box>
            </Toolbar>
            
            <List sx={{ px: 2, py: 2, flexGrow: 1 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            onClick={() => {
                                navigate(item.path);
                                setMobileOpen(false);
                            }}
                            selected={location.pathname === item.path}
                            sx={{
                                borderRadius: 4,
                                py: 1.5,
                                transition: 'all 0.3s',
                                '&.Mui-selected': {
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    boxShadow: '0 10px 20px rgba(5, 150, 105, 0.3)',
                                    '&:hover': { bgcolor: 'primary.main' },
                                    '& .MuiListItemIcon-root': { color: 'white' }
                                },
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.08)',
                                    transform: 'translateX(4px)'
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'rgba(255,255,255,0.5)', minWidth: 44 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 800 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Box sx={{ p: 3, mt: 'auto' }}>
                <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }} elevation={0}>
                    <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 800, mb: 1, display: 'block' }}>LOGGED IN AS</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{user?.firstName} {user?.lastName}</Typography>
                </Paper>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    color: 'text.primary',
                    boxShadow: 'none',
                    borderBottom: '1px solid #f1f5f9',
                    zIndex: 1200
                }}
            >
                <Toolbar sx={{ height: 80, px: { xs: 2, md: 4 } }}>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' }, bgcolor: '#f1f5f9', borderRadius: 3 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, display: { xs: 'none', md: 'block' } }}>
                            {menuItems.find(m => location.pathname.startsWith(m.path))?.text || 'Dashboard'}
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton sx={{ bgcolor: '#f1f5f9', borderRadius: 3 }}>
                            <Package size={20} />
                        </IconButton>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 32, alignSelf: 'center' }} />
                        <IconButton onClick={handleMenuOpen} sx={{ p: 0.5, border: '2px solid #f1f5f9' }}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontWeight: 800 }}>{user?.firstName?.charAt(0)}</Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{ sx: { mt: 1.5, borderRadius: 4, minWidth: 200, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleLogout} sx={{ color: 'error.main', fontWeight: 800, py: 1.5 }}>
                                <ListItemIcon><LogOut size={18} color="#ef4444" /></ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Stack>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ 
                    flexGrow: 1, 
                    p: { xs: 2, md: 6 }, 
                    width: { sm: `calc(100% - ${drawerWidth}px)` }, 
                    mt: 10,
                    overflowX: 'hidden'
                }}
            >
                <Container maxWidth="xl" disableGutters>
                    <Outlet />
                </Container>
            </Box>
        </Box>
    );
};

export default AdminLayout;
