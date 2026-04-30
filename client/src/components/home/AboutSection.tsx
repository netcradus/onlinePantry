import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { Target, Eye, Heart } from 'lucide-react';

const AboutSection = () => {
    return (
        <Box sx={{ py: 10, bgcolor: '#fff' }} id="about">
            <Container maxWidth="lg">
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="overline" color="secondary" fontWeight={700} sx={{ letterSpacing: 2 }}>
                            ABOUT US
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
                            Restoring Health Through Nature
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', color: 'text.secondary' }}>
                            Rhichik Ayurveda was established with the mission of providing natural, root-cause-based healing using time-tested Ayurvedic principles.
                        </Typography>

                        <Box sx={{ mt: 4 }}>
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Target color="#F26F21" />
                                    <Typography variant="h6" fontWeight={700}>Our Mission</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 4.5 }}>
                                    To deliver authentic Ayurvedic care, educate people about preventive healthcare, and promote natural healing without chemicals.
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Eye color="#F26F21" />
                                    <Typography variant="h6" fontWeight={700}>Our Vision</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 4.5 }}>
                                    To become a leading Ayurvedic healthcare provider promoting disease-free and balanced living.
                                </Typography>
                            </Box>

                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Heart color="#F26F21" />
                                    <Typography variant="h6" fontWeight={700}>Our Values</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 4.5 }}>
                                    Authenticity • Compassion • Integrity • Patient-Centered Care
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={0} sx={{
                            p: 4,
                            bgcolor: '#F3F6EF',
                            borderRadius: 4,
                            border: '1px solid #e0e0e0',
                            textAlign: 'center'
                        }}>
                            <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'darkgreen' }}>
                                Certifications
                            </Typography>
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item xs={6}>
                                    <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2 }}>
                                        <Typography fontWeight={600}>AYUSH Registered</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2 }}>
                                        <Typography fontWeight={600}>GMP Certified</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2 }}>
                                        <Typography fontWeight={600}>ISO Certified</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AboutSection;
