import { Box, Container, Typography, Grid, Paper, Avatar, Rating } from '@mui/material';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: "Rajesh Kumar",
        location: "Mumbai",
        rating: 5,
        text: "The Panchakarma treatment at Rhichik Ayurveda was a life-changing experience. My chronic back pain has significantly reduced.",
        image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        id: 2,
        name: "Sita Sharma",
        location: "Pune",
        rating: 5,
        text: "Dr. Rhichik is very knowledgeable and patient. The medicines prescribed were effective and had no side effects.",
        image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        id: 3,
        name: "Amit Patel",
        location: "Ahmedabad",
        rating: 4,
        text: "Great ambiance and authentic treatments. Highly recommend their immunity boosting program.",
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
                        Stories of Healing
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
