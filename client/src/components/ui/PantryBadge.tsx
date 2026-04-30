import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface PantryBadgeProps extends Omit<ChipProps, 'variant'> {
    variant?: 'success' | 'error' | 'warning' | 'info';
}

const StyledChip = styled(Chip, {
    shouldForwardProp: (prop) => prop !== 'pantryVariant',
})<{ pantryVariant: string }>(({ theme, pantryVariant }) => ({
    borderRadius: 6,
    height: 24,
    fontWeight: 600,
    fontSize: '0.75rem',
    ...(pantryVariant === 'success' && {
        backgroundColor: '#E8F5E9',
        color: '#2E7D32',
    }),
    ...(pantryVariant === 'error' && {
        backgroundColor: '#FFEBEE',
        color: '#C62828',
    }),
    ...(pantryVariant === 'warning' && {
        backgroundColor: '#FFF8E1',
        color: '#F9A825',
    }),
    ...(pantryVariant === 'info' && {
        backgroundColor: '#E3F2FD',
        color: '#1565C0',
    }),
}));

export const PantryBadge: React.FC<PantryBadgeProps> = ({ 
    label, 
    variant = 'info', 
    ...props 
}) => {
    return <StyledChip label={label} pantryVariant={variant} size="small" {...props} />;
};
