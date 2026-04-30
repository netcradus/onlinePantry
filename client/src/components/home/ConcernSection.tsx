import { Box, Container, Typography, Grid, Avatar, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const concerns = [
    { title: 'Hair Care', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { title: 'Skin Care', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { title: 'Digestion', image: 'https://images.unsplash.com/photo-1511690656952-34342d5c2895?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { title: 'Diabetes', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { title: 'Bone Health', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { title: 'Weight Loss', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { title: 'Immunity', image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { title: 'Stress Relief', image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }
];

const ConcernSection = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ py: 8, bgcolor: '#fcfdfa' }}>
            <Container maxWidth="lg">
                <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 6, color: 'primary.main' }}>
                    Shop By Concern
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                    {concerns.map((item, index) => (
                        <Grid item xs={6} sm={4} md={3} lg={1.5} key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': { transform: 'scale(1.1)' }
                                }}
                                onClick={() => navigate('/shop')}
                            >
                                <Avatar
                                    src={item.image}
                                    alt={item.title}
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        mb: 2,
                                        border: '3px solid',
                                        borderColor: 'primary.light',
                                        boxShadow: 3
                                    }}
                                />
                                <Typography variant="subtitle2" align="center" fontWeight={600} color="text.primary">
                                    {item.title}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default ConcernSection;
