import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, Stack, Divider, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PantryButton } from '../components/ui/PantryButton';
import { PantryCard } from '../components/ui/PantryCard';
import { useGetProductsQuery } from '../store/api/productApi';
import { useGetRecipesQuery } from '../store/api/recipesApi';
import { useAddToCartMutation } from '../store/api/cartApi';
import { Truck, ShieldCheck, Leaf, Star, ArrowRight, Clock, Users } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const [addToCart] = useAddToCartMutation();
    const [activeSlide, setActiveSlide] = useState(0);

    const { data: featuredProducts } = useGetProductsQuery({ limit: 8, isFeatured: true });
    const { data: deals } = useGetProductsQuery({ limit: 8, sort: 'price_asc' });
    const { data: recipes } = useGetRecipesQuery({ limit: 3 });

    const featuredList = featuredProducts?.data?.products || [];
    const dealsList = deals?.data?.products || [];
    const recipesList = recipes?.data?.data || [];

    const slides = [
        {
            image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=1600&q=85',
            eyebrow: 'FARM TO DOORSTEP',
            title: 'Fresh. Organic.\nDelivered Today.',
            subtitle: 'The King of Fruits is Here. Experience the juiciest, hand-picked mangoes from certified organic farms.',
            cta: 'Shop Mangoes'
        },
        {
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600&q=85',
            eyebrow: 'DAILY HARVEST',
            title: '500+ Fresh\nVegetables Daily',
            subtitle: 'Crisp, colorful, and bursting with nutrients. We source directly from local farmers every morning.',
            cta: 'Shop Vegetables'
        },
        {
            image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=1600&q=85',
            eyebrow: 'QUICK & CRISP',
            title: 'Cool. Clean.\nDelivered in 2hrs.',
            subtitle: 'Crisp cucumbers and leafy greens, chilled and delivered to maintain maximum freshness.',
            cta: 'Explore Fresh'
        }
    ];

    const categories = [
        { name: 'Fruits', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80', query: 'fruits' },
        { name: 'Vegetables', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', query: 'vegetables' },
        { name: 'Meat', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80', query: 'meat' },
        { name: 'Dairy', image: 'https://images.unsplash.com/photo-1563636619-e9107daaf182?w=400&q=80', query: 'dairy' },
        { name: 'Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80', query: 'bakery' },
        { name: 'Frozen', image: 'https://images.unsplash.com/photo-1584263343327-4479f824cca6?w=400&q=80', query: 'frozen' },
        { name: 'Drinks', image: 'https://images.unsplash.com/photo-1613478223719-2ab80260f45c?w=400&q=80', query: 'drinks' },
        { name: 'Organic', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80', query: 'organic' }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleAddToCart = async (productId: string) => {
        try {
            await addToCart({ productId, quantity: 1 }).unwrap();
        } catch (err) {
            console.error("Failed to add to cart", err);
        }
    };

    return (
        <Box sx={{ pb: 0, bgcolor: 'var(--pantry-cream)' }}>
            {/* 2. HERO CAROUSEL */}
            <Box sx={{ position: 'relative', height: { xs: 400, md: 600 }, overflow: 'hidden' }}>
                {slides.map((slide, index) => (
                    <Box
                        key={index}
                        sx={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            opacity: activeSlide === index ? 1 : 0,
                            transition: 'opacity 0.6s ease-in-out',
                            zIndex: activeSlide === index ? 1 : 0,
                        }}
                    >
                        <Box
                            component="img"
                            src={slide.image}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                        <Box sx={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, transparent 70%)',
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <Container maxWidth="xl">
                                <Box sx={{ maxWidth: 600, color: 'white', px: { xs: 2, md: 0 } }}>
                                    <Typography sx={{ 
                                        color: 'var(--pantry-amber-400)', 
                                        fontWeight: 600, 
                                        fontSize: '13px', 
                                        letterSpacing: 2,
                                        textTransform: 'uppercase',
                                        mb: 2 
                                    }}>
                                        {slide.eyebrow}
                                    </Typography>
                                    <Typography variant="h1" sx={{ 
                                        color: 'white', 
                                        fontWeight: 800, 
                                        fontSize: { xs: '36px', md: '64px' },
                                        lineHeight: 1.1,
                                        whiteSpace: 'pre-line',
                                        mb: 3
                                    }}>
                                        {slide.title}
                                    </Typography>
                                    <Typography sx={{ 
                                        fontSize: '18px', 
                                        color: 'rgba(255,255,255,0.85)',
                                        mb: 4,
                                        lineHeight: 1.6,
                                        display: { xs: 'none', md: 'block' }
                                    }}>
                                        {slide.subtitle}
                                    </Typography>
                                    <Stack direction="row" spacing={3} alignItems="center">
                                        <PantryButton 
                                            variant="primary" 
                                            sx={{ 
                                                bgcolor: 'var(--pantry-amber-600)', 
                                                color: 'var(--pantry-gray-800)',
                                                fontWeight: 700,
                                                px: 5,
                                                py: 1.5,
                                                borderRadius: '24px',
                                                fontSize: '16px',
                                                '&:hover': { bgcolor: 'var(--pantry-amber-400)', boxShadow: '0 4px 20px rgba(249,168,37,0.4)' }
                                            }}
                                            onClick={() => navigate('/shop')}
                                        >
                                            {slide.cta}
                                        </PantryButton>
                                        <Typography 
                                            onClick={() => navigate('/shop')}
                                            sx={{ 
                                                color: 'white', 
                                                textDecoration: 'underline', 
                                                cursor: 'pointer',
                                                fontWeight: 600
                                            }}
                                        >
                                            See all deals &rarr;
                                        </Typography>
                                    </Stack>
                                </Box>
                            </Container>
                        </Box>
                    </Box>
                ))}
                
                {/* Dot Indicators */}
                <Stack 
                    direction="row" 
                    spacing={1} 
                    sx={{ 
                        position: 'absolute', 
                        bottom: 30, 
                        left: '50%', 
                        transform: 'translateX(-50%)', 
                        zIndex: 2 
                    }}
                >
                    {slides.map((_, i) => (
                        <Box
                            key={i}
                            onClick={() => setActiveSlide(i)}
                            sx={{
                                width: activeSlide === i ? 24 : 8,
                                height: 8,
                                borderRadius: 4,
                                bgcolor: activeSlide === i ? 'var(--pantry-green-600)' : 'rgba(255,255,255,0.5)',
                                cursor: 'pointer',
                                transition: '0.3s'
                            }}
                        />
                    ))}
                </Stack>
            </Box>

            {/* 3. CATEGORY STRIP */}
            <Container maxWidth="xl" sx={{ py: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>Shop by Category</Typography>
                <Box sx={{ 
                    display: 'flex', 
                    overflowX: 'auto', 
                    gap: 4, 
                    pb: 2, 
                    px: 1,
                    justifyContent: { md: 'center' },
                    '&::-webkit-scrollbar': { display: 'none' }
                }}>
                    {categories.map((cat) => (
                        <Box 
                            key={cat.name} 
                            onClick={() => navigate(`/shop?category=${cat.query}`)}
                            sx={{ 
                                textAlign: 'center', 
                                cursor: 'pointer',
                                minWidth: 100,
                                '&:hover': {
                                    '& .cat-img': { transform: 'scale(1.06)', borderColor: 'var(--pantry-amber-600)' }
                                }
                            }}
                        >
                            <Box 
                                className="cat-img"
                                sx={{ 
                                    width: { xs: 80, md: 100 }, 
                                    height: { xs: 80, md: 100 }, 
                                    borderRadius: '50%', 
                                    border: '3px solid var(--pantry-green-600)',
                                    p: '4px',
                                    mb: 1.5,
                                    transition: '0.3s',
                                    mx: 'auto'
                                }}
                            >
                                <Box 
                                    component="img" 
                                    src={cat.image} 
                                    sx={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        borderRadius: '50%', 
                                        objectFit: 'cover' 
                                    }} 
                                />
                            </Box>
                            <Typography sx={{ fontWeight: 600, fontSize: '13px' }}>{cat.name}</Typography>
                        </Box>
                    ))}
                </Box>
            </Container>

            {/* 4. FEATURED BANNER PAIR */}
            <Container maxWidth="xl" sx={{ mb: 8 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={7.2}>
                        <Box sx={{ 
                            height: { xs: 300, md: 400 },
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            p: { xs: 4, md: 8 }
                        }}>
                            <Box sx={{ maxWidth: 300, zIndex: 1 }}>
                                <Typography variant="h2" sx={{ color: 'var(--pantry-green-800)', fontWeight: 800, mb: 2, fontSize: { xs: '28px', md: '42px' } }}>
                                    Mango Season is Here
                                </Typography>
                                <PantryButton 
                                    variant="primary" 
                                    sx={{ bgcolor: 'var(--pantry-green-600)', px: 4, borderRadius: '24px' }}
                                    onClick={() => navigate('/shop?category=fruits')}
                                >
                                    Shop Mangoes
                                </PantryButton>
                            </Box>
                            <Box 
                                component="img" 
                                src="https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80" 
                                sx={{ 
                                    position: 'absolute', 
                                    right: -20, 
                                    bottom: -20, 
                                    height: '110%', 
                                    width: '60%', 
                                    objectFit: 'contain' 
                                }} 
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4.8}>
                        <Box sx={{ 
                            height: { xs: 300, md: 400 },
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #FFF8E1, #FFF3CD)',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            p: { xs: 4, md: 6 }
                        }}>
                            <Box sx={{ maxWidth: 200, zIndex: 1 }}>
                                <Typography variant="h3" sx={{ color: 'var(--pantry-amber-800)', fontWeight: 800, mb: 2 }}>
                                    Cool & Crisp Vegetables
                                </Typography>
                                <PantryButton 
                                    variant="primary" 
                                    sx={{ bgcolor: 'var(--pantry-amber-600)', color: 'var(--pantry-gray-800)', px: 4, borderRadius: '24px' }}
                                    onClick={() => navigate('/shop?category=vegetables')}
                                >
                                    Shop Now
                                </PantryButton>
                            </Box>
                            <Box 
                                component="img" 
                                src="https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=600&q=80" 
                                sx={{ 
                                    position: 'absolute', 
                                    right: -40, 
                                    top: 40, 
                                    height: '80%', 
                                    width: '70%', 
                                    objectFit: 'contain',
                                    transform: 'rotate(15deg)'
                                }} 
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* 5. TODAY'S DEALS */}
            <Box sx={{ py: 8, background: 'linear-gradient(135deg, #F0FAF0 0%, #FAFAF8 100%)' }}>
                <Container maxWidth="xl">
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'flex-end' }} sx={{ mb: 4, gap: 2 }}>
                        <Box>
                            <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>Today's Deals</Typography>
                            <Typography variant="body1" color="text.secondary">Limited time — while stocks last</Typography>
                        </Box>
                        <Typography 
                            onClick={() => navigate('/shop?offers=true')}
                            sx={{ color: 'var(--pantry-green-600)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            View all &rarr;
                        </Typography>
                    </Stack>
                    <Grid container spacing={3}>
                        {dealsList.map((product: any) => (
                            <Grid item xs={6} sm={4} md={3} key={product._id}>
                                <PantryCard
                                    id={product._id}
                                    name={product.name}
                                    brand={product.brand}
                                    price={product.price}
                                    discountPrice={product.discountPrice}
                                    image={product.images?.[0]}
                                    weight={product.weight}
                                    onAddToCart={() => handleAddToCart(product._id)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* 6. PRODUCE DIVIDER STRIP */}
            <Box sx={{ 
                height: 180, 
                position: 'relative', 
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Box 
                    component="img" 
                    src="https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=1600&q=80" 
                    sx={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <Box sx={{ 
                    position: 'absolute', 
                    top: 0, left: 0, right: 0, bottom: 0, 
                    bgcolor: 'rgba(27, 94, 32, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2
                }}>
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            color: 'white', 
                            fontWeight: 700, 
                            textAlign: 'center',
                            fontSize: { xs: '20px', md: '28px' }
                        }}
                    >
                        Grown Fresh. Picked Today. At Your Door Tomorrow.
                    </Typography>
                </Box>
            </Box>

            {/* 7. TRENDING RECIPES */}
            <Container maxWidth="xl" sx={{ py: 8 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 4, gap: 2 }}>
                    <Typography variant="h2" sx={{ fontWeight: 800 }}>Trending Recipes</Typography>
                    <Typography 
                        onClick={() => navigate('/recipes')}
                        sx={{ color: 'var(--pantry-green-600)', fontWeight: 700, cursor: 'pointer' }}
                    >
                        More Recipes &rarr;
                    </Typography>
                </Stack>
                <Grid container spacing={4}>
                    {recipesList.map((recipe: any) => (
                        <Grid item xs={12} md={4} key={recipe._id}>
                            <Paper
                                elevation={0}
                                sx={{ 
                                    borderRadius: '16px', 
                                    overflow: 'hidden', 
                                    bgcolor: 'white',
                                    border: '1px solid var(--pantry-gray-100)',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        '& .recipe-img': { transform: 'scale(1.05)' }
                                    }
                                }}
                                onClick={() => navigate(`/recipes/${recipe.slug}`)}
                            >
                                <Box sx={{ height: 200, overflow: 'hidden' }}>
                                    <Box 
                                        className="recipe-img"
                                        component="img" 
                                        src={recipe.heroImage} 
                                        sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.3s' }} 
                                    />
                                </Box>
                                <Box sx={{ p: 3 }}>
                                    <Chip 
                                        label={recipe.category || 'Healthy'} 
                                        size="small" 
                                        sx={{ bgcolor: 'var(--pantry-green-50)', color: 'var(--pantry-green-600)', fontWeight: 700, mb: 1.5 }} 
                                    />
                                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>{recipe.title}</Typography>
                                    <Stack direction="row" spacing={3} color="text.secondary">
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Clock size={16} />
                                            <Typography variant="caption">{recipe.prepTime + recipe.cookTime} mins</Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Users size={16} />
                                            <Typography variant="caption">{recipe.servings} servings</Typography>
                                        </Stack>
                                    </Stack>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* 8. TRUST BAR */}
            <Box sx={{ bgcolor: 'var(--pantry-green-600)', color: 'white', py: 6 }}>
                <Container maxWidth="xl">
                    <Grid container spacing={4}>
                        {[
                            { icon: <Truck size={28} />, title: 'Free Delivery', sub: 'On orders above £15' },
                            { icon: <Leaf size={28} />, title: '100% Organic', sub: 'Sourced from certified farms' },
                            { icon: <ShieldCheck size={28} />, title: 'Fresh Guarantee', sub: 'Or your money back' },
                            { icon: <Star size={28} />, title: 'Secure Checkout', sub: '256-bit encrypted' }
                        ].map((pillar, i) => (
                            <Grid item xs={6} md={3} key={i}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" textAlign={{ xs: 'center', sm: 'left' }}>
                                    <Box sx={{ color: 'white' }}>{pillar.icon}</Box>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{pillar.title}</Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>{pillar.sub}</Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default Home;
