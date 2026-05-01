import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalTruckIcon from '@mui/icons-material/LocalShipping';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import FavoriteIcon from '@mui/icons-material/Favorite';

const features = [
    { title: 'Farm Fresh Quality', icon: <LocalFloristIcon fontSize="large" color="primary" />, desc: 'Directly sourced from local farms every morning for maximum nutrient retention.' },
    { title: 'Same-Day Delivery', icon: <LocalTruckIcon fontSize="large" color="primary" />, desc: 'Order by 1 PM and receive your fresh groceries at your doorstep the very same day.' },
    { title: 'Certified Organic', icon: <VerifiedIcon fontSize="large" color="primary" />, desc: 'Wide selection of 100% certified organic produce and pantry staples.' },
    { title: 'Eco-Friendly Packaging', icon: <FavoriteIcon fontSize="large" color="primary" />, desc: 'We use sustainable, plastic-free packaging to protect our planet.' },
];

const WhyChooseUs = () => {
    return (
        <Box sx={{ py: 10, bgcolor: '#fdfcf0' }}>
            <Container maxWidth="lg">
                <Typography variant="h3" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
                    Why Choose OnlinePantry
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
