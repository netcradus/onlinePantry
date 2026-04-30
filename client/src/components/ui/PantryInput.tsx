import React from 'react';
import { TextField, TextFieldProps, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface PantryInputProps extends Omit<TextFieldProps, 'variant'> {
    onClear?: () => void;
    showSearchIcon?: boolean;
}

export const PantryInput: React.FC<PantryInputProps> = ({
    onClear,
    showSearchIcon = false,
    value,
    ...props
}) => {
    return (
        <TextField
            {...props}
            value={value}
            variant="outlined"
            size="small"
            InputProps={{
                startAdornment: showSearchIcon ? (
                    <InputAdornment position="start">
                        <SearchIcon color="action" fontSize="small" />
                    </InputAdornment>
                ) : null,
                endAdornment: value && onClear ? (
                    <InputAdornment position="end">
                        <IconButton size="small" onClick={onClear}>
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    </InputAdornment>
                ) : null,
                sx: { borderRadius: 1 }
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    '& fieldset': {
                        borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                        borderColor: 'primary.main',
                    },
                },
            }}
        />
    );
};
