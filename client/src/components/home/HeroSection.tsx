import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle } from 'lucide-react';

const HeroSection = () => {
    const navigate = useNavigate();

    const features = [
        "100% Natural Ayurvedic Treatments",
        "Experienced Ayurvedic Doctors",
        "Personalized Healing Plans",
        "Trusted Panchakarma Therapies",
        "Personal Free Health Consultation"
    ];

    return (
        <Box sx={{
            bgcolor: '#E8F5E9',
            py: { xs: 8, md: 12 },
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Pattern/Image could go here */}
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={7}>
                        <Typography variant="h2" component="h1" sx={{
                            fontWeight: 800,
                            color: 'primary.main',
                            mb: 2,
                            fontSize: { xs: '2.5rem', md: '3.5rem' }
                        }}>
                            Welcome to <br />
                            <Box component="span" sx={{ color: 'secondary.main' }}>Rhichik Ayurveda</Box>
                        </Typography>
                        <Typography variant="h5" sx={{ mb: 4, color: 'text.secondary', fontWeight: 500 }}>
                            Authentic Ayurvedic Healing for Mind, Body & Soul
                        </Typography>

                        <Grid container spacing={2} sx={{ mb: 5 }}>
                            {features.map((feature, index) => (
                                <Grid item xs={12} sm={6} key={index}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <CheckCircle size={20} color="#305724" />
                                        <Typography variant="body1" fontWeight={500}>{feature}</Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>

                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            startIcon={<Calendar />}
                            onClick={() => document.getElementById('book-appointment')?.scrollIntoView({ behavior: 'smooth' })}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                borderRadius: '50px'
                            }}
                        >
                            Book Appointment
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        {/* Placeholder for Hero Image */}
                        <Box sx={{
                            height: 400,
                            width: '100%',
                            bgcolor: '#fff',
                            borderRadius: 4,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #e0e0e0'
                        }}>
                            <Typography color="text.secondary">[Hero Image]</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default HeroSection;
