import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: "What is Ayurveda and how does it work?",
        answer: "Ayurveda is a 5,000-year-old system of natural healing that originated in India. It works by balancing the three doshas (Vata, Pitta, Kapha) in the body through diet, lifestyle, herbs, and therapies to promote overall health and prevent disease."
    },
    {
        question: "Are Ayurvedic medicines safe?",
        answer: "Yes, our Ayurvedic formulations are made from 100% natural herbs and are free from harmful chemicals. However, it is always recommended to consult with our qualified doctors before starting any medication."
    },
    {
        question: "What should I expect during my first consultation?",
        answer: "During your first consultation, the doctor will conduct a detailed examination (Nadi Pariksha) to understand your body constitution (Prakriti) and identify any imbalances. Based on this, a personalized treatment plan including diet, lifestyle changes, and medicines will be prescribed."
    },
    {
        question: "How long does it take to see results?",
        answer: "The time to see results varies depending on the severity and duration of the condition. While some acute conditions may resolve in a few days, chronic issues may take several weeks or months to show significant improvement. Patience and consistency are key in Ayurveda."
    },
    {
        question: "Do you offer online consultations?",
        answer: "Yes, we offer online video consultations for patients who cannot visit our clinic physically. You can book an appointment through our website."
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
