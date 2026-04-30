import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, CircularProgress, IconButton, Stack } from '@mui/material';
import { useGetSlotsQuery, useCreateSlotMutation, useUpdateSlotMutation } from '../../store/api/slotsApi';
import { PantryButton } from '../../components/ui/PantryButton';
import { PantryBadge } from '../../components/ui/PantryBadge';
import { Plus, Edit2, Calendar, Clock, Users } from 'lucide-react';

const AdminSlots = () => {
    const { data: slotsData, isLoading } = useGetSlotsQuery({});
    const [createSlot] = useCreateSlotMutation();
    const [updateSlot] = useUpdateSlotMutation();

    const [open, setOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        endTime: '',
        capacity: 20,
        type: 'standard'
    });

    const handleOpen = (slot: any = null) => {
        if (slot) {
            setSelectedSlot(slot);
            setFormData({
                date: new Date(slot.date).toISOString().split('T')[0],
                startTime: slot.startTime,
                endTime: slot.endTime,
                capacity: slot.capacity,
                type: slot.type
            });
        } else {
            setSelectedSlot(null);
            setFormData({ date: '', startTime: '', endTime: '', capacity: 20, type: 'standard' });
        }
        setOpen(true);
    };

    const handleSubmit = async () => {
        try {
            if (selectedSlot) {
                await updateSlot({ id: selectedSlot._id, ...formData }).unwrap();
            } else {
                await createSlot(formData).unwrap();
            }
            setOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}><CircularProgress color="primary" /></Box>;

    const slots = slotsData?.data || [];

    return (
        <Box sx={{ py: 6, bgcolor: 'var(--pantry-cream)', minHeight: '100vh' }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h1" sx={{ fontWeight: 800, mb: 1 }}>Delivery Logistics</Typography>
                        <Typography variant="body1" sx={{ color: 'var(--pantry-gray-400)' }}>Manage order fulfillment windows and capacity</Typography>
                    </Box>
                    <PantryButton variant="primary" startIcon={<Plus size={20} />} onClick={() => handleOpen()} sx={{ borderRadius: '24px', px: 4 }}>
                        Create New Slot
                    </PantryButton>
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '24px', border: '1.5px solid var(--pantry-gray-100)', overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 900 }}>
                        <TableHead sx={{ bgcolor: 'var(--pantry-gray-50)' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Schedule</TableCell>
                                <TableCell sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Time Window</TableCell>
                                <TableCell sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Utilization</TableCell>
                                <TableCell sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {slots.map((slot: any) => (
                                <TableRow key={slot._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'var(--pantry-green-50)', color: 'var(--pantry-green-600)' }}>
                                                <Calendar size={18} />
                                            </Box>
                                            <Typography sx={{ fontWeight: 700 }}>
                                                {new Date(slot.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Clock size={16} color="var(--pantry-gray-100)" />
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{slot.startTime} - {slot.endTime}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Stack spacing={0.5}>
                                            <Typography variant="body2" sx={{ fontWeight: 800 }}>{slot.bookedCount} / {slot.capacity}</Typography>
                                            <Box sx={{ width: '100%', height: 4, bgcolor: 'var(--pantry-gray-50)', borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
                                                <Box sx={{ 
                                                    width: `${(slot.bookedCount / slot.capacity) * 100}%`, 
                                                    height: '100%', 
                                                    bgcolor: (slot.bookedCount / slot.capacity) > 0.8 ? 'var(--pantry-sale)' : 'var(--pantry-green-600)',
                                                    transition: '0.3s'
                                                }} />
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Chip 
                                            label={slot.type} 
                                            size="small" 
                                            sx={{ 
                                                textTransform: 'uppercase', 
                                                fontWeight: 800, 
                                                fontSize: '10px', 
                                                bgcolor: slot.type === 'priority' ? 'var(--pantry-amber-50)' : 'var(--pantry-gray-50)',
                                                color: slot.type === 'priority' ? 'var(--pantry-amber-600)' : 'var(--pantry-gray-400)'
                                            }} 
                                        />
                                    </TableCell>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <PantryBadge 
                                            label={slot.isAvailable ? 'Available' : 'Full'} 
                                            variant={slot.isAvailable ? 'success' : 'error'} 
                                        />
                                    </TableCell>
                                    <TableCell align="right" sx={{ py: 2.5 }}>
                                        <IconButton size="small" onClick={() => handleOpen(slot)} sx={{ color: 'var(--pantry-green-600)' }}><Edit2 size={18} /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}>
                <DialogTitle sx={{ fontWeight: 800, fontSize: '24px', pt: 3 }}>{selectedSlot ? 'Update Logistics' : 'New Fulfillment Slot'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 3 }}>
                        <TextField 
                            fullWidth label="Delivery Date" type="date" InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            value={formData.date} onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                        <Stack direction="row" spacing={2}>
                            <TextField 
                                fullWidth label="Start Time" placeholder="08:00"
                                value={formData.startTime} onChange={(e) => setFormData(p => ({ ...p, startTime: e.target.value }))}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                            <TextField 
                                fullWidth label="End Time" placeholder="10:00"
                                value={formData.endTime} onChange={(e) => setFormData(p => ({ ...p, endTime: e.target.value }))}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Stack>
                        <TextField 
                            fullWidth label="Fleet Capacity (Orders)" type="number"
                            value={formData.capacity} onChange={(e) => setFormData(p => ({ ...p, capacity: parseInt(e.target.value) }))}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                        <TextField 
                            fullWidth select label="Service Level"
                            value={formData.type} onChange={(e) => setFormData(p => ({ ...p, type: e.target.value }))}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        >
                            <MenuItem value="standard">Standard Fulfillment</MenuItem>
                            <MenuItem value="priority">Express / Priority</MenuItem>
                            <MenuItem value="saver">Eco-Saver Window</MenuItem>
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 4, pt: 1 }}>
                    <PantryButton variant="ghost" onClick={() => setOpen(false)} sx={{ fontWeight: 700 }}>Cancel</PantryButton>
                    <PantryButton variant="primary" onClick={handleSubmit} sx={{ px: 4, borderRadius: '24px' }}>Save Logistics</PantryButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminSlots;
