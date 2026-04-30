import { Box, Container } from '@mui/material';
import AboutSection from '@/components/home/AboutSection';
import GallerySection from '@/components/home/GallerySection';
import Testimonials from '@/components/home/Testimonials';
import BackButton from '@/components/common/BackButton';

const About = () => {
    return (
        <Box>
            <Box sx={{ pt: { xs: 2, md: 4 }, bgcolor: 'background.paper' }}>
                <Container maxWidth="xl">
                    <BackButton />
                </Container>
            </Box>
            <AboutSection />
            <GallerySection />
            <Testimonials />
        </Box>
    );
};

export default About;
