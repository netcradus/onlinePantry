import React, { useState } from 'react';
import { Box, Container, Grid, Typography, Pagination, CircularProgress, Select, MenuItem, FormControl, IconButton, Drawer, Stack, Paper, Breadcrumbs, Link } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import ShopFilters from '../components/shop/ShopFilters';
import { PantryCard } from '../components/ui/PantryCard';
import { useSearchQuery } from '../store/api/searchApi';
import { useAddToCartMutation } from '../store/api/cartApi';
import { Filter as FilterIcon, LayoutGrid, List as ListIcon, ShoppingBasket } from 'lucide-react';
import { PantryButton } from '../components/ui/PantryButton';
import { CardSkeleton } from '../components/ui/CardSkeleton';

const categoryHeroes: Record<string, string> = {
    fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=1600&q=80',
    vegetables: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600&q=80',
    dairy: 'https://images.unsplash.com/photo-1563636619-e9107daaf182?w=1600&q=80',
    bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1600&q=80',
    organic: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80',
    frozen: 'https://images.unsplash.com/photo-1584263343327-4479f824cca6?w=1600&q=80',
    drinks: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=1600&q=80',
};

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(1);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [addToCart] = useAddToCartMutation();

    const filters = {
        q: searchParams.get('q') || '',
        category: searchParams.get('category') || '',
        min: searchParams.get('min') ? Number(searchParams.get('min')) : undefined,
        max: searchParams.get('max') ? Number(searchParams.get('max')) : undefined,
        sort: searchParams.get('sort') || 'relevance',
        page
    };

    const { data, isLoading, isFetching } = useSearchQuery(filters);

    const products = data?.data?.data || [];
    const totalPages = data?.data?.pages || 1;
    const totalResults = data?.data?.total || 0;

    const currentCategory = filters.category.toLowerCase();
    const heroImage = categoryHeroes[currentCategory] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80';

    const setFilters = (newFiltersOrFn: any) => {
        const updatedParams = new URLSearchParams(searchParams);
        let finalFilters = typeof newFiltersOrFn === 'function' ? newFiltersOrFn(filters) : newFiltersOrFn;

        Object.entries(finalFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') updatedParams.set(key, String(value));
            else updatedParams.delete(key);
        });
        
        setSearchParams(updatedParams);
        setPage(1); 
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddToCart = async (productId: string) => {
        try {
            await addToCart({ productId, quantity: 1 }).unwrap();
        } catch (err) {
            console.error("Failed to add to cart", err);
        }
    };

    return (
        <Box sx={{ pb: 8, bgcolor: 'var(--pantry-cream)', minHeight: '100vh' }}>
            {/* Category Hero Banner */}
            <Box sx={{ 
                height: 220, 
                position: 'relative', 
                overflow: 'hidden',
                mb: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Box 
                    component="img" 
                    src={heroImage} 
                    sx={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <Box sx={{ 
                    position: 'absolute', 
                    top: 0, left: 0, right: 0, bottom: 0, 
                    bgcolor: 'rgba(0,0,0,0.45)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Breadcrumbs 
                        sx={{ mb: 2, '& .MuiBreadcrumbs-separator': { color: 'white', opacity: 0.6 } }}
                    >
                        <Link href="/" color="inherit" underline="none" sx={{ color: 'white', fontWeight: 600, opacity: 0.8 }}>Home</Link>
                        <Typography sx={{ color: 'white', fontWeight: 800 }}>Catalog</Typography>
                    </Breadcrumbs>
                    <Typography variant="h1" sx={{ color: 'white', fontWeight: 800, textAlign: 'center', textTransform: 'capitalize' }}>
                        {filters.category || (filters.q ? `Search: ${filters.q}` : 'Fresh Picks')}
                    </Typography>
                </Box>
            </Box>

            <Container maxWidth="xl">
                <Grid container spacing={4}>
                    {/* Sidebar Filters */}
                    <Grid item xs={12} md={3} lg={2.5} sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Paper elevation={0} sx={{ 
                            p: 3, 
                            borderRadius: '16px', 
                            position: 'sticky', 
                            top: 100,
                            bgcolor: 'white',
                            border: '1px solid var(--pantry-gray-100)'
                        }}>
                            <ShopFilters filters={filters} setFilters={setFilters} />
                        </Paper>
                    </Grid>

                    {/* Product Grid Area */}
                    <Grid item xs={12} md={9} lg={9.5}>
                        {/* Toolbar */}
                        <Paper elevation={0} sx={{ 
                            p: 2, 
                            mb: 4, 
                            borderRadius: '16px', 
                            display: 'flex', 
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            gap: 2,
                            bgcolor: 'white',
                            border: '1px solid var(--pantry-gray-100)'
                        }}>
                            <Typography sx={{ fontWeight: 600, color: 'var(--pantry-gray-800)' }}>
                                Showing {totalResults} products
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: { xs: '100%', sm: 'auto' } }}>
                                <FormControl size="small" sx={{ minWidth: 160, flexGrow: 1 }}>
                                    <Select
                                        value={filters.sort}
                                        onChange={(e) => setFilters({ sort: e.target.value })}
                                        sx={{ 
                                            borderRadius: '20px',
                                            fontWeight: 600,
                                            fontSize: '14px',
                                            bgcolor: 'var(--pantry-gray-100)',
                                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                                        }}
                                    >
                                        <MenuItem value="relevance">Sort: Relevance</MenuItem>
                                        <MenuItem value="price_asc">Price: Low to High</MenuItem>
                                        <MenuItem value="price_desc">Price: High to Low</MenuItem>
                                        <MenuItem value="newest">Newest Arrival</MenuItem>
                                    </Select>
                                </FormControl>
                                <IconButton 
                                    onClick={() => setMobileFiltersOpen(true)}
                                    sx={{ display: { md: 'none' }, bgcolor: 'var(--pantry-green-50)', color: 'var(--pantry-green-600)' }}
                                >
                                    <FilterIcon size={20} />
                                </IconButton>
                            </Box>
                        </Paper>

                        {isLoading ? (
                            <Grid container spacing={3}>
                                {[...Array(8)].map((_, i) => (
                                    <Grid item xs={6} sm={4} lg={3} key={i}>
                                        <CardSkeleton />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <>
                                <Box sx={{ position: 'relative' }}>
                                    {isFetching && (
                                        <Box sx={{
                                            position: 'absolute', top: 0, left: 0, right: 0,
                                            display: 'flex', justifyContent: 'flex-end', p: 1, zIndex: 2
                                        }}>
                                            <CircularProgress size={20} thickness={5} sx={{ color: 'var(--pantry-green-600)' }} />
                                        </Box>
                                    )}
                                    <Grid container spacing={3} sx={{ opacity: isFetching ? 0.55 : 1, transition: 'opacity 0.25s ease' }}>
                                        {products.map((product: any) => (
                                            <Grid item xs={6} sm={4} lg={3} key={product._id}>
                                                <PantryCard
                                                    id={product._id}
                                                    name={product.name}
                                                    brand={product.brand}
                                                    price={product.price}
                                                    discountPrice={product.discountPrice}
                                                    weight={product.weight}
                                                    image={product.images?.[0]}
                                                    isOrganic={product.isOrganic}
                                                    onAddToCart={() => handleAddToCart(product._id)}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>

                                {products.length === 0 && (
                                    <Paper sx={{ p: 10, textAlign: 'center', borderRadius: '16px', bgcolor: 'white' }}>
                                        <Box sx={{ color: 'var(--pantry-gray-400)', mb: 3 }}>
                                            <ShoppingBasket size={80} strokeWidth={1} />
                                        </Box>
                                        <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>Hmm, nothing here yet</Typography>
                                        <Typography color="text.secondary" sx={{ mb: 4 }}>We couldn't find anything matching your filters. Try clearing them to see all products.</Typography>
                                        <PantryButton variant="primary" onClick={() => setFilters({ q: '', category: '', min: '', max: '' })}>
                                            Browse all products
                                        </PantryButton>
                                    </Paper>
                                )}

                                {totalPages > 1 && (
                                    <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                                        <Pagination
                                            count={totalPages}
                                            page={page}
                                            onChange={handlePageChange}
                                            color="primary"
                                            size="large"
                                            sx={{
                                                '& .MuiPaginationItem-root': { borderRadius: '8px', fontWeight: 700 }
                                            }}
                                        />
                                    </Box>
                                )}
                            </>
                        )}
                    </Grid>
                </Grid>
            </Container>

            {/* Mobile Filters Drawer */}
            <Drawer
                anchor="bottom"
                open={mobileFiltersOpen}
                onClose={() => setMobileFiltersOpen(false)}
                PaperProps={{
                    sx: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85vh' }
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                        <Typography variant="h4" fontWeight={800}>Filter & Refine</Typography>
                        <PantryButton variant="ghost" size="small" onClick={() => setMobileFiltersOpen(false)}>Done</PantryButton>
                    </Stack>
                    <ShopFilters filters={filters} setFilters={setFilters} />
                </Box>
            </Drawer>
        </Box>
    );
};

export default Shop;
