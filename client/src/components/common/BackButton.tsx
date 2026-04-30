import { Button } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ sx = {}, to }: { sx?: any; to?: string }) => {
    const navigate = useNavigate();

    return (
        <Button
            startIcon={<ArrowLeft size={18} />}
            onClick={() => to ? navigate(to) : navigate(-1)}
            sx={{
                mb: 3,
                color: 'text.secondary',
                textTransform: 'none',
                fontWeight: 600,
                padding: '6px 0',
                '&:hover': { bgcolor: 'transparent', color: 'primary.main' },
                ...sx
            }}
        >
            Back
        </Button>
    );
};

export default BackButton;
