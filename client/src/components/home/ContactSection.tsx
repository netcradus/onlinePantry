import { Box, Container, Grid, Typography, Paper, Stack } from '@mui/material';
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
                            Have a question about your order or our products? Our team is here to help you experience the best of OnlinePantry.
                        </Typography>

                        <Stack spacing={4}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, height: 'fit-content' }}>
                                    <MapPin color="#F26F21" size={24} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight={600}>Visit Our Warehouse</Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        OnlinePantry Logistics Hub,<br />
                                        Unit 42, Thames Industrial Estate,<br />
                                        London, SE18 6RS, United Kingdom
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, height: 'fit-content' }}>
                                    <Phone color="#F26F21" size={24} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight={600}>Customer Support</Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        +44 20 7946 0123 <br />
                                        Available 8 AM - 8 PM
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
                                        hello@onlinepantry.co.uk <br />
                                        support@onlinepantry.co.uk
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, height: 'fit-content' }}>
                                    <Clock color="#F26F21" size={24} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight={600}>Delivery Windows</Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Mon - Sat: 7:00 AM - 10:00 PM <br />
                                        Sun: 8:00 AM - 6:00 PM
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
                                Send us a Message
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                                Fill out the form below and we'll get back to you within 2 hours during business hours.
                            </Typography>
                            {/* Simple message form placeholder since AppointmentForm is removed */}
                            <Stack spacing={2}>
                                <Box sx={{ p: 4, bgcolor: 'var(--pantry-gray-50)', borderRadius: '12px', textAlign: 'center' }}>
                                    <Typography variant="body1" fontWeight={600}>Contact Form Under Maintenance</Typography>
                                    <Typography variant="caption" color="text.secondary">Please use our email or phone for now.</Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ContactSection;
