import { Box, Container } from '@mui/material';
import ContactSection from '@/components/home/ContactSection';
import FAQSection from '@/components/home/FAQSection';
import BackButton from '@/components/common/BackButton';

const Contact = () => {
    return (
        <Box>
            <Box sx={{ pt: { xs: 2, md: 4 }, bgcolor: 'background.paper' }}>
                <Container maxWidth="xl">
                    <BackButton />
                </Container>
            </Box>
            <ContactSection />
            <FAQSection />
        </Box>
    );
};

export default Contact;
