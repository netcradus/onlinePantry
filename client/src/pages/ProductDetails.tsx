import { Box, Container, Grid, Typography, CircularProgress, IconButton, Alert, Snackbar, Paper, Divider, Rating, Avatar, TextField, Stack, Tab, Tabs, Breadcrumbs, Link, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery, useGetProductsQuery } from '../store/api/productApi';
import { useGetProductReviewsQuery, useCreateReviewMutation, useVoteHelpfulMutation } from '../store/api/reviewsApi';
import { useAddToCartMutation } from '../store/api/cartApi';
import { ShoppingBag, Plus, Minus, Check, Truck, ShieldCheck, Leaf, Star, ThumbsUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { PantryButton } from '../components/ui/PantryButton';
import { PantryCard } from '../components/ui/PantryCard';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { data: productData, isLoading } = useGetProductByIdQuery(id);
    const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

    const product = productData?.data;

    const { data: similarData } = useGetProductsQuery(
        product ? { category: product.category?._id, limit: 5 } : { skip: true }
    );

    useEffect(() => {
        window.scrollTo(0, 0);
        setSelectedImage(0);
        setQuantity(1);
    }, [id]);

    if (isLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
            <CircularProgress color="primary" />
        </Box>
    );

    if (!product) return (
        <Container sx={{ py: 10, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>Product not found</Typography>
            <PantryButton variant="primary" onClick={() => navigate('/shop')}>Back to Shop</PantryButton>
        </Container>
    );

    const hasDiscount = product.discountPrice && product.discountPrice < product.price;

    const handleAddToCart = async (productId?: string) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            await addToCart({
                productId: productId || product._id,
                quantity: productId ? 1 : quantity
            }).unwrap();
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Failed to add to cart", error);
        }
    };

    return (
        <Box sx={{ bgcolor: 'white', minHeight: '100vh', pb: 12 }}>
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Breadcrumbs sx={{ mb: 4, '& .MuiBreadcrumbs-separator': { color: 'var(--pantry-gray-400)', fontSize: '13px' } }}>
                    <Link href="/" color="inherit" underline="none" sx={{ fontWeight: 400, fontSize: '13px', color: 'var(--pantry-gray-400)' }}>Home</Link>
                    <Link href="/shop" color="inherit" underline="none" sx={{ fontWeight: 400, fontSize: '13px', color: 'var(--pantry-gray-400)' }}>Shop</Link>
                    <Typography sx={{ fontWeight: 400, fontSize: '13px', color: 'var(--pantry-gray-800)' }}>{product.name}</Typography>
                </Breadcrumbs>
            </Container>

            <Container maxWidth="xl">
                <Grid container spacing={{ xs: 4, md: 8 }}>
                    {/* Image Gallery */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ position: 'sticky', top: 120 }}>
                            <Box sx={{ 
                                bgcolor: 'white', 
                                borderRadius: '16px', 
                                mb: 3, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                height: { xs: 350, md: 500 },
                                overflow: 'hidden',
                                border: '1.5px solid var(--pantry-gray-100)',
                                transition: '0.3s',
                                '&:hover img': { transform: 'scale(1.1)' }
                            }}>
                                <img 
                                    src={product.images?.[selectedImage] || 'https://via.placeholder.com/400'} 
                                    alt={product.name}
                                    style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain', transition: '0.5s ease' }}
                                />
                            </Box>
                            <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
                                {product.images?.map((img: string, idx: number) => (
                                    <Box 
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        sx={{ 
                                            width: 80, 
                                            height: 80, 
                                            minWidth: 80,
                                            borderRadius: '12px', 
                                            border: '2px solid',
                                            borderColor: selectedImage === idx ? 'var(--pantry-green-600)' : 'var(--pantry-gray-100)',
                                            cursor: 'pointer',
                                            p: 1,
                                            bgcolor: 'white',
                                            transition: '0.2s',
                                            '&:hover': { borderColor: 'var(--pantry-green-400)' }
                                        }}
                                    >
                                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Grid>

                    {/* Product Info */}
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Chip 
                                label={product.category?.name || 'Fresh'} 
                                size="small" 
                                sx={{ bgcolor: 'var(--pantry-green-600)', color: 'white', fontWeight: 700, mb: 2, borderRadius: '20px', fontSize: '13px' }} 
                            />
                            <Typography variant="h2" sx={{ fontWeight: 700, mb: 1, letterSpacing: -1 }}>
                                {product.name}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'var(--pantry-gray-400)', fontSize: '14px' }}>
                                Brand: <Link href="#" sx={{ color: 'inherit', textDecoration: 'underline' }}>{product.brand}</Link>
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                                <Box sx={{ display: 'flex', color: 'var(--pantry-amber-600)', gap: 0.5 }}>
                                    {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < Math.floor(product.averageRating || 0) ? "var(--pantry-amber-600)" : "none"} />)}
                                </Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--pantry-gray-400)' }}>
                                    ({product.ratingsCount || 0} reviews)
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                {hasDiscount ? (
                                    <Stack direction="row" spacing={2} alignItems="baseline">
                                        <Typography sx={{ fontWeight: 700, color: 'var(--pantry-sale)', fontSize: '28px' }}>
                                            ₹{product.discountPrice.toFixed(2)}
                                        </Typography>
                                        <Typography sx={{ color: 'var(--pantry-gray-400)', textDecoration: 'line-through', fontSize: '18px' }}>
                                            ₹{product.price.toFixed(2)}
                                        </Typography>
                                        <Box sx={{ bgcolor: 'var(--pantry-sale)', color: 'white', px: 1.5, py: 0.5, borderRadius: '6px', fontWeight: 700, fontSize: '12px' }}>
                                            Save {Math.round((1 - product.discountPrice / product.price) * 100)}%
                                        </Box>
                                    </Stack>
                                ) : (
                                    <Typography sx={{ fontWeight: 700, color: 'var(--pantry-green-600)', fontSize: '28px' }}>
                                        ₹{product.price.toFixed(2)}
                                    </Typography>
                                )}
                            </Box>

                            <Typography sx={{ fontWeight: 600, mb: 2 }}>Pack Size: <Box component="span" sx={{ color: 'var(--pantry-gray-400)' }}>{product.weight}</Box></Typography>

                            {/* Quantity & Add to Cart */}
                            <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--pantry-green-600)', borderRadius: '24px', px: 1, height: 52 }}>
                                    <IconButton size="small" onClick={() => setQuantity(Math.max(1, quantity - 1))} sx={{ color: 'var(--pantry-green-600)' }}>
                                        <Minus size={20} />
                                    </IconButton>
                                    <Typography sx={{ width: 40, textAlign: 'center', fontWeight: 700, fontSize: '18px' }}>{quantity}</Typography>
                                    <IconButton size="small" onClick={() => setQuantity(quantity + 1)} sx={{ color: 'var(--pantry-green-600)' }}>
                                        <Plus size={20} />
                                    </IconButton>
                                </Box>
                                <PantryButton 
                                    variant="primary" 
                                    fullWidth 
                                    startIcon={<ShoppingBag size={20} />}
                                    onClick={() => handleAddToCart()}
                                    loading={isAdding}
                                    disabled={product.stock <= 0}
                                    sx={{ height: 52, bgcolor: 'var(--pantry-green-600)', borderRadius: '24px', fontSize: '16px', fontWeight: 700 }}
                                >
                                    {product.stock > 0 ? 'Add to Trolley' : 'Out of Stock'}
                                </PantryButton>
                            </Stack>

                            {/* Delivery Promise Strip */}
                            <Box sx={{ bgcolor: 'var(--pantry-green-50)', p: 2, borderRadius: '10px', mb: 6, display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Truck size={24} color="var(--pantry-green-600)" />
                                <Typography sx={{ fontWeight: 600, fontSize: '14px', color: 'var(--pantry-green-800)' }}>
                                    🚛 Order before 2pm for same-day delivery
                                </Typography>
                            </Box>

                            {/* Tabs */}
                            <Box sx={{ borderBottom: 1, borderColor: 'var(--pantry-gray-100)', mb: 3 }}>
                                <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ 
                                    '& .MuiTabs-indicator': { bgcolor: 'var(--pantry-green-600)', height: 2 },
                                    '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '16px', color: 'var(--pantry-gray-400)' },
                                    '& .Mui-selected': { color: 'var(--pantry-green-600) !important' }
                                }}>
                                    <Tab label="Description" />
                                    <Tab label="Nutrition" />
                                    <Tab label="Storage" />
                                </Tabs>
                            </Box>
                            <Box sx={{ minHeight: 120 }}>
                                {tabValue === 0 && <Typography variant="body1" sx={{ color: 'var(--pantry-gray-800)', lineHeight: 1.7 }}>{product.description}</Typography>}
                                {tabValue === 1 && (
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>Typical values per 100g:</Typography>
                                        <Grid container spacing={2}>
                                            {[
                                                { label: 'Energy', val: '240 kcal' },
                                                { label: 'Fat', val: '1.2g' },
                                                { label: 'Sugars', val: '12g' },
                                                { label: 'Fibre', val: '3.4g' }
                                            ].map((nut, idx) => (
                                                <Grid item xs={6} key={idx} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--pantry-gray-100)', py: 1 }}>
                                                    <Typography variant="body2" sx={{ color: 'var(--pantry-gray-400)' }}>{nut.label}</Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{nut.val}</Typography>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                )}
                                {tabValue === 2 && <Typography variant="body1" sx={{ color: 'var(--pantry-gray-800)', lineHeight: 1.7 }}>Store in a cool, dry place. Once opened, keep refrigerated and consume within 3 days.</Typography>}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Reviews Section */}
            <Box sx={{ mt: 12, bgcolor: 'var(--pantry-cream)', py: 10 }}>
                <Container maxWidth="xl">
                    <ReviewsSection productId={product._id} />
                </Container>
            </Box>

            {/* Similar Products */}
            <Container maxWidth="xl" sx={{ mt: 12 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 6 }}>You might also like</Typography>
                <Grid container spacing={3}>
                    {similarData?.data?.data?.filter((p: any) => p._id !== product._id).slice(0, 4).map((p: any) => (
                        <Grid item xs={6} sm={4} md={3} key={p._id}>
                            <PantryCard 
                                id={p._id}
                                name={p.name}
                                brand={p.brand}
                                price={p.price}
                                discountPrice={p.discountPrice}
                                image={p.images?.[0]}
                                weight={p.weight}
                                onAddToCart={() => handleAddToCart(p._id)}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%', bgcolor: 'var(--pantry-green-600)', color: 'white' }} icon={<Check color="white" />}>
                    Item added to your trolley!
                </Alert>
            </Snackbar>
        </Box>
    );
};

function ReviewsSection({ productId }: { productId: string }) {
    const { data: reviewsData } = useGetProductReviewsQuery({ productId });
    const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();
    const [voteHelpful] = useVoteHelpfulMutation();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    
    const [showForm, setShowForm] = useState(false);
    const [reviewData, setReviewData] = useState({ rating: 5, title: '', body: '' });

    const reviews = reviewsData?.data?.data || [];

    const handleSubmit = async () => {
        try {
            await createReview({ productId, ...reviewData }).unwrap();
            setShowForm(false);
            setReviewData({ rating: 5, title: '', body: '' });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 800 }}>Customer Reviews</Typography>
                {isAuthenticated && (
                    <PantryButton variant="primary" onClick={() => setShowForm(!showForm)} sx={{ borderRadius: '24px', px: 4 }}>
                        {showForm ? 'Cancel' : 'Write a Review'}
                    </PantryButton>
                )}
            </Stack>

            {showForm && (
                <Paper sx={{ p: 4, borderRadius: '16px', mb: 6, border: '1px solid var(--pantry-gray-100)' }}>
                    <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Your Review</Typography>
                    <Rating value={reviewData.rating} onChange={(_, v) => setReviewData(p => ({ ...p, rating: v || 5 }))} sx={{ mb: 3, color: 'var(--pantry-amber-600)' }} />
                    <TextField 
                        fullWidth 
                        label="Review Title" 
                        sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
                        value={reviewData.title}
                        onChange={(e) => setReviewData(p => ({ ...p, title: e.target.value }))}
                    />
                    <TextField 
                        fullWidth 
                        multiline 
                        rows={4} 
                        label="Review Body" 
                        sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
                        value={reviewData.body}
                        onChange={(e) => setReviewData(p => ({ ...p, body: e.target.value }))}
                    />
                    <PantryButton variant="primary" onClick={handleSubmit} loading={isSubmitting} sx={{ px: 6, py: 1.5, borderRadius: '24px' }}>Submit Review</PantryButton>
                </Paper>
            )}

            <Grid container spacing={4}>
                {reviews.map((review: any) => (
                    <Grid item xs={12} md={6} key={review._id}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', bgcolor: 'white', border: '1px solid var(--pantry-gray-100)' }}>
                            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                                <Avatar sx={{ width: 48, height: 48, bgcolor: 'var(--pantry-green-100)', color: 'var(--pantry-green-800)', fontWeight: 700 }}>
                                    {review.userId?.firstName?.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                        {review.userId?.firstName} {review.userId?.lastName}
                                    </Typography>
                                    <Rating value={review.rating} readOnly size="small" sx={{ color: 'var(--pantry-amber-600)' }} />
                                </Box>
                                {review.verifiedPurchase && <Chip label="Verified" size="small" sx={{ ml: 'auto', bgcolor: 'var(--pantry-green-50)', color: 'var(--pantry-green-600)', fontWeight: 700 }} />}
                            </Stack>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>{review.title}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>{review.body}</Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="caption" sx={{ color: 'var(--pantry-gray-400)' }}>Helpful?</Typography>
                                <IconButton size="small" onClick={() => voteHelpful(review._id)} sx={{ color: 'var(--pantry-green-600)', bgcolor: 'var(--pantry-green-50)' }}>
                                    <ThumbsUp size={14} />
                                </IconButton>
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>{review.helpfulVotes || 0}</Typography>
                            </Stack>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default ProductDetails;
