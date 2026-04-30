import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { Stethoscope, Sparkles, Scissors, Ear, Baby, User } from 'lucide-react';

const treatments = [
    { title: 'Kaya Chikitsa', description: 'General Medicine & Holistic Healing', icon: Stethoscope },
    { title: 'Panchakarma', description: 'Complete Detoxification Therapies', icon: Sparkles },
    { title: 'Shalya Tantra', description: 'Ayurvedic Surgery & Kshar Sutra', icon: Scissors },
    { title: 'Shalakya Tantra', description: 'ENT & Ophthalmology Care', icon: Ear },
    { title: 'Kaumarbhritya', description: 'Pediatrics & Child Care', icon: Baby },
    { title: 'Stree Roga', description: 'Gynecology & Women’s Health', icon: User },
];

const TreatmentSection = () => {
    return (
        <Box sx={{ py: 10, bgcolor: '#f8f9fa' }} id="treatments">
            <Container maxWidth="lg">
                <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                    Specialized Ayurvedic Treatments
                </Typography>
                <Typography variant="body1" align="center" sx={{ mb: 6, color: 'text.secondary', maxWidth: 700, mx: 'auto' }}>
                    Experience the healing power of specialized therapies designed to treat chronic conditions and restore balance.
                </Typography>

                <Grid container spacing={4}>
                    {treatments.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card sx={{
                                height: '100%',
                                transition: '0.3s',
                                '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 },
                                borderRadius: 3,
                                textAlign: 'center',
                                border: '1px solid #eee'
                            }} elevation={0}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{
                                        display: 'inline-flex',
                                        p: 2,
                                        borderRadius: '50%',
                                        bgcolor: 'primary.light',
                                        color: 'white',
                                        mb: 2
                                    }}>
                                        <item.icon size={32} />
                                    </Box>
                                    <Typography variant="h5" gutterBottom fontWeight={600}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {item.description}
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

export default TreatmentSection;
