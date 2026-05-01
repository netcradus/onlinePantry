import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: "How long does delivery take?",
        answer: "We offer same-day delivery across London for orders placed before 1 PM. Standard delivery typically takes 24-48 hours within the UK."
    },
    {
        question: "Are your products organic?",
        answer: "Many of our products are certified organic. Look for the 'Organic' badge on product pages to identify them. We source directly from farms that prioritize sustainable and natural practices."
    },
    {
        question: "Is there a minimum order for free delivery?",
        answer: "Yes, we offer free delivery on all orders over £15. For orders below this amount, a small delivery fee of £2.50 applies."
    },
    {
        question: "Can I track my order in real-time?",
        answer: "Absolutely! Once your order is dispatched, you'll receive a tracking link via SMS and Email. You can also view live updates in your 'Order History' section."
    },
    {
        question: "What is your return policy for fresh produce?",
        answer: "We take pride in our quality. If any fresh item doesn't meet your expectations, please contact us within 4 hours of delivery, and we will issue a full refund or replacement, no questions asked."
    }
];

const FAQSection = () => {
    return (
        <Box sx={{ py: 10, bgcolor: '#fff' }}>
            <Container maxWidth="md">
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="overline" color="secondary" fontWeight={700} sx={{ letterSpacing: 2 }}>
                        FAQS
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                        Frequently Asked Questions
                    </Typography>
                </Box>

                {faqs.map((faq, index) => (
                    <Accordion key={index} elevation={0} sx={{
                        mb: 2,
                        border: '1px solid #eee',
                        borderRadius: '8px !important',
                        '&:before': { display: 'none' }
                    }}>
                        <AccordionSummary
                            expandIcon={<ChevronDown color="#F26F21" />}
                            aria-controls={`panel${index}-content`}
                            id={`panel${index}-header`}
                            sx={{ py: 1 }}
                        >
                            <Typography variant="h6" fontWeight={600} sx={{ color: 'text.primary' }}>
                                {faq.question}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography color="text.secondary">
                                {faq.answer}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Container>
        </Box>
    );
};

export default FAQSection;
