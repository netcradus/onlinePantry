import { Box, Container, Typography, Grid, Card, CardContent, Icon } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import SpaIcon from '@mui/icons-material/Spa';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import MedicationIcon from '@mui/icons-material/Medication';
import GrassIcon from '@mui/icons-material/Grass';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const services = [
    { title: 'Chronic Disease Management', icon: <HealthAndSafetyIcon fontSize="large" />, desc: 'Specialized Ayurvedic protocols for long-term health issues.' },
    { title: 'Panchakarma Therapies', icon: <SpaIcon fontSize="large" />, desc: 'Traditional detoxification and rejuvenation procedures.' },
    { title: 'Lifestyle Disorder Treatment', icon: <SelfImprovementIcon fontSize="large" />, desc: 'Managing stress, obesity, and hypertension naturally.' },
    { title: 'Women & Men\'s Health', icon: <MedicationIcon fontSize="large" />, desc: 'Hormonal balance and reproductive health treatments.' },
    { title: 'Skin & Hair Care', icon: <GrassIcon fontSize="large" />, desc: 'Herbal remedies for glowing skin and strong hair.' },
    { title: 'Immunity Boosting', icon: <FitnessCenterIcon fontSize="large" />, desc: 'Strengthening your natural defense system.' },
];

const Services = () => {
    return (
        <Box sx={{ py: 10, bgcolor: 'white' }}>
            <Container maxWidth="lg">
                <Typography variant="overline" color="primary" textAlign="center" display="block" sx={{ letterSpacing: 2, mb: 1 }}>
                    OUR EXPERTISE
                </Typography>
                <Typography variant="h3" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
                    Key Ayurvedic Services
                </Typography>
                <Grid container spacing={3}>
                    {services.map((service, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card sx={{
                                height: '100%',
                                transition: '0.3s',
                                '&:hover': { transform: 'translateY(-10px)', boxShadow: 6 },
                                border: '1px solid #f0f0f0',
                                borderRadius: 4
                            }}>
                                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                                    <Box sx={{ color: 'primary.main', mb: 2 }}>{service.icon}</Box>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        {service.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {service.desc}
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

export default Services;
