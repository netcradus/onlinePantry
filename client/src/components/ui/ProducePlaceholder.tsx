import React from 'react';
import { Box } from '@mui/material';
import { Leaf } from 'lucide-react';

export const ProducePlaceholder: React.FC = () => {
    return (
        <Box 
            sx={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: 'var(--pantry-green-50)',
                borderRadius: 4
            }}
        >
            <Box sx={{ color: 'var(--pantry-green-400)', opacity: 0.6 }}>
                <Leaf size={40} />
            </Box>
        </Box>
    );
};
