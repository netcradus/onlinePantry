import { Box, Card, CardContent, CardMedia, Typography, Button, IconButton, Chip } from '@mui/material';
import { ShoppingCart, Eye, Heart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAddToCartMutation } from '../../store/api/cartApi';
import { useDispatch } from 'react-redux';
// import { toast } from 'react-hot-toast'; // Assuming toast exists or will use alert for now

interface ProductCardProps {
    product: {
        _id?: string;
        id?: number | string;
        name: string;
        category: string | { name: string };
        price: number;
        originalPrice?: number;
        image?: string;
        images?: string[];
        inStock?: boolean;
    }
}

const ProductCard = ({ product }: ProductCardProps) => {
    const navigate = useNavigate();
    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    // Handle various image formats (legacy string vs new array)
    let displayImage = 'https://via.placeholder.com/300';

    if (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) {
        displayImage = product.images[0];
    } else if (typeof product.images === 'string') {
        displayImage = product.images;
    } else if (product.image) {
        displayImage = product.image;
    }

    const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await addToCart({ productId: product._id || product.id, quantity: 1 }).unwrap();
            // toast.success("Added to cart");
            console.log("Added to cart");
        } catch (err) {
            console.error("Failed to add to cart", err);
            // toast.error("Failed to add to cart");
        }
    };

    return (
        <Card
            onClick={() => navigate(`/product/${product._id || product.id}`)}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                borderRadius: 3,
                border: '1px solid #f0f0f0',
                transition: '0.3s',
                cursor: 'pointer',
                '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                    '& .overlay-actions': { opacity: 1, visibility: 'visible' },
                    '& .add-to-cart-btn': { opacity: 1, transform: 'translateY(0)' }
                }
            }}>
            {/* Discount Badge */}
            {discount > 0 && (
                <Chip
                    label={`${discount}% OFF`}
                    size="small"
                    color="secondary"
                    sx={{ position: 'absolute', top: 12, left: 12, fontWeight: 700, zIndex: 2 }}
                />
            )}

            {/* Image Container with Overlay */}
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                    component="img"
                    height="240"
                    image={displayImage}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                />

                {/* Overlay Action Buttons (Quick View, Wishlist) */}
                <Box className="overlay-actions" sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    opacity: 0,
                    visibility: 'hidden',
                    transition: '0.3s'
                }}>
                    <IconButton sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'primary.main', color: 'white' } }} size="small">
                        <Eye size={18} />
                    </IconButton>
                    <IconButton sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'secondary.main', color: 'white' } }} size="small">
                        <Heart size={18} />
                    </IconButton>
                </Box>

                {/* Add to Cart Button (slides up on hover) */}
                <Box className="add-to-cart-btn" sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                    opacity: 0,
                    transform: 'translateY(100%)',
                    transition: '0.3s',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        startIcon={isAdding ? <Loader2 className="animate-spin" size={18} /> : <ShoppingCart size={18} />}
                        sx={{ borderRadius: 2 }}
                        onClick={handleAddToCart}
                        disabled={isAdding}
                    >
                        {isAdding ? 'Adding...' : 'Add to Cart'}
                    </Button>
                </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>
                    {typeof product.category === 'object' ? (product.category as any).name : product.category}
                </Typography>
                <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2, mb: 1 }}>
                    {product.name}
                </Typography>

                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" color="primary.main" fontWeight={700}>
                        ₹{product.price}
                    </Typography>
                    {product.originalPrice && (
                        <Typography variant="body2" color="text.disabled" sx={{ textDecoration: 'line-through' }}>
                            ₹{product.originalPrice}
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProductCard;
