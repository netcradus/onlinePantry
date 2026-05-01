import { Box, Container, Typography, Grid, Paper, Avatar, Rating } from '@mui/material';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: "James Wilson",
        location: "Greenwich, London",
        rating: 5,
        text: "The same-day delivery is a lifesaver! I ordered my groceries at 11 AM and they were at my door by 4 PM. The produce was incredibly fresh.",
        image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        id: 2,
        name: "Sarah Thompson",
        location: "Richmond, London",
        rating: 5,
        text: "Finally found a reliable place for organic vegetables. The quality of the leafy greens is better than any supermarket I've tried.",
        image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        id: 3,
        name: "David Chen",
        location: "Canary Wharf, London",
        rating: 4,
        text: "Great selection of dairy and bakery items. The sustainable packaging is a huge plus for me. Highly recommend OnlinePantry!",
        image: "https://randomuser.me/api/portraits/men/86.jpg"
    }
];

const Testimonials = () => {
    return (
        <Box sx={{ py: 10, bgcolor: '#f8f9fa' }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="overline" color="secondary" fontWeight={700} sx={{ letterSpacing: 2 }}>
                        TESTIMONIALS
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                        Customer Stories
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {testimonials.map((item) => (
                        <Grid item xs={12} md={4} key={item.id}>
                            <Paper sx={{
                                p: 4,
                                height: '100%',
                                borderRadius: 4,
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: '0.3s',
                                '&:hover': { transform: 'translateY(-5px)', boxShadow: 4 }
                            }} elevation={1}>
                                <Quote
                                    size={48}
                                    color="#F26F21"
                                    style={{ position: 'absolute', top: 24, right: 24, opacity: 0.2 }}
                                />

                                <Rating value={item.rating} getLabelText={() => `${item.rating} Stars`} readOnly sx={{ mb: 2 }} />

                                <Typography variant="body1" paragraph sx={{ flexGrow: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                                    "{item.text}"
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                                    <Avatar src={item.image} sx={{ width: 48, height: 48, mr: 2 }} />
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={700}>
                                            {item.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {item.location}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Testimonials;
