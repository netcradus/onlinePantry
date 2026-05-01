import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Chip } from '@mui/material';
import BackButton from '@/components/common/BackButton';

const blogs = [
    {
        title: "The Ultimate Guide to Sustainable Eating",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
        category: "Sustainability",
        date: "May 10, 2026",
        excerpt: "Discover how small changes in your grocery shopping can make a big impact on the environment."
    },
    {
        title: "Why Organic Produce is Worth the Switch",
        image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=800",
        category: "Organic",
        date: "May 05, 2026",
        excerpt: "Learn about the health and environmental benefits of choosing certified organic fruits and vegetables."
    },
    {
        title: "10 Pantry Staples for Healthy Weeknight Meals",
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800",
        category: "Nutrition",
        date: "May 01, 2026",
        excerpt: "Keep these items in your pantry to whip up delicious and nutritious meals in no time."
    }
];

const Blog = () => {
    return (
        <Box sx={{ py: 8, bgcolor: '#f8fafc' }}>
            <Container maxWidth="lg">
                <BackButton />
                <Typography variant="h3" textAlign="center" fontWeight={700} sx={{ mb: 2 }}>Latest from our Blog</Typography>
                <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
                    Insights on Freshness, Sustainability, and Quality
                </Typography>
                <Grid container spacing={4}>
                    {blogs.map((blog, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card sx={{ borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={blog.image}
                                    alt={blog.title}
                                />
                                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Chip label={blog.category} size="small" color="secondary" variant="outlined" />
                                        <Typography variant="caption" color="text.secondary">{blog.date}</Typography>
                                    </Box>
                                    <Typography variant="h5" fontWeight={700} gutterBottom>
                                        {blog.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {blog.excerpt}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Blog;
