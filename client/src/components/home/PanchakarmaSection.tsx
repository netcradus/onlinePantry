import { Box, Container, Typography, Grid, Paper, Avatar } from '@mui/material';
import { Droplets, Wind, Activity, Waves, Flower } from 'lucide-react'; // Using approximate icons

const procedures = [
    { title: 'Vamana', subtitle: 'Therapeutic Emesis', description: 'Eliminates Kapha toxins from the body.', icon: Droplets },
    { title: 'Virechana', subtitle: 'Therapeutic Purgation', description: 'Removes Pitta toxins from the liver and gallbladder.', icon: Wind },
    { title: 'Basti', subtitle: 'Medicated Enema', description: 'The mother of all treatments, balances Vata dosha.', icon: Waves }, // Waves representing fluid/flow
    { title: 'Nasya', subtitle: 'Nasal Administration', description: 'Cleanses the head and neck region.', icon: Flower },
    { title: 'Raktamokshana', subtitle: 'Bloodletting', description: 'Purifies the blood to treat skin disorders.', icon: Droplets } // Reusing droplets for blood
];

const PanchakarmaSection = () => {
    return (
        <Box sx={{ py: 10, bgcolor: 'primary.main', color: 'white' }} id="panchakarma">
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.8 }}>
                        DETOXIFICATION & REJUVENATION
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                        The Science of Panchakarma
                    </Typography>
                    <Typography variant="body1" sx={{ maxWidth: 700, mx: 'auto', opacity: 0.9 }}>
                        Restore your body's natural balance with our authentic 5-step detoxification process.
                    </Typography>
                </Box>

                <Grid container spacing={4} justifyContent="center">
                    {procedures.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                            <Paper elevation={0} sx={{
                                p: 3,
                                height: '100%',
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 4,
                                color: 'white',
                                transition: '0.3s',
                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)', transform: 'translateY(-5px)' },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center'
                            }}>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: '50%',
                                    bgcolor: 'secondary.main',
                                    mb: 2,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <item.icon size={24} color="white" />
                                </Box>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    {item.title}
                                </Typography>
                                <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, opacity: 0.8 }}>
                                    {item.subtitle}
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.875rem', opacity: 0.9 }}>
                                    {item.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default PanchakarmaSection;
