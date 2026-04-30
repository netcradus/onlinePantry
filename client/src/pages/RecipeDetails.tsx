import React from 'react';
import { Box, Container, Typography, Grid, Paper, Stack, Divider, List, ListItem, ListItemText, ListItemIcon, Avatar, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetRecipeBySlugQuery, useAddRecipeToCartMutation } from '../store/api/recipesApi';
import { Clock, ChefHat, CheckCircle2, ShoppingCart, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { PantryButton } from '../components/ui/PantryButton';
import { PantryBadge } from '../components/ui/PantryBadge';

const RecipeDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { data: recipeData, isLoading } = useGetRecipeBySlugQuery(slug);
    const [addRecipeToCart, { isLoading: isAdding }] = useAddRecipeToCartMutation();

    const recipe = recipeData?.data;

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}><CircularProgress color="primary" /></Box>;
    if (!recipe) return <Box sx={{ textAlign: 'center', py: 10 }}><Typography>Recipe not found</Typography></Box>;

    const handleAddToCart = async () => {
        try {
            await addRecipeToCart(recipe._id).unwrap();
            navigate('/cart');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Box sx={{ pb: 10, bgcolor: 'var(--pantry-cream)', minHeight: '100vh' }}>
            <Box sx={{ bgcolor: 'white', py: 2, borderBottom: '1px solid var(--pantry-gray-100)', position: 'sticky', top: 0, zIndex: 1000 }}>
                <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: { xs: 2, md: 3 } }}>
                    <PantryButton variant="ghost" size="small" startIcon={<ArrowLeft size={18} />} onClick={() => navigate('/recipes')} sx={{ fontWeight: 700 }}>
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>All Recipes</Box>
                        <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Back</Box>
                    </PantryButton>
                    <Stack direction="row" spacing={1.5}>
                        <PantryButton variant="ghost" size="small" sx={{ p: 1, minWidth: 40, borderRadius: '50%' }}><Heart size={20} /></PantryButton>
                        <PantryButton variant="ghost" size="small" sx={{ p: 1, minWidth: 40, borderRadius: '50%' }}><Share2 size={20} /></PantryButton>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 6 }}>
                <Grid container spacing={6}>
                    {/* Hero Section */}
                    <Grid item xs={12} md={7}>
                        <Paper elevation={0} sx={{ borderRadius: '32px', overflow: 'hidden', height: { xs: 300, md: 600 }, boxShadow: '0 20px 80px rgba(0,0,0,0.1)' }}>
                            <img 
                                src={recipe.heroImage} 
                                alt={recipe.title} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        </Paper>
                    </Grid>

                    {/* Quick Info & Shop */}
                    <Grid item xs={12} md={5}>
                        <Box>
                            <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
                                <PantryBadge label={recipe.difficulty} variant="info" />
                                {recipe.isVegetarian && <PantryBadge label="Pure Veg" variant="success" />}
                            </Stack>
                            <Typography variant="h1" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '36px', md: '52px' }, lineHeight: 1.1 }}>{recipe.title}</Typography>
                            <Typography variant="body1" sx={{ color: 'var(--pantry-gray-400)', mb: 5, lineHeight: 1.8, fontSize: '18px', fontWeight: 500 }}>
                                {recipe.description}
                            </Typography>

                            <Paper elevation={0} sx={{ p: 3.5, borderRadius: '24px', bgcolor: 'var(--pantry-green-50)', mb: 5, border: '1px solid var(--pantry-green-100)' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={4} sx={{ textAlign: 'center', borderRight: '1.5px solid var(--pantry-green-100)' }}>
                                        <Clock size={22} color="var(--pantry-green-600)" style={{ marginBottom: 6 }} />
                                        <Typography variant="caption" sx={{ color: 'var(--pantry-green-800)', opacity: 0.6, fontWeight: 700, textTransform: 'uppercase', fontSize: '10px' }}>Prep</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--pantry-green-800)' }}>{recipe.prepTime}m</Typography>
                                    </Grid>
                                    <Grid item xs={4} sx={{ textAlign: 'center', borderRight: '1.5px solid var(--pantry-green-100)' }}>
                                        <Clock size={22} color="var(--pantry-green-600)" style={{ marginBottom: 6 }} />
                                        <Typography variant="caption" sx={{ color: 'var(--pantry-green-800)', opacity: 0.6, fontWeight: 700, textTransform: 'uppercase', fontSize: '10px' }}>Cook</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--pantry-green-800)' }}>{recipe.cookTime}m</Typography>
                                    </Grid>
                                    <Grid item xs={4} sx={{ textAlign: 'center' }}>
                                        <ChefHat size={22} color="var(--pantry-green-600)" style={{ marginBottom: 6 }} />
                                        <Typography variant="caption" sx={{ color: 'var(--pantry-green-800)', opacity: 0.6, fontWeight: 700, textTransform: 'uppercase', fontSize: '10px' }}>Serves</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--pantry-green-800)' }}>{recipe.servings}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Paper elevation={0} sx={{ p: 4, borderRadius: '28px', border: '2px solid var(--pantry-green-600)', bgcolor: 'white', boxShadow: '0 10px 30px rgba(46, 125, 50, 0.1)' }}>
                                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Cook this harvest</Typography>
                                <Typography variant="body2" sx={{ color: 'var(--pantry-gray-400)', mb: 4, fontWeight: 500 }}>
                                    Add all {recipe.ingredients?.length} fresh ingredients to your trolley in one tap.
                                </Typography>
                                <PantryButton 
                                    variant="primary" 
                                    fullWidth 
                                    size="large" 
                                    startIcon={<ShoppingCart size={20} />}
                                    onClick={handleAddToCart}
                                    loading={isAdding}
                                    sx={{ height: 60, borderRadius: '30px', fontSize: '16px', fontWeight: 800 }}
                                >
                                    Add all to Trolley
                                </PantryButton>
                            </Paper>
                        </Box>
                    </Grid>

                    {/* Details Grid */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 5, borderRadius: '32px', border: '1.5px solid var(--pantry-gray-100)', bgcolor: 'white' }}>
                            <Typography variant="h3" sx={{ fontWeight: 800, mb: 4 }}>Ingredients</Typography>
                            <List sx={{ p: 0 }}>
                                {recipe.ingredients?.map((ing: any, idx: number) => (
                                    <ListItem key={idx} sx={{ px: 0, py: 1.5, borderBottom: idx < recipe.ingredients.length - 1 ? '1px solid var(--pantry-gray-50)' : 'none' }}>
                                        <ListItemIcon sx={{ minWidth: 36 }}><CheckCircle2 size={18} color="var(--pantry-green-600)" /></ListItemIcon>
                                        <ListItemText 
                                            primary={<Box component="span" sx={{ fontWeight: 700 }}>{ing.quantity} {ing.unit} {ing.name}</Box>} 
                                            primaryTypographyProps={{ variant: 'body2' }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Paper elevation={0} sx={{ p: 5, borderRadius: '32px', border: '1.5px solid var(--pantry-gray-100)', bgcolor: 'white' }}>
                            <Typography variant="h3" sx={{ fontWeight: 800, mb: 4 }}>The Method</Typography>
                            <Stack spacing={5}>
                                {recipe.instructions?.map((step: string, idx: number) => (
                                    <Box key={idx}>
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }} alignItems="flex-start">
                                            <Typography variant="h2" sx={{ fontWeight: 800, color: 'var(--pantry-green-100)', fontSize: { xs: '36px', md: '48px' }, lineHeight: 1, mt: -1 }}>
                                                {(idx + 1).toString().padStart(2, '0')}
                                            </Typography>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: { xs: '15px', md: '17px' }, fontWeight: 500, color: 'var(--pantry-gray-800)' }}>
                                                    {step}
                                                </Typography>
                                                {idx < recipe.instructions.length - 1 && <Divider sx={{ mt: 4, borderColor: 'var(--pantry-gray-50)' }} />}
                                            </Box>
                                        </Stack>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default RecipeDetails;
