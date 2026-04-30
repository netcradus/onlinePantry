import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

interface PantryButtonProps extends Omit<ButtonProps, 'variant'> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    loading?: boolean;
}

const StyledButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== 'pantryVariant' && prop !== 'loading',
})<{ pantryVariant: string }>(({ theme, pantryVariant }) => ({
    borderRadius: 24,
    padding: '8px 24px',
    fontWeight: 600,
    boxShadow: 'none',
    '&:hover': {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    ...(pantryVariant === 'primary' && {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
    }),
    ...(pantryVariant === 'secondary' && {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
        },
    }),
    ...(pantryVariant === 'ghost' && {
        backgroundColor: 'transparent',
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    }),
    ...(pantryVariant === 'danger' && {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.error.dark,
        },
    }),
}));

export const PantryButton: React.FC<PantryButtonProps> = ({ 
    children, 
    variant = 'primary', 
    loading = false, 
    disabled, 
    ...props 
}) => {
    return (
        <StyledButton 
            pantryVariant={variant} 
            disabled={disabled || loading} 
            {...props}
        >
            {loading ? <CircularProgress size={24} color="inherit" /> : children}
        </StyledButton>
    );
};
