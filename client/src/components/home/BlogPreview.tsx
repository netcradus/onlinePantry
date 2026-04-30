import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button, Chip, Stack } from '@mui/material';
import { Calendar, User, ArrowRight } from 'lucide-react';

const blogs = [
    {
        id: 1,
        title: "5 Ayurvedic Tips for Better Sleep",
        author: "Dr. Rhichik",
        date: "Oct 12, 2023",
        category: "Lifestyle",
        image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        excerpt: "Discover how ancient Ayurvedic practices can help you achieve deep and restorative sleep naturally."
    },
    {
        id: 2,
        title: "Understanding Your Dosha Type",
        author: "Dr. Rhichik",
        date: "Sep 28, 2023",
        category: "Education",
        image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        excerpt: "Learn about Vata, Pitta, and Kapha doshas and how to balance them for optimal health."
    },
    {
        id: 3,
        title: "Benefits of Copper Water",
        author: "Dr. Rhichik",
        date: "Sep 15, 2023",
        category: "Nutrition",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=684&q=80",
        excerpt: "Drinking water stored in copper vessels can have amazing health benefits. Here is why."
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
                            Health Insights
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
