import { Box, Container, Grid, Typography, Paper, Stack } from '@mui/material';
import AppointmentForm from './AppointmentForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactSection = () => {
    return (
        <Box sx={{ py: 10, bgcolor: 'primary.main', color: 'white' }} id="contact">
            <Container maxWidth="lg">
                <Grid container spacing={8}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="overline" color="secondary" fontWeight={700} sx={{ letterSpacing: 2 }}>
                            CONTACT US
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
                            Get in Touch
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 6, opacity: 0.9 }}>
                            Ready to start your journey to holistic health? Visit us, call us, or book an appointment online.
                        </Typography>

                        <Stack spacing={4}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, height: 'fit-content' }}>
                                    <MapPin color="#F26F21" size={24} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight={600}>Visit Us</Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Rhichik Ayurveda Clinic,<br />
                                        123, Wellness Road, Near Nature Park,<br />
                                        Mumbai, Maharashtra 400001
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, height: 'fit-content' }}>
                                    <Phone color="#F26F21" size={24} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight={600}>Call Us</Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        +91 98765 43210 <br />
                                        +91 12345 67890
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, height: 'fit-content' }}>
                                    <Mail color="#F26F21" size={24} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight={600}>Email Us</Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        info@rhichikayurveda.com <br />
                                        appointments@rhichikayurveda.com
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, height: 'fit-content' }}>
                                    <Clock color="#F26F21" size={24} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight={600}>Opening Hours</Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Mon - Sat: 9:00 AM - 8:00 PM <br />
                                        Sun: 10:00 AM - 2:00 PM
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={0} sx={{
                            p: 4,
                            borderRadius: 4,
                            bgcolor: '#fff',
                            color: 'text.primary'
                        }}>
                            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                                Book an Appointment
                            </Typography>
                            <AppointmentForm />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ContactSection;
