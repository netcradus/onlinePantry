import { Box, TextField, Button, Grid, MenuItem } from '@mui/material';
import { Calendar } from 'lucide-react';

const AppointmentForm = () => {
    return (
        <Box component="form" noValidate autoComplete="off">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Full Name"
                        variant="outlined"
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Phone Number"
                        variant="outlined"
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Email Address"
                        variant="outlined"
                        type="email"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Service Interested In"
                        select
                        variant="outlined"
                        defaultValue=""
                    >
                        <MenuItem value="Consultation">Doctor Consultation</MenuItem>
                        <MenuItem value="Panchakarma">Panchakarma</MenuItem>
                        <MenuItem value="Therapy">Therapy Session</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Preferred Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Message / Health Concern"
                        multiline
                        rows={4}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        fullWidth
                        startIcon={<Calendar />}
                        sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}
                    >
                        Book Appointment
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AppointmentForm;
