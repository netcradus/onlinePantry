import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button, Chip, Stack } from '@mui/material';
import { Calendar, User, ArrowRight } from 'lucide-react';

const blogs = [
    {
        id: 1,
        title: "How to Choose the Freshest Seasonal Produce",
        author: "Pantry Expert",
        date: "May 12, 2026",
        category: "Tips",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        excerpt: "Learn the secrets to picking the most vibrant fruits and vegetables every time you shop."
    },
    {
        id: 2,
        title: "The Benefits of Support Local Organic Farms",
        author: "Sustainability Team",
        date: "May 08, 2026",
        category: "Organic",
        image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        excerpt: "Why choosing locally sourced organic produce is better for you and the planet."
    },
    {
        id: 3,
        title: "5 Quick & Healthy Recipes for Busy Weeknights",
        author: "Chef Emma",
        date: "May 05, 2026",
        category: "Recipes",
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        excerpt: "Delicious and nutritious meals you can prepare in under 20 minutes using pantry staples."
    }
];

const BlogPreview = () => {
    return (
        <Box sx={{ py: 10, bgcolor: '#fff' }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 6 }}>
                    <Box>
                        <Typography variant="overline" color="secondary" fontWeight={700} sx={{ letterSpacing: 2 }}>
                            LATEST ARTICLES
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            Pantry Insights
                        </Typography>
                    </Box>
                    <Button variant="outlined" color="primary" sx={{ borderRadius: 2 }}>
                        Read More Articles
                    </Button>
                </Box>

                <Grid container spacing={4}>
                    {blogs.map((blog) => (
                        <Grid item xs={12} md={4} key={blog.id}>
                            <Card sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 3,
                                boxShadow: 2,
                                transition: '0.3s',
                                '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
                            }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={blog.image}
                                    alt={blog.title}
                                />
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ mb: 2 }}>
                                        <Chip label={blog.category} size="small" color="primary" variant="outlined" sx={{ mr: 1 }} />
                                    </Box>
                                    <Typography variant="h5" fontWeight={700} gutterBottom sx={{ lineHeight: 1.3 }}>
                                        {blog.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {blog.excerpt}
                                    </Typography>

                                    <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'text.secondary' }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <User size={14} />
                                                <Typography variant="caption">{blog.author}</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <Calendar size={14} />
                                                <Typography variant="caption">{blog.date}</Typography>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default BlogPreview;
