import React from 'react';
import { Box, Container, Typography, Grid, Link, Divider, IconButton, TextField, Stack } from '@mui/material';
import { Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react';
import { PantryButton } from '../../ui/PantryButton';

const Footer = () => {
    return (
        <Box sx={{ bgcolor: 'var(--pantry-gray-800)', color: 'white', pt: 12, pb: 0, mt: 'auto' }}>
            <Container maxWidth="xl">
                <Grid container spacing={8} sx={{ mb: 8 }}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', letterSpacing: -1 }}>
                                Online<Box component="span" sx={{ color: 'var(--pantry-green-400)' }}>Pantry</Box>
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4, maxWidth: 320, lineHeight: 1.8 }}>
                            Farm fresh produce, hand-picked daily and delivered to your doorstep. 
                            Experience the true taste of nature with our certified organic selection.
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, idx) => (
                                <IconButton key={idx} sx={{ 
                                    color: 'white', 
                                    bgcolor: 'rgba(255,255,255,0.05)', 
                                    '&:hover': { bgcolor: 'var(--pantry-green-600)', transform: 'translateY(-4px)' } 
                                }}>
                                    <Icon size={20} />
                                </IconButton>
                            ))}
                        </Stack>
                    </Grid>
                    
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: 'white' }}>
                            Shop
                        </Typography>
                        <Stack spacing={1.5}>
                            {['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Frozen', 'Drinks', 'Snacks', 'Organic'].map((item) => (
                                <Link key={item} href={`/shop?category=${item.toLowerCase()}`} color="inherit" sx={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: '0.2s', '&:hover': { color: 'var(--pantry-green-400)', pl: 0.5 } }}>
                                    {item}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: 'white' }}>
                            Company
                        </Typography>
                        <Stack spacing={1.5}>
                            {['About Us', 'Careers', 'Contact Us', 'Our Vendors', 'Sustainability', 'Investor Relations'].map((item) => (
                                <Link key={item} href="#" color="inherit" sx={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: '0.2s', '&:hover': { color: 'var(--pantry-green-400)', pl: 0.5 } }}>
                                    {item}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: 'white' }}>
                            Fresh Updates
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
                            Join our community to get the first pick of seasonal harvests.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField 
                                placeholder="Your email address" 
                                size="small" 
                                variant="outlined"
                                fullWidth
                                sx={{ 
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    borderRadius: '24px',
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        borderRadius: '24px',
                                        '& fieldset': { borderColor: 'transparent' },
                                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                    }
                                }}
                            />
                            <PantryButton variant="primary" sx={{ px: 3, borderRadius: '24px', bgcolor: 'var(--pantry-green-600)' }}>
                                <Send size={18} />
                            </PantryButton>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Bottom Strip */}
            <Box sx={{ bgcolor: '#0D0D0B', py: 4 }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                            © {new Date().getFullYear()} Online Pantry. All rights reserved. Locally sourced.
                        </Typography>
                        <Stack direction="row" spacing={4}>
                            {['Privacy Policy', 'Terms of Service', 'Cookies'].map((item) => (
                                <Link key={item} href="#" color="inherit" variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', '&:hover': { color: 'white' } }}>
                                    {item}
                                </Link>
                            ))}
                        </Stack>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default Footer;
