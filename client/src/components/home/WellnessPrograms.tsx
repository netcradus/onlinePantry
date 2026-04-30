import { Box, Container, Typography, Grid, Button, Stack } from '@mui/material';
import { ArrowRight, CheckCircle } from 'lucide-react';

const programs = [
    "Immunity Boosting",
    "Weight Management",
    "Stress Management",
    "Skin & Hair Care",
    "Women's Health",
    "Detox & Rejuvenation",
    "Pain Management",
    "Diabetes Care"
];

const WellnessPrograms = () => {
    return (
        <Box sx={{ py: 10, bgcolor: '#F3F6EF' }}>
            <Container maxWidth="lg">
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        {/* Placeholder for an image - using a colored box for now */}
                        <Box sx={{
                            width: '100%',
                            height: 400,
                            bgcolor: '#e0e0e0',
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundImage: 'url("https://images.unsplash.com/photo-1544367563-12123d8965cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80")', // Example Unsplash Image
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="overline" color="secondary" fontWeight={700} sx={{ letterSpacing: 2 }}>
                            HOLISTIC WELLNESS
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
                            Tailored Wellness Programs
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', color: 'text.secondary', mb: 4 }}>
                            Our wellness programs are designed to address the root cause of your health concerns, helping you achieve lasting balance and vitality.
                        </Typography>

                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            {programs.map((program, index) => (
                                <Grid item xs={6} key={index}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <CheckCircle size={20} color="#305724" />
                                        <Typography variant="body1" fontWeight={500}>{program}</Typography>
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>

                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            endIcon={<ArrowRight size={20} />}
                            sx={{ borderRadius: 2, px: 4, py: 1.5 }}
                        >
                            Explore Programs
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default WellnessPrograms;
