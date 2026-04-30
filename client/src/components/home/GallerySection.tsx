import { Box, Container, Typography, ImageList, ImageListItem } from '@mui/material';

const itemData = [
    {
        img: 'https://images.unsplash.com/photo-1540429235282-eeb7a49938c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=737&q=80',
        title: 'Therapy Room',
        rows: 2,
        cols: 2,
    },
    {
        img: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        title: 'Consultation',
    },
    {
        img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        title: 'Herbs Preparation',
    },
    {
        img: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        title: 'Products',
        cols: 2,
    },
    {
        img: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        title: 'Massage',
        cols: 2,
    },
    {
        img: 'https://images.unsplash.com/photo-1519781542704-957ff19aa32e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        title: 'Aroma Therapy',
        rows: 2,
        cols: 2,
    },
];

function srcset(image: string, size: number, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${size * cols}&h=${size * rows
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
                        Inside Rhichik Ayurveda
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
