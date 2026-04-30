import { useState } from 'react';
import { Badge, IconButton, Menu, MenuItem, Typography, Box, Divider } from '@mui/material';
import { Bell, CheckCircle } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
    const { notifications, unreadCount, markAllAsRead } = useSocket();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        if (unreadCount > 0) {
            markAllAsRead();
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = (orderId: string) => {
        if (location.pathname.includes('/admin')) {
            navigate(`/admin/orders`); // Admin view
        } else {
            navigate(`/orders`); // User view
        }
        handleClose();
    };

    return (
        <>
            <IconButton color="default" onClick={handleClick}>
                <Badge badgeContent={unreadCount} color="error">
                    <Bell size={24} color="#305724" />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: { width: 320, maxHeight: 400 }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" fontSize={16} fontWeight={700}>Notifications</Typography>
                </Box>
                <Divider />

                {notifications.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="text.secondary" variant="body2">No notifications</Typography>
                    </Box>
                ) : (
                    notifications.map((notif, index) => (
                        <MenuItem
                            key={index}
                            onClick={() => handleNotificationClick(notif.orderId)}
                            sx={{
                                py: 2,
                                whiteSpace: 'normal',
                                alignItems: 'flex-start',
                                borderBottom: '1px solid #f1f5f9'
                            }}
                        >
                            <Box sx={{ mr: 2, mt: 0.5, color: 'success.main' }}>
                                <CheckCircle size={18} />
                            </Box>
                            <Box>
                                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                                    {notif.status.replace(/_/g, ' ').toUpperCase()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    {notif.message}
                                </Typography>
                            </Box>
                        </MenuItem>
                    ))
                )}
            </Menu>
        </>
    );
};

export default NotificationBell;
