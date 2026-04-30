import { Box, Typography, Button, Container, Grid } from '@mui/material';

const HeroSection = () => {
    return (
        <Box sx={{
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #fdfcf0 0%, #edf2f4 100%)',
            py: { xs: 8, md: 15 },
        }}>
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Typography variant="overline" color="primary" sx={{ letterSpacing: 3, fontWeight: 'bold' }}>
                                AUTHENTIC AYURVEDA
                            </Typography>
                            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 800, mt: 2, color: '#1b4332' }}>
                                Healing Naturally, <br />
                                <span style={{ color: '#2e7d32' }}>Living Holistically</span>
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: '90%' }}>
                                Experience the wisdom of ancient Ayurveda tailored for modern lifestyle. Discover our holistic treatments and pure herbal medicines.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button variant="contained" size="large" sx={{ py: 1.5, px: 4 }}>
                                    Book Consultation
                                </Button>
                                <Button variant="outlined" size="large" sx={{ py: 1.5, px: 4 }}>
                                    Explore Products
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '120%',
                                height: '120%',
                                background: 'radial-gradient(circle, rgba(46,125,50,0.1) 0%, rgba(255,255,255,0) 70%)',
                                zIndex: 0
                            }
                        }}>
                            <Box
                                component="img"
                                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
                                alt="Ayurveda Healing"
                                sx={{
                                    width: '100%',
                                    maxWidth: 500,
                                    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                                    boxShadow: 10,
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default HeroSection;
