import { Box, TextField, Typography, Grid, Paper, MenuItem, CircularProgress, Alert, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel, Stack, Divider, Container } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateProductMutation, useUpdateProductMutation, useGetProductByIdQuery } from '../../../store/api/productApi';
import { useGetCategoriesQuery, useCreateCategoryMutation } from '../../../store/api/categoryApi';
import { X, PlusCircle, Image as ImageIcon, Sparkles, ShoppingBag, Plus } from 'lucide-react';
import { PantryButton } from '../../ui/PantryButton';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const { data: productData, isLoading: isProductLoading } = useGetProductByIdQuery(id!, { skip: !isEdit });
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesQuery({});
    const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();

    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategorySlug, setNewCategorySlug] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        ingredients: '',
        benefits: '',
        usageInstructions: '',
        isFeatured: false,
        combos: [] as any[],
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (productData?.data) {
            const p = productData.data;
            setFormData({
                name: p.name || '',
                category: p.category?._id || p.category || '',
                price: p.price?.toString() || '',
                stock: p.stock?.toString() || '',
                description: p.description || '',
                ingredients: p.ingredients?.join(', ') || '',
                benefits: p.benefits?.join(', ') || '',
                usageInstructions: p.usageInstructions || '',
                isFeatured: p.isFeatured || false,
                combos: p.combos || [],
            });
            if (p.images) {
                setPreviews(p.images);
            }
        }
    }, [productData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleComboChange = (index: number, field: string, value: any) => {
        const newCombos = [...formData.combos];
        newCombos[index] = { ...newCombos[index], [field]: value };
        setFormData(prev => ({ ...prev, combos: newCombos }));
    };

    const addCombo = () => {
        setFormData(prev => ({
            ...prev,
            combos: [...prev.combos, { name: '', multiplier: 1, price: 0, discountValue: 0, isDefault: false }]
        }));
    };

    const removeCombo = (index: number) => {
        setFormData(prev => ({
            ...prev,
            combos: prev.combos.filter((_, i) => i !== index)
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const data = new FormData();
        data.append('name', formData.name);
        data.append('category', formData.category);
        data.append('categoryId', formData.category);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('description', formData.description);
        data.append('usageInstructions', formData.usageInstructions);
        data.append('isFeatured', String(formData.isFeatured));

        formData.ingredients.split(',').map(i => i.trim()).filter(i => i).forEach(i => data.append('ingredients[]', i));
        formData.benefits.split(',').map(b => b.trim()).filter(b => b).forEach(b => data.append('benefits[]', b));
        data.append('combos', JSON.stringify(formData.combos));
        selectedFiles.forEach(file => data.append('images', file));

        try {
            if (isEdit) {
                await updateProduct({ id, body: data }).unwrap();
            } else {
                await createProduct(data).unwrap();
            }
            navigate('/admin/products');
        } catch (err: any) {
            setError(err.data?.message || 'Something went wrong');
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName || !newCategorySlug) return;
        try {
            await createCategory({ name: newCategoryName, slug: newCategorySlug }).unwrap();
            setOpenCategoryDialog(false);
            setNewCategoryName('');
            setNewCategorySlug('');
        } catch (err) {
            console.error(err);
        }
    };

    if (isProductLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}><CircularProgress color="primary" /></Box>;

    return (
        <Box sx={{ py: 6, bgcolor: 'var(--pantry-cream)', minHeight: '100vh' }}>
            <Container maxWidth="md">
                <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 3 }}>
                    <Box>
                        <Typography variant="h1" sx={{ fontWeight: 800, mb: 1 }}>{isEdit ? 'Update Product' : 'Catalog Entry'}</Typography>
                        <Typography variant="body1" sx={{ color: 'var(--pantry-gray-400)' }}>Refine your fresh inventory details</Typography>
                    </Box>
                    <PantryButton variant="ghost" onClick={() => navigate('/admin/products')} sx={{ color: 'var(--pantry-green-600)', fontWeight: 700 }}>
                        Cancel & Return
                    </PantryButton>
                </Box>

                <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: '32px', border: '1.5px solid var(--pantry-gray-100)', bgcolor: 'white' }}>
                    {error && <Alert severity="error" sx={{ mb: 4, borderRadius: '12px' }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={6}>
                            {/* Basic Details */}
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <ShoppingBag size={22} color="var(--pantry-green-600)" /> Essentials
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Product Name" name="name" value={formData.name} onChange={handleChange} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                                            <TextField fullWidth select label="Category" name="category" value={formData.category} onChange={handleChange} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}>
                                                {isCategoriesLoading ? <MenuItem disabled>Loading...</MenuItem> :
                                                    categoriesData?.data?.map((cat: any) => (
                                                        <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                                                    ))}
                                            </TextField>
                                            <IconButton onClick={() => setOpenCategoryDialog(true)} sx={{ bgcolor: 'var(--pantry-green-50)', color: 'var(--pantry-green-600)', borderRadius: '12px', width: 56, height: 56 }}>
                                                <Plus size={24} />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField fullWidth type="number" label="Price (₹)" name="price" value={formData.price} onChange={handleChange} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField fullWidth type="number" label="Stock Units" name="stock" value={formData.stock} onChange={handleChange} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth multiline rows={4} label="Story / Description" name="description" value={formData.description} onChange={handleChange} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                    </Grid>
                                </Grid>
                            </Box>

                            <Divider sx={{ borderColor: 'var(--pantry-gray-50)' }} />

                            {/* Multimedia */}
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <ImageIcon size={22} color="var(--pantry-green-600)" /> Harvest Imagery
                                </Typography>
                                <Box sx={{ 
                                    p: 4, 
                                    border: '2px dashed var(--pantry-gray-100)', 
                                    borderRadius: '24px', 
                                    textAlign: 'center',
                                    bgcolor: 'var(--pantry-gray-50)',
                                    transition: '0.2s',
                                    '&:hover': { borderColor: 'var(--pantry-green-100)', bgcolor: 'var(--pantry-green-50)' }
                                }}>
                                    <input accept="image/*" style={{ display: 'none' }} id="raised-button-file" type="file" multiple onChange={handleFileChange} />
                                    <label htmlFor="raised-button-file">
                                        <PantryButton variant="ghost" component="span" startIcon={<Plus size={20} />} sx={{ fontWeight: 800, color: 'var(--pantry-green-600)' }}>
                                            Select Fresh Captures
                                        </PantryButton>
                                    </label>
                                    <Typography variant="caption" display="block" sx={{ mt: 2, color: 'var(--pantry-gray-400)', fontWeight: 600 }}>
                                        High-resolution PNG or JPG preferred.
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
                                    {previews.map((src, index) => (
                                        <Box key={index} sx={{ position: 'relative', width: 120, height: 120, borderRadius: '16px', overflow: 'hidden', border: '2px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                            <img src={src} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                            <Divider sx={{ borderColor: 'var(--pantry-gray-50)' }} />

                            {/* Offers */}
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Sparkles size={22} color="var(--pantry-amber-600)" /> Combo Packs
                                    </Typography>
                                    <PantryButton variant="ghost" size="small" startIcon={<PlusCircle size={18} />} onClick={addCombo} sx={{ color: 'var(--pantry-green-600)', fontWeight: 700 }}>
                                        Add Bundle
                                    </PantryButton>
                                </Box>
                                <Stack spacing={2}>
                                    {formData.combos.map((combo, index) => (
                                        <Paper key={index} variant="outlined" sx={{ p: 3, borderRadius: '16px', border: '1.5px solid var(--pantry-gray-100)', position: 'relative' }}>
                                            <Grid container spacing={3} alignItems="center">
                                                <Grid item xs={12} md={4}>
                                                    <TextField fullWidth label="Bundle Name" value={combo.name} onChange={(e) => handleComboChange(index, 'name', e.target.value)} size="small" />
                                                </Grid>
                                                <Grid item xs={4} md={2}>
                                                    <TextField fullWidth label="Qty" type="number" value={combo.multiplier} onChange={(e) => handleComboChange(index, 'multiplier', Number(e.target.value))} size="small" />
                                                </Grid>
                                                <Grid item xs={4} md={3}>
                                                    <TextField fullWidth label="Price (₹)" type="number" value={combo.price} onChange={(e) => handleComboChange(index, 'price', Number(e.target.value))} size="small" />
                                                </Grid>
                                                <Grid item xs={4} md={3}>
                                                    <TextField fullWidth label="Savings" type="number" value={combo.discountValue} onChange={(e) => handleComboChange(index, 'discountValue', Number(e.target.value))} size="small" />
                                                </Grid>
                                            </Grid>
                                            <IconButton onClick={() => removeCombo(index)} sx={{ position: 'absolute', top: -12, right: -12, bgcolor: 'white', border: '1px solid var(--pantry-gray-100)', color: 'var(--pantry-sale)', '&:hover': { bgcolor: '#fff1f2' } }}>
                                                <X size={16} />
                                            </IconButton>
                                        </Paper>
                                    ))}
                                </Stack>
                            </Box>

                            <Divider sx={{ borderColor: 'var(--pantry-gray-50)' }} />

                            {/* Additional Attributes */}
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>Attributes & Promotion</Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Ingredients (e.g. Organic, Non-GMO)" name="ingredients" value={formData.ingredients} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Health Benefits" name="benefits" value={formData.benefits} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Usage Instructions" name="usageInstructions" value={formData.usageInstructions} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={<Switch checked={formData.isFeatured} onChange={handleChange} name="isFeatured" color="primary" />}
                                            label={<Typography sx={{ fontWeight: 700 }}>Feature in Hero Carousel</Typography>}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            <Divider sx={{ borderColor: 'var(--pantry-gray-50)' }} />

                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <PantryButton variant="ghost" onClick={() => navigate('/admin/products')} sx={{ fontWeight: 700 }}>Discard</PantryButton>
                                <PantryButton variant="primary" type="submit" loading={isCreating || isUpdating} sx={{ px: 6, borderRadius: '28px', height: 56 }}>
                                    {isEdit ? 'Save Changes' : 'Publish to Store'}
                                </PantryButton>
                            </Box>
                        </Stack>
                    </form>
                </Paper>
            </Container>

            <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)} PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}>
                <DialogTitle sx={{ fontWeight: 800, fontSize: '22px' }}>New Category</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField fullWidth label="Display Name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                        <TextField fullWidth label="URL Slug" value={newCategorySlug} onChange={(e) => setNewCategorySlug(e.target.value)} helperText="e.g. immunity-boosters" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <PantryButton variant="ghost" onClick={() => setOpenCategoryDialog(false)} sx={{ fontWeight: 700 }}>Cancel</PantryButton>
                    <PantryButton variant="primary" onClick={handleCreateCategory} disabled={isCreatingCategory} sx={{ borderRadius: '20px' }}>
                        {isCreatingCategory ? 'Adding...' : 'Create Category'}
                    </PantryButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductForm;
