import { Box, Container, Typography, ImageList, ImageListItem } from '@mui/material';

const itemData = [
    {
        img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
        title: 'Fresh Produce',
        rows: 2,
        cols: 2,
    },
    {
        img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80',
        title: 'Local Farm',
    },
    {
        img: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&q=80',
        title: 'Organic Selection',
    },
    {
        img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
        title: 'Premium Goods',
        cols: 2,
    },
    {
        img: 'https://images.unsplash.com/photo-1601599561234-830227360341?w=800&q=80',
        title: 'Same Day Delivery',
        cols: 2,
    },
    {
        img: 'https://images.unsplash.com/photo-1604719312563-8912e9223c6a?w=800&q=80',
        title: 'Modern Pantry',
        rows: 2,
        cols: 2,
    },
];

function srcset(image: string, size: number, rows = 1, cols = 1) {
    return {
        src: `${image}&w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
        srcSet: `${image}&w=${size * cols}&h=${size * rows
            }&fit=crop&auto=format&dpr=2 2x`,
    };
}

const GallerySection = () => {
    return (
        <Box sx={{ py: 10, bgcolor: '#F3F6EF' }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="overline" color="secondary" fontWeight={700} sx={{ letterSpacing: 2 }}>
                        GALLERY
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                        The OnlinePantry Experience
                    </Typography>
                </Box>
                <ImageList
                    variant="quilted"
                    cols={4}
                    rowHeight={121}
                    gap={16}
                >
                    {itemData.map((item) => (
                        <ImageListItem key={item.img} cols={item.cols || 1} rows={item.rows || 1}>
                            <img
                                {...srcset(item.img, 121, item.rows, item.cols)}
                                alt={item.title}
                                loading="lazy"
                                style={{ borderRadius: '12px' }}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </Container>
        </Box>
    );
};

export default GallerySection;
