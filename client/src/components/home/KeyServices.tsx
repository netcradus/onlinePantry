import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { Activity, Droplets, Sun, Users, Sparkles, Shield } from 'lucide-react';

const services = [
    { title: "Chronic Disease Management", icon: <Activity size={32} /> },
    { title: "Panchakarma Detox Therapies", icon: <Droplets size={32} /> },
    { title: "Lifestyle Disorder Treatment", icon: <Sun size={32} /> },
    { title: "Women & Men’s Health", icon: <Users size={32} /> },
    { title: "Skin & Hair Care", icon: <Sparkles size={32} /> },
    { title: "Immunity Boosting Programs", icon: <Shield size={32} /> }
];

const KeyServices = () => {
    return (
        <Box sx={{ py: 10, bgcolor: 'background.default' }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                        Our Key Services
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
                        Comprehensive Ayurvedic care tailored to your unique needs
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {services.map((service, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card sx={{
                                height: '100%',
                                textAlign: 'center',
                                transition: '0.3s',
                                '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }
                            }}>
                                <CardContent sx={{ py: 5 }}>
                                    <Box sx={{
                                        display: 'inline-flex',
                                        p: 2,
                                        borderRadius: '50%',
                                        bgcolor: 'primary.light',
                                        color: '#fff',
                                        mb: 3
                                    }}>
                                        {service.icon}
                                    </Box>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        {service.title}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default KeyServices;
