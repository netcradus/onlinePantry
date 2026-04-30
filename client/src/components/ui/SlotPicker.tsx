import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';

interface Slot {
    id: string;
    startTime: string;
    endTime: string;
    price: number;
    isAvailable: boolean;
    booked: number;
    capacity: number;
}

interface SlotPickerProps {
    slots: Slot[];
    selectedSlotId?: string;
    onSlotSelect: (slotId: string) => void;
}

const SlotCard = styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'selected' && prop !== 'disabled',
})<{ selected?: boolean; disabled?: boolean }>(({ theme, selected, disabled }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
    backgroundColor: selected ? theme.palette.primary.light + '10' : theme.palette.background.paper,
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s',
    '&:hover': {
        borderColor: disabled ? theme.palette.divider : theme.palette.primary.main,
        backgroundColor: disabled ? theme.palette.background.paper : theme.palette.primary.light + '05',
    },
}));

export const SlotPicker: React.FC<SlotPickerProps> = ({ slots, selectedSlotId, onSlotSelect }) => {
    const [tabValue, setTabValue] = useState(0);

    // Group slots by time of day (Mock logic)
    const morningSlots = slots.filter(s => parseInt(s.startTime) < 12);
    const afternoonSlots = slots.filter(s => parseInt(s.startTime) >= 12 && parseInt(s.startTime) < 17);
    const eveningSlots = slots.filter(s => parseInt(s.startTime) >= 17);

    const renderSlots = (filteredSlots: Slot[]) => (
        <Grid container spacing={2}>
            {filteredSlots.map((slot) => (
                <Grid item xs={12} sm={6} md={4} key={slot.id}>
                    <SlotCard
                        selected={selectedSlotId === slot.id}
                        disabled={!slot.isAvailable}
                        onClick={() => slot.isAvailable && onSlotSelect(slot.id)}
                    >
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {slot.startTime} - {slot.endTime}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {slot.price === 0 ? 'FREE' : `₹${slot.price.toFixed(2)}`}
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Box 
                                sx={{ 
                                    width: 8, 
                                    height: 8, 
                                    borderRadius: '50%', 
                                    mr: 1,
                                    backgroundColor: slot.booked / slot.capacity > 0.8 ? 'error.main' : 
                                                    slot.booked / slot.capacity > 0.5 ? 'warning.main' : 'success.main'
                                }} 
                            />
                            <Typography variant="caption">
                                {slot.isAvailable ? 'Available' : 'Full'}
                            </Typography>
                        </Box>
                    </SlotCard>
                </Grid>
            ))}
            {filteredSlots.length === 0 && (
                <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                        No slots available for this period.
                    </Typography>
                </Grid>
            )}
        </Grid>
    );

    return (
        <Box>
            <Tabs 
                value={tabValue} 
                onChange={(_, val) => setTabValue(val)} 
                variant="fullWidth"
                sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab label="Morning" />
                <Tab label="Afternoon" />
                <Tab label="Evening" />
            </Tabs>
            
            {tabValue === 0 && renderSlots(morningSlots)}
            {tabValue === 1 && renderSlots(afternoonSlots)}
            {tabValue === 2 && renderSlots(eveningSlots)}
        </Box>
    );
};
