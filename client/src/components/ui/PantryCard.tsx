import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, IconButton, Chip, Stack, Button } from '@mui/material';
import { Plus, Heart, Star } from 'lucide-react';
import { PantryButton } from './PantryButton';
import { ProducePlaceholder } from './ProducePlaceholder';

interface PantryCardProps {
    id: string;
    name: string;
    brand: string;
    price: number;
    discountPrice?: number;
    image: string;
    weight?: string;
    onAddToCart: () => void;
    isOrganic?: boolean;
}

export const PantryCard: React.FC<PantryCardProps> = ({
    name,
    brand,
    price,
    discountPrice,
    image,
    weight,
    onAddToCart,
    isOrganic = true,
}) => {
    const hasDiscount = discountPrice && discountPrice < price;

    return (
        <Card 
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                bgcolor: 'white',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                transition: 'all 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(46,125,50,0.15)',
                    '& .product-image': { transform: 'scale(1.05)' }
                }
            }}
        >
            {/* Badges */}
            <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {hasDiscount && (
                    <Box sx={{ bgcolor: 'var(--pantry-sale)', color: 'white', px: 1, py: 0.25, borderRadius: '6px', fontWeight: 700, fontSize: '0.7rem' }}>
                        SALE
                    </Box>
                )}
                {isOrganic && (
                    <Box sx={{ bgcolor: 'var(--pantry-organic)', color: 'white', px: 1, py: 0.25, borderRadius: '6px', fontWeight: 700, fontSize: '0.7rem' }}>
                        ORGANIC
                    </Box>
                )}
            </Box>

            <Box sx={{ bgcolor: 'white', p: 2, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 180, overflow: 'hidden' }}>
                <CardMedia
                    className="product-image"
                    component="img"
                    image={image || 'https://via.placeholder.com/200'}
                    alt={name}
                    sx={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'contain',
                        transition: 'transform 0.3s ease',
                    }}
                    onError={(e: any) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
                <Box sx={{ display: 'none', width: '100%', height: '100%' }}>
                    <ProducePlaceholder />
                </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1, px: 2, pt: 1, pb: 2 }}>
                <Typography variant="body2" sx={{ color: 'var(--pantry-gray-400)', fontSize: '13px', mb: 0.5 }}>
                    {brand}
                </Typography>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        fontWeight: 500, 
                        fontSize: '15px', 
                        lineHeight: 1.2, 
                        mb: 0.5,
                        color: 'var(--pantry-gray-800)',
                        height: '2.4rem',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--pantry-gray-400)', display: 'block', mb: 1.5 }}>
                    {weight}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                    {hasDiscount ? (
                        <>
                            <Typography sx={{ fontWeight: 700, color: 'var(--pantry-sale)', fontSize: '1.1rem' }}>
                                ₹{discountPrice}
                            </Typography>
                            <Typography sx={{ textDecoration: 'line-through', color: 'var(--pantry-gray-400)', fontSize: '0.85rem' }}>
                                ₹{price}
                            </Typography>
                        </>
                    ) : (
                        <Typography sx={{ fontWeight: 700, color: 'var(--pantry-green-600)', fontSize: '1.1rem' }}>
                            ₹{price}
                        </Typography>
                    )}
                </Box>

                <Button 
                    fullWidth
                    variant="contained" 
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart();
                    }}
                    sx={{ 
                        bgcolor: 'var(--pantry-green-600)', 
                        color: 'white',
                        borderRadius: '24px',
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1,
                        '&:hover': {
                            bgcolor: 'var(--pantry-green-800)',
                            boxShadow: '0 4px 12px rgba(46,125,50,0.3)'
                        }
                    }}
                >
                    Add to cart
                </Button>
            </CardContent>
        </Card>
    );
};
