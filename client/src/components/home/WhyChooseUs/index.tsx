import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonIcon from '@mui/icons-material/Person';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import FavoriteIcon from '@mui/icons-material/Favorite';

const features = [
    { title: 'Authentic Classical Ayurveda', icon: <VerifiedIcon fontSize="large" color="primary" />, desc: 'Strictly following ancient texts and traditional methods.' },
    { title: 'Customized Treatment Plans', icon: <PersonIcon fontSize="large" color="primary" />, desc: 'Personalized therapies based on your unique body constitution (Prakriti).' },
    { title: 'Herbal Medicines', icon: <LocalFloristIcon fontSize="large" color="primary" />, desc: '100% natural, pure, and efficacious Ayurvedic preparations.' },
    { title: 'Holistic Approach', icon: <FavoriteIcon fontSize="large" color="primary" />, desc: 'Focusing on physical, mental, and spiritual well-being.' },
];

const WhyChooseUs = () => {
    return (
        <Box sx={{ py: 10, bgcolor: '#fdfcf0' }}>
            <Container maxWidth="lg">
                <Typography variant="h3" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
                    Why Choose Rhichik Ayurveda
                </Typography>
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper elevation={0} sx={{
                                p: 3,
                                textAlign: 'center',
                                bgcolor: 'transparent',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {feature.desc}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default WhyChooseUs;
