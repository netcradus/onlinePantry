import { useState, useMemo } from 'react';
import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Stack, FormControl, Select, MenuItem, Pagination, Skeleton } from '@mui/material';
import { useGetProductsQuery, useDeleteProductMutation } from '../../../store/api/productApi';
import { useGetCategoriesQuery } from '../../../store/api/categoryApi';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Plus, Filter } from 'lucide-react';
import { PantryButton } from '../../ui/PantryButton';

const ProductManager = () => {
    const [sort, setSort] = useState('newest');
    const [category, setCategory] = useState('all');
    const [page, setPage] = useState(1);
    
    const { data: categoriesData } = useGetCategoriesQuery({});
    const { data, isLoading } = useGetProductsQuery({ 
        limit: 12, 
        page, 
        sort,
        category: category === 'all' ? undefined : category 
    });
    const [deleteProduct] = useDeleteProductMutation();
    const navigate = useNavigate();

    const handleDelete = async (id: string) => {
        if (window.confirm('Permanently remove this product from the inventory?')) {
            await deleteProduct(id);
        }
    };

    const handlePageChange = (_: any, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalPages = data?.data?.pages || 1;

    return (
        <Box sx={{ py: 6, bgcolor: 'var(--pantry-cream)', minHeight: '100vh' }}>
            <Container maxWidth="xl">
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' }, 
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', md: 'flex-end' }, 
                    mb: 6, 
                    gap: 3 
                }}>
                    <Box>
                        <Typography variant="h1" sx={{ fontWeight: 800, mb: 1 }}>Product Inventory</Typography>
                        <Typography variant="body1" sx={{ color: 'var(--pantry-gray-400)' }}>Manage your fresh harvest and pantry staples</Typography>
                    </Box>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <Select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    setPage(1);
                                }}
                                displayEmpty
                                sx={{ bgcolor: 'white', borderRadius: '12px', fontWeight: 700, border: '1.5px solid var(--pantry-gray-100)' }}
                                startAdornment={<Filter size={16} style={{ marginRight: 8, color: 'var(--pantry-gray-400)' }} />}
                            >
                                <MenuItem value="all">All Categories</MenuItem>
                                {categoriesData?.data?.map((cat: any) => (
                                    <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <Select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                displayEmpty
                                sx={{ bgcolor: 'white', borderRadius: '12px', fontWeight: 700, border: '1.5px solid var(--pantry-gray-100)' }}
                            >
                                <MenuItem value="newest">Latest Harvest</MenuItem>
                                <MenuItem value="category_asc">Category (A-Z)</MenuItem>
                                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                                <MenuItem value="price_desc">Price: High to Low</MenuItem>
                            </Select>
                        </FormControl>
                        <PantryButton
                            variant="primary"
                            startIcon={<Plus size={20} />}
                            onClick={() => navigate('/admin/products/new')}
                            sx={{ borderRadius: '24px', px: 4, height: 40 }}
                        >
                            Add New Product
                        </PantryButton>
                    </Stack>
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '24px', border: '1.5px solid var(--pantry-gray-100)', overflowX: 'auto', mb: 6 }}>
                    <Table sx={{ minWidth: 1000 }}>
                        <TableHead sx={{ bgcolor: 'var(--pantry-gray-50)' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Product Details</TableCell>
                                <TableCell sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Category</TableCell>
                                <TableCell sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Unit Price</TableCell>
                                <TableCell sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Stock Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.data?.products?.map((product: any) => (
                                <TableRow key={product._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Box sx={{ width: 50, height: 50, bgcolor: 'white', borderRadius: '12px', border: '1px solid var(--pantry-gray-100)', p: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <img src={product.image} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{product.name}</Typography>
                                                <Typography variant="caption" sx={{ color: 'var(--pantry-gray-400)', fontWeight: 600 }}>{product.brand || 'Local Farm'}</Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Chip
                                            label={typeof product.category === 'object' ? product.category?.name : product.category}
                                            size="small"
                                            sx={{
                                                bgcolor: 'var(--pantry-green-50)',
                                                color: 'var(--pantry-green-600)',
                                                fontWeight: 800,
                                                borderRadius: '8px',
                                                fontSize: '11px',
                                                textTransform: 'uppercase'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'var(--pantry-gray-800)' }}>₹{product.price}</Typography>
                                        {product.discountPrice && (
                                            <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'var(--pantry-gray-400)', fontWeight: 500 }}>₹{product.discountPrice}</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: product.stock > 0 ? 'var(--pantry-green-600)' : 'var(--pantry-sale)' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: product.stock > 0 ? 'inherit' : 'var(--pantry-sale)' }}>
                                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="right" sx={{ py: 2.5 }}>
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <IconButton
                                                onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                                                sx={{ color: 'var(--pantry-green-600)', bgcolor: 'var(--pantry-green-50)', '&:hover': { bgcolor: 'var(--pantry-green-100)' } }}
                                                size="small"
                                            >
                                                <Edit2 size={16} />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDelete(product._id)}
                                                sx={{ color: 'var(--pantry-sale)', bgcolor: '#fff1f2', '&:hover': { bgcolor: '#ffe4e6' } }}
                                                size="small"
                                            >
                                                <Trash2 size={16} />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Pagination 
                            count={totalPages} 
                            page={page} 
                            onChange={handlePageChange} 
                            size="large"
                            sx={{ 
                                '& .MuiPaginationItem-root': { borderRadius: '12px', fontWeight: 800, color: 'var(--pantry-gray-400)' },
                                '& .MuiPaginationItem-root.Mui-selected': { bgcolor: 'var(--pantry-green-600)', color: 'white', '&:hover': { bgcolor: 'var(--pantry-green-800)' } }
                            }}
                        />
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default ProductManager;
