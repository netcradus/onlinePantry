import React from 'react';
import { Box, Container, Typography, Grid, Paper, Chip, Stack, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetRecipesQuery } from '../store/api/recipesApi';
import { Clock, ChefHat, ShoppingBag } from 'lucide-react';
import { PantryButton } from '../components/ui/PantryButton';

const Recipes = () => {
    const navigate = useNavigate();
    const { data: recipesData, isLoading } = useGetRecipesQuery({});

    const recipes = recipesData?.data?.data || [];

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}><CircularProgress color="primary" /></Box>;

    return (
        <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'var(--pantry-cream)', minHeight: '100vh' }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 8, textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
                    <Typography variant="h1" sx={{ fontWeight: 800, mb: 2 }}>Inspiration for your next meal</Typography>
                    <Typography variant="body1" sx={{ color: 'var(--pantry-gray-400)', fontSize: '18px' }}>
                        Browse our collection of shoppable recipes from top chefs and local foodies. 
                        Add fresh ingredients to your trolley with a single click.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {recipes.map((recipe: any) => (
                        <Grid item xs={12} sm={6} md={4} key={recipe._id}>
                            <Paper 
                                elevation={0} 
                                sx={{ 
                                    borderRadius: '16px', 
                                    overflow: 'hidden', 
                                    cursor: 'pointer',
                                    bgcolor: 'white',
                                    border: '1px solid var(--pantry-gray-100)',
                                    transition: 'all 0.3s',
                                    '&:hover': { 
                                        transform: 'translateY(-10px)', 
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                                        borderColor: 'var(--pantry-green-600)'
                                    }
                                }}
                                onClick={() => navigate(`/recipes/${recipe.slug}`)}
                            >
                                <Box sx={{ position: 'relative', height: 260, overflow: 'hidden' }}>
                                    <Box 
                                        component="img"
                                        src={recipe.heroImage} 
                                        alt={recipe.title} 
                                        sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' }} 
                                    />
                                    <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                                        <Chip 
                                            label={recipe.difficulty} 
                                            size="small"
                                            sx={{ bgcolor: 'white', color: 'var(--pantry-gray-800)', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: 1 }} 
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ p: 4 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, height: 64, overflow: 'hidden' }}>{recipe.title}</Typography>
                                    <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Clock size={16} color="var(--pantry-green-600)" />
                                            <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--pantry-gray-400)' }}>
                                                {recipe.prepTime + recipe.cookTime} mins
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <ChefHat size={16} color="var(--pantry-green-600)" />
                                            <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--pantry-gray-400)' }}>
                                                {recipe.servings} servings
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <PantryButton 
                                        variant="ghost" 
                                        fullWidth 
                                        startIcon={<ShoppingBag size={18} />}
                                        sx={{ borderRadius: '24px', fontWeight: 700, color: 'var(--pantry-green-600)', borderColor: 'var(--pantry-green-100)' }}
                                    >
                                        View Ingredients
                                    </PantryButton>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                    {recipes.length === 0 && (
                        <Grid item xs={12}>
                            <Paper sx={{ p: 10, textAlign: 'center', borderRadius: '16px', bgcolor: 'white' }}>
                                <Typography variant="h4" sx={{ color: 'var(--pantry-gray-400)', mb: 2 }}>No recipes found</Typography>
                                <Typography variant="body1" color="text.secondary">We are currently cooking up some fresh inspiration. Check back soon!</Typography>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default Recipes;
