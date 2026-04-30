import React from 'react';
import { Box, Paper, Skeleton, Stack } from '@mui/material';

export const CardSkeleton: React.FC = () => {
    return (
        <Paper 
            elevation={0} 
            sx={{ 
                borderRadius: 4, 
                p: 2, 
                height: '100%', 
                border: '1px solid var(--pantry-gray-100)',
                overflow: 'hidden'
            }}
        >
            <Box sx={{ position: 'relative', pt: '100%', mb: 2 }}>
                <Skeleton 
                    variant="rectangular" 
                    sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%',
                        borderRadius: 2,
                        bgcolor: 'var(--pantry-green-50)',
                        '&::after': {
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
                        }
                    }} 
                    animation="wave" 
                />
            </Box>
            <Stack spacing={1}>
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="90%" height={24} />
                <Skeleton variant="text" width="40%" height={16} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Skeleton variant="text" width="30%" height={32} />
                    <Skeleton variant="circular" width={40} height={40} />
                </Box>
            </Stack>
        </Paper>
    );
};
