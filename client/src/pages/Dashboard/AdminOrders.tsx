import { Box, Container, Typography, Paper, Grid, Chip, IconButton, Menu, MenuItem, Select, SelectChangeEvent, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControlLabel, Switch, Stack, Avatar } from '@mui/material';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../store/api/orderApi';
import { ShoppingBag, MoreVertical, Calendar, MessageSquare, Smartphone, CheckCircle2 } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { PantryButton } from '../../components/ui/PantryButton';

const AdminOrders = () => {
    const { data: orders, isLoading } = useGetAllOrdersQuery(undefined, { pollingInterval: 15000 });
    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [confirmationOrderId, setConfirmationOrderId] = useState<string | null>(null);

    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [dispatchDate, setDispatchDate] = useState("");
    const [sendWhatsapp, setSendWhatsapp] = useState(false);
    const [sendSms, setSendSms] = useState(false);

    useEffect(() => {
        if (confirmModalOpen && dispatchDate) {
            const formattedDate = new Date(dispatchDate).toLocaleDateString('en-GB');
            setConfirmMessage(prev => prev.replace(/📦 Estimated Delivery: .*/, `📦 Estimated Delivery: ${formattedDate}`));
        }
    }, [dispatchDate, confirmModalOpen]);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, orderId: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedOrderId(orderId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedOrderId(null);
    };

    const generateTemplate = (order: any) => {
        const productList = order.items.map((item: any) => `• ${item.name} x${item.quantity}`).join("\n");
        const defaultDispatch = new Date();
        defaultDispatch.setDate(defaultDispatch.getDate() + 1); 
        const dispatchStr = defaultDispatch.toLocaleDateString('en-GB');

        return `🛒 *Online Pantry Confirmation*\n\nHi ${order.user?.firstName},\n\nYour order *#${order._id.slice(-6).toUpperCase()}* is confirmed! ✅\n\nItems:\n${productList}\n\nTotal: ₹${order.totalAmount.toFixed(2)}\n\n📦 Estimated Delivery: ${dispatchStr}\n\nWe'll notify you when it's out for delivery. Thanks for shopping with us! 🌿`;
    };

    const handleConfirmClick = (orderId?: string) => {
        const id = orderId || selectedOrderId;
        const order = orders?.data?.orders.find((o: any) => o._id === id);

        if (orderId) setSelectedOrderId(orderId);

        if (order) {
            setConfirmationOrderId(id);
            setConfirmMessage(generateTemplate(order));
            const d = new Date();
            d.setDate(d.getDate() + 1);
            setDispatchDate(d.toISOString().split('T')[0]);
            setConfirmModalOpen(true);
        }
        handleMenuClose();
    };

    const handleConfirmSubmit = async () => {
        if (!confirmationOrderId) return;

        try {
            await updateOrderStatus({
                orderId: confirmationOrderId,
                status: 'confirmed',
                confirmationDetails: {
                    messageTemplate: confirmMessage,
                    dispatchDate,
                    sendWhatsapp,
                    sendSms
                }
            }).unwrap();
            setConfirmModalOpen(false);
        } catch (error) {
            console.error("Failed to confirm order", error);
        }
    };

    const handleStatusUpdate = async (status: string) => {
        if (selectedOrderId) {
            try {
                await updateOrderStatus({ orderId: selectedOrderId, status }).unwrap();
            } catch (error) {
                console.error("Failed to update status", error);
            }
        }
        handleMenuClose();
    };

    const filteredOrders = useMemo(() => {
        if (!orders?.data?.orders) return [];

        let result = filterStatus === 'all'
            ? [...orders.data.orders]
            : orders.data.orders.filter((order: any) => order.orderStatus === filterStatus);

        return result.sort((a: any, b: any) => {
            switch (sortBy) {
                case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'price_high': return b.totalAmount - a.totalAmount;
                case 'price_low': return a.totalAmount - b.totalAmount;
                default: return 0;
            }
        });
    }, [orders, filterStatus, sortBy]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'success';
            case 'dispatched': return 'info';
            case 'cancelled': return 'error';
            case 'confirmed': return 'primary';
            default: return 'warning';
        }
    };

    return (
        <Box sx={{ py: 6, bgcolor: 'var(--pantry-cream)', minHeight: '100vh' }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h1" sx={{ fontWeight: 800, mb: 1 }}>Order Pipeline</Typography>
                        <Typography variant="body1" sx={{ color: 'var(--pantry-gray-400)' }}>Manage fulfillment and delivery schedules</Typography>
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <Select
                            size="small"
                            value={sortBy}
                            onChange={(e: SelectChangeEvent) => setSortBy(e.target.value)}
                            sx={{ minWidth: 160, bgcolor: 'white', borderRadius: '12px' }}
                        >
                            <MenuItem value="newest">Newest First</MenuItem>
                            <MenuItem value="oldest">Oldest First</MenuItem>
                            <MenuItem value="price_high">Value: High to Low</MenuItem>
                            <MenuItem value="price_low">Value: Low to High</MenuItem>
                        </Select>
                        <Select
                            size="small"
                            value={filterStatus}
                            onChange={(e: SelectChangeEvent) => setFilterStatus(e.target.value)}
                            sx={{ minWidth: 160, bgcolor: 'white', borderRadius: '12px' }}
                        >
                            <MenuItem value="all">All Orders</MenuItem>
                            <MenuItem value="awaiting_confirmation">New (Unconfirmed)</MenuItem>
                            <MenuItem value="confirmed">Confirmed</MenuItem>
                            <MenuItem value="dispatched">Dispatched</MenuItem>
                            <MenuItem value="delivered">Delivered</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                    </Stack>
                </Box>

                {!filteredOrders.length ? (
                    <Paper sx={{ py: 12, textAlign: 'center', borderRadius: '32px', border: '1.5px solid var(--pantry-gray-100)', bgcolor: 'white' }}>
                        <ShoppingBag size={80} color="var(--pantry-gray-100)" strokeWidth={1} style={{ marginBottom: 24 }} />
                        <Typography variant="h4" sx={{ color: 'var(--pantry-gray-400)', fontWeight: 700 }}>No orders match your filter</Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {filteredOrders.map((order: any) => (
                            <Grid item xs={12} key={order._id}>
                                <Paper sx={{ p: 4, borderRadius: '24px', border: '1.5px solid var(--pantry-gray-100)', bgcolor: 'white', position: 'relative', overflow: 'hidden' }}>
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: 4 }}>
                                        <Box>
                                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'var(--pantry-green-600)', textTransform: 'uppercase', letterSpacing: 1.5, display: 'block', mb: 0.5 }}>
                                                Order #{order._id.slice(-6).toUpperCase()}
                                            </Typography>
                                            <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>₹{order.totalAmount.toFixed(2)}</Typography>
                                            <Typography variant="body2" sx={{ color: 'var(--pantry-gray-400)', fontWeight: 500 }}>
                                                {new Date(order.createdAt).toLocaleString()} • {order.items.length} Product{order.items.length > 1 ? 's' : ''}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                                            <Chip
                                                label={order.orderStatus.replace(/_/g, ' ')}
                                                color={getStatusColor(order.orderStatus) as any}
                                                size="small"
                                                sx={{ mb: 2, fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', height: 24 }}
                                            />
                                            <Stack direction="row" spacing={1.5} alignItems="center" justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'var(--pantry-green-50)', color: 'var(--pantry-green-600)', fontSize: '12px', fontWeight: 800 }}>
                                                    {order.user?.firstName?.[0]}{order.user?.lastName?.[0]}
                                                </Avatar>
                                                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                                    {order.user?.firstName} {order.user?.lastName}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Box>

                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                        {order.items.map((item: any, idx: number) => (
                                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 1.5, bgcolor: 'var(--pantry-gray-50)', borderRadius: '12px', border: '1px solid var(--pantry-gray-100)' }}>
                                                    <Box sx={{ width: 40, height: 40, bgcolor: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0.5 }}>
                                                        <img src={item.image} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                                    </Box>
                                                    <Box sx={{ overflow: 'hidden' }}>
                                                        <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>{item.name}</Typography>
                                                        <Typography variant="caption" sx={{ color: 'var(--pantry-gray-400)', fontWeight: 600 }}>
                                                            {item.quantity} x ₹{item.price.toFixed(2)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                                        <IconButton onClick={(e) => handleMenuOpen(e, order._id)} sx={{ bgcolor: 'var(--pantry-gray-50)', color: 'var(--pantry-gray-400)' }}>
                                            <MoreVertical size={20} />
                                        </IconButton>
                                        <PantryButton 
                                            variant="primary" 
                                            size="small" 
                                            onClick={() => handleConfirmClick(order._id)}
                                            disabled={order.orderStatus !== 'awaiting_confirmation'}
                                            sx={{ px: 4, borderRadius: '24px', height: 40, fontWeight: 800 }}
                                        >
                                            Confirm Order
                                        </PantryButton>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Menu 
                    anchorEl={anchorEl} 
                    open={Boolean(anchorEl)} 
                    onClose={handleMenuClose}
                    PaperProps={{ sx: { borderRadius: '12px', mt: 1, border: '1px solid var(--pantry-gray-100)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' } }}
                >
                    <MenuItem onClick={() => handleStatusUpdate('processing')} sx={{ fontSize: '14px', fontWeight: 600, py: 1.5 }}>Mark Processing</MenuItem>
                    <MenuItem onClick={() => handleStatusUpdate('dispatched')} sx={{ fontSize: '14px', fontWeight: 600, py: 1.5 }}>Mark Dispatched</MenuItem>
                    <MenuItem onClick={() => handleStatusUpdate('delivered')} sx={{ fontSize: '14px', fontWeight: 600, py: 1.5 }}>Mark Delivered</MenuItem>
                    <Divider sx={{ my: 1 }} />
                    <MenuItem onClick={() => handleStatusUpdate('cancelled')} sx={{ fontSize: '14px', fontWeight: 600, py: 1.5, color: 'var(--pantry-sale)' }}>Cancel Order</MenuItem>
                </Menu>

                <Dialog open={confirmModalOpen} onClose={() => setConfirmModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}>
                    <DialogTitle sx={{ fontWeight: 800, fontSize: '24px', pt: 3 }}>Confirm & Notify Customer</DialogTitle>
                    <DialogContent>
                        <Stack spacing={4} sx={{ mt: 3 }}>
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Calendar size={18} color="var(--pantry-green-600)" /> Delivery Schedule
                                </Typography>
                                <TextField
                                    type="date"
                                    value={dispatchDate}
                                    onChange={(e) => setDispatchDate(e.target.value)}
                                    fullWidth
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <MessageSquare size={18} color="var(--pantry-green-600)" /> Notification Preview
                                </Typography>
                                <TextField
                                    multiline
                                    rows={5}
                                    value={confirmMessage}
                                    onChange={(e) => setConfirmMessage(e.target.value)}
                                    fullWidth
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'var(--pantry-gray-50)', fontSize: '13px' } }}
                                />
                            </Box>
                            <Box sx={{ p: 2, bgcolor: 'var(--pantry-gray-50)', borderRadius: '16px' }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'var(--pantry-gray-400)', textTransform: 'uppercase', mb: 1, display: 'block' }}>Communication Channels</Typography>
                                <Stack direction="row" spacing={4}>
                                    <FormControlLabel
                                        control={<Switch checked={sendWhatsapp} color="primary" onChange={(e) => setSendWhatsapp(e.target.checked)} />}
                                        label={<Typography variant="body2" sx={{ fontWeight: 600 }}>WhatsApp</Typography>}
                                    />
                                    <FormControlLabel
                                        control={<Switch checked={sendSms} color="primary" onChange={(e) => setSendSms(e.target.checked)} />}
                                        label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Direct SMS</Typography>}
                                    />
                                </Stack>
                            </Box>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 4, pt: 1 }}>
                        <PantryButton variant="ghost" onClick={() => setConfirmModalOpen(false)} sx={{ fontWeight: 700 }}>Cancel</PantryButton>
                        <PantryButton variant="primary" onClick={handleConfirmSubmit} sx={{ px: 4, borderRadius: '24px' }} startIcon={<CheckCircle2 size={18} />}>
                            Confirm & Notify
                        </PantryButton>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

const Divider = ({ sx }: { sx?: any }) => <Box sx={{ height: '1.5px', bgcolor: 'var(--pantry-gray-100)', ...sx }} />;

export default AdminOrders;
