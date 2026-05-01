import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { Target, Eye, Heart, ShoppingBag, ShieldCheck, Leaf } from 'lucide-react';

const AboutSection = () => {
    return (
        <Box sx={{ py: 10, bgcolor: '#fff' }} id="about">
            <Container maxWidth="lg">
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="overline" color="secondary" fontWeight={700} sx={{ letterSpacing: 2 }}>
                            ABOUT ONLINEPANTRY
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
                            Freshness Delivered, <br/>Quality Guaranteed
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', color: 'text.secondary' }}>
                            OnlinePantry was founded in the heart of London with a simple mission: to bring the freshest, highest-quality groceries directly from local farms and trusted suppliers to your doorstep.
                        </Typography>

                        <Box sx={{ mt: 4 }}>
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Target color="#F26F21" />
                                    <Typography variant="h6" fontWeight={700}>Our Mission</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 4.5 }}>
                                    To provide a seamless, sustainable, and premium grocery shopping experience that saves time and promotes a healthier lifestyle.
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Eye color="#F26F21" />
                                    <Typography variant="h6" fontWeight={700}>Our Vision</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 4.5 }}>
                                    To be the UK's most trusted and sustainable online grocery platform, championing local producers and organic farming.
                                </Typography>
                            </Box>

                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Heart color="#F26F21" />
                                    <Typography variant="h6" fontWeight={700}>Our Values</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 4.5 }}>
                                    Quality First • Sustainability • Community Support • Unmatched Convenience
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
                                Our Commitments
                            </Typography>
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item xs={6}>
                                    <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                        <Leaf color="var(--pantry-green-600)" />
                                        <Typography fontWeight={600} fontSize="0.9rem">100% Organic Options</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                        <ShieldCheck color="var(--pantry-green-600)" />
                                        <Typography fontWeight={600} fontSize="0.9rem">Quality Tested</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                        <ShoppingBag color="var(--pantry-green-600)" />
                                        <Typography fontWeight={600} fontSize="0.9rem">Sustainable Packaging</Typography>
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
