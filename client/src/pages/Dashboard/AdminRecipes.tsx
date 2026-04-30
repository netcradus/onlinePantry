import React from 'react';
import { Box, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, CircularProgress, Stack, Avatar, Chip } from '@mui/material';
import { useGetRecipesQuery, useDeleteRecipeMutation } from '../../store/api/recipesApi';
import { PantryButton } from '../../components/ui/PantryButton';
import { Plus, Edit2, Trash2, ExternalLink, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminRecipes = () => {
    const navigate = useNavigate();
    const { data: recipesData, isLoading } = useGetRecipesQuery({});
    const [deleteRecipe] = useDeleteRecipeMutation();

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}><CircularProgress color="primary" /></Box>;

    const recipes = recipesData?.data?.data || [];

    return (
        <Box sx={{ py: 6, bgcolor: 'var(--pantry-cream)', minHeight: '100vh' }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h1" sx={{ fontWeight: 800, mb: 1 }}>Shoppable Recipes</Typography>
                        <Typography variant="body1" sx={{ color: 'var(--pantry-gray-400)' }}>Curate culinary inspiration for your customers</Typography>
                    </Box>
                    <PantryButton variant="primary" startIcon={<Plus size={20} />} onClick={() => navigate('/admin/recipes/new')} sx={{ borderRadius: '24px', px: 4 }}>
                        Create New Recipe
                    </PantryButton>
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '24px', border: '1.5px solid var(--pantry-gray-100)', overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 900 }}>
                        <TableHead sx={{ bgcolor: 'var(--pantry-gray-50)' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Recipe</TableCell>
                                <TableCell sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Complexity</TableCell>
                                <TableCell sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Time</TableCell>
                                <TableCell sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Ingredients</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recipes.map((recipe: any) => (
                                <TableRow key={recipe._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar 
                                                variant="rounded" 
                                                src={recipe.heroImage} 
                                                sx={{ width: 50, height: 50, bgcolor: 'var(--pantry-gray-50)', p: 0.5 }} 
                                            >
                                                <ChefHat size={24} color="var(--pantry-gray-100)" />
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontWeight: 800 }}>{recipe.title}</Typography>
                                                <Typography variant="caption" sx={{ color: 'var(--pantry-gray-400)', fontWeight: 600 }}>{recipe.creator?.name || 'In-house Chef'}</Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Chip 
                                            label={recipe.difficulty} 
                                            size="small" 
                                            sx={{ 
                                                textTransform: 'uppercase', 
                                                fontWeight: 800, 
                                                fontSize: '10px',
                                                bgcolor: recipe.difficulty === 'hard' ? 'var(--pantry-sale)' : 'var(--pantry-green-50)',
                                                color: recipe.difficulty === 'hard' ? 'white' : 'var(--pantry-green-600)'
                                            }} 
                                        />
                                    </TableCell>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{recipe.prepTime + recipe.cookTime} mins</Typography>
                                    </TableCell>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{recipe.ingredients?.length} items</Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ py: 2.5 }}>
                                        <IconButton size="small" onClick={() => window.open(`/recipes/${recipe.slug}`, '_blank')} sx={{ color: 'var(--pantry-gray-400)', mr: 1 }}><ExternalLink size={18} /></IconButton>
                                        <IconButton size="small" onClick={() => navigate(`/admin/recipes/edit/${recipe._id}`)} sx={{ color: 'var(--pantry-green-600)', mr: 1 }}><Edit2 size={18} /></IconButton>
                                        <IconButton size="small" sx={{ color: 'var(--pantry-sale)' }} onClick={() => deleteRecipe(recipe._id)}><Trash2 size={18} /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    );
};

export default AdminRecipes;
