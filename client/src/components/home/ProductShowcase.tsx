import { Box, Container, Typography, Grid, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../shop/ProductCard';
import { useGetProductsQuery } from '../../store/api/productApi';

const ProductShowcase = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useGetProductsQuery({ isFeatured: true, limit: 4 });
    const products = data?.data?.products || [];

    return (
        <Box sx={{ py: 10, bgcolor: '#fff' }} id="shop">
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 6 }}>
                    <Box>
                        <Typography variant="overline" color="secondary" fontWeight={700} sx={{ letterSpacing: 2 }}>
                            SHOP AYURVEDA
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            Best Selling Formulations
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ borderRadius: 2 }}
                        onClick={() => navigate('/shop')}
                    >
                        View All Products
                    </Button>
                </Box>

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={4}>
                        {products.length > 0 ? (
                            products.map((product: any) => (
                                <Grid item xs={12} sm={6} md={3} key={product._id || product.id}>
                                    <ProductCard product={product} />
                                </Grid>
                            ))
                        ) : (
                            <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                                <Typography variant="h6" color="text.secondary">No featured products found.</Typography>
                            </Box>
                        )}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default ProductShowcase;
