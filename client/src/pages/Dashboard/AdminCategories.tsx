import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Stack, MenuItem } from '@mui/material';
import { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../../store/api/categoryApi';
import { PantryButton } from '../../components/ui/PantryButton';
import { Plus, Edit2, Trash2, Folder, ChevronRight } from 'lucide-react';

const AdminCategories = () => {
    const { data: categoriesData, isLoading } = useGetCategoriesQuery(undefined);
    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        parent: '',
        description: '',
        image: ''
    });

    const handleOpen = (cat: any = null) => {
        if (cat) {
            setSelectedCategory(cat);
            setFormData({
                name: cat.name,
                parent: cat.parent?._id || cat.parent || '',
                description: cat.description || '',
                image: cat.image || ''
            });
        } else {
            setSelectedCategory(null);
            setFormData({ name: '', parent: '', description: '', image: '' });
        }
        setOpen(true);
    };

    const handleSubmit = async () => {
        try {
            if (selectedCategory) {
                await updateCategory({ id: selectedCategory._id, body: formData }).unwrap();
            } else {
                await createCategory(formData).unwrap();
            }
            setOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}><CircularProgress color="primary" /></Box>;

    const categories = categoriesData?.data || [];

    return (
        <Box sx={{ py: 6, bgcolor: 'var(--pantry-cream)', minHeight: '100vh' }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h1" sx={{ fontWeight: 800, mb: 1 }}>Categories</Typography>
                        <Typography variant="body1" sx={{ color: 'var(--pantry-gray-400)' }}>Organize your shop's produce hierarchy</Typography>
                    </Box>
                    <PantryButton variant="primary" startIcon={<Plus size={20} />} onClick={() => handleOpen()} sx={{ borderRadius: '24px', px: 4 }}>
                        Add New Category
                    </PantryButton>
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '20px', border: '1.5px solid var(--pantry-gray-100)', overflowX: 'auto' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'var(--pantry-gray-50)' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Category Name</TableCell>
                                <TableCell sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Parent</TableCell>
                                <TableCell sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Description</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map((cat: any) => (
                                <TableRow key={cat._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ py: 2 }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'var(--pantry-green-50)', color: 'var(--pantry-green-600)' }}>
                                                <Folder size={18} />
                                            </Box>
                                            <Typography sx={{ fontWeight: 700 }}>{cat.name}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ py: 2 }}>
                                        {cat.parent ? (
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--pantry-gray-400)' }}>{cat.parent.name}</Typography>
                                                <ChevronRight size={14} color="var(--pantry-gray-100)" />
                                            </Stack>
                                        ) : (
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--pantry-green-600)' }}>Root Level</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ py: 2, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--pantry-gray-400)' }}>
                                        {cat.description || '-'}
                                    </TableCell>
                                    <TableCell align="right" sx={{ py: 2 }}>
                                        <IconButton size="small" onClick={() => handleOpen(cat)} sx={{ color: 'var(--pantry-green-600)', mr: 1 }}><Edit2 size={18} /></IconButton>
                                        <IconButton size="small" sx={{ color: 'var(--pantry-sale)' }} onClick={() => deleteCategory(cat._id)}><Trash2 size={18} /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
                <DialogTitle sx={{ fontWeight: 800, fontSize: '24px', pt: 3 }}>{selectedCategory ? 'Update Category' : 'Create Category'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <TextField 
                            fullWidth label="Category Name" 
                            variant="outlined"
                            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                        <TextField 
                            fullWidth select label="Parent Category"
                            variant="outlined"
                            value={formData.parent} onChange={(e) => setFormData({...formData, parent: e.target.value})}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        >
                            <MenuItem value="">None (Top Level)</MenuItem>
                            {categories.filter((c: any) => c._id !== selectedCategory?._id).map((c: any) => (
                                <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                            ))}
                        </TextField>
                        <TextField 
                            fullWidth multiline rows={3} label="Brief Description"
                            variant="outlined"
                            value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 4, pt: 1 }}>
                    <PantryButton variant="ghost" onClick={() => setOpen(false)} sx={{ fontWeight: 700 }}>Cancel</PantryButton>
                    <PantryButton variant="primary" onClick={handleSubmit} sx={{ px: 4, borderRadius: '24px' }}>Save Changes</PantryButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminCategories;
