import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Chip } from '@mui/material';
import BackButton from '@/components/common/BackButton';

const blogs = [
    {
        title: "5 Ayurveda Tips for Better Digestion",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
        category: "Health",
        date: "Jan 28, 2024",
        excerpt: "Discover how simple dietary changes can improve your digestive fire (Agni) and overall health."
    },
    {
        title: "The Benefits of Shirodhara",
        image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=800",
        category: "Treatments",
        date: "Jan 25, 2024",
        excerpt: "Learn about the profound relaxing effects of Shirodhara treatment for stress and anxiety."
    },
    {
        title: "Managing Stress the Ayurvedic Way",
        image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=800",
        category: "Wellness",
        date: "Jan 20, 2024",
        excerpt: "Ancient wisdom for modern stress management through herbs, yoga, and meditation."
    }
];

const Blog = () => {
    return (
        <Box sx={{ py: 8, bgcolor: '#f8fafc' }}>
            <Container maxWidth="lg">
                <BackButton />
                <Typography variant="h3" textAlign="center" fontWeight={700} sx={{ mb: 2 }}>Latest from our Blog</Typography>
                <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
                    Insights on Ayurveda, Health, and Wellness
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
