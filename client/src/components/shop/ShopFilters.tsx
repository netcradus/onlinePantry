import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, FormGroup, Slider, Divider, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSearchQuery } from '../../store/api/searchApi';

interface ShopFiltersProps {
    filters: any;
    setFilters: (filters: any) => void;
}

const ShopFilters: React.FC<ShopFiltersProps> = ({ filters, setFilters }) => {
    // Fetch facets
    const { data: searchData } = useSearchQuery({});
    const facets = searchData?.data?.facets;

    const handleCategoryChange = (slug: string) => {
        setFilters((prev: any) => ({
            ...prev,
            category: prev.category === slug ? '' : slug
        }));
    };

    const handlePriceChange = (_event: Event, newValue: number | number[]) => {
        const [min, max] = newValue as number[];
        setFilters((prev: any) => ({ ...prev, min, max }));
    };

    const handleDietaryChange = (tag: string) => {
        setFilters((prev: any) => {
            const dietary = prev.dietary || [];
            if (dietary.includes(tag)) {
                return { ...prev, dietary: dietary.filter((t: string) => t !== tag) };
            }
            return { ...prev, dietary: [...dietary, tag] };
        });
    };

    const resetFilters = () => {
        setFilters({
            q: filters.q || '',
            category: '',
            min: 0,
            max: 2000,
            sort: 'relevance',
            dietary: []
        });
    };

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Filters</Typography>
                <Button 
                    size="small" 
                    onClick={resetFilters} 
                    sx={{ 
                        textTransform: 'none', 
                        fontWeight: 700,
                        color: 'error.main',
                        '&:hover': { bgcolor: '#fff1f2' }
                    }}
                >
                    Clear all
                </Button>
            </Box>

            {/* Category Filter */}
            <Box sx={{ mb: 5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>Category</Typography>
                <FormGroup>
                    {facets?.categories?.map((cat: any) => (
                        <FormControlLabel
                            key={cat.slug}
                            control={
                                <Checkbox 
                                    size="small" 
                                    checked={filters.category === cat.slug}
                                    onChange={() => handleCategoryChange(cat.slug)}
                                    sx={{ color: '#e2e8f0', '&.Mui-checked': { color: 'primary.main' } }}
                                />
                            }
                            label={<Typography sx={{ fontSize: '0.95rem', fontWeight: filters.category === cat.slug ? 700 : 500 }}>{cat.name}</Typography>}
                        />
                    ))}
                </FormGroup>
            </Box>

            <Divider sx={{ my: 4, borderColor: '#f1f5f9' }} />

            {/* Price Filter */}
            <Box sx={{ mb: 5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3, color: 'text.primary' }}>Price Range</Typography>
                <Box sx={{ px: 1 }}>
                    <Slider
                        value={[Number(filters.min) || 0, Number(filters.max) || 2000]}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={2000}
                        size="medium"
                        sx={{
                            color: 'primary.main',
                            '& .MuiSlider-thumb': {
                                width: 20,
                                height: 20,
                                bgcolor: 'white',
                                border: '2px solid currentColor',
                                '&:hover': { boxShadow: '0 0 0 8px rgba(5, 150, 105, 0.1)' }
                            },
                            '& .MuiSlider-track': { height: 6 },
                            '& .MuiSlider-rail': { height: 6, opacity: 1, bgcolor: '#f1f5f9' }
                        }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'text.secondary' }}>₹{filters.min || 0}</Typography>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'text.secondary' }}>₹{filters.max || 2000}</Typography>
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ my: 4, borderColor: '#f1f5f9' }} />

            {/* Dietary Filter */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>Dietary Needs</Typography>
                <FormGroup>
                    {facets?.dietary?.map((tag: string) => (
                        <FormControlLabel
                            key={tag}
                            control={
                                <Checkbox 
                                    size="small" 
                                    checked={filters.dietary?.includes(tag)}
                                    onChange={() => handleDietaryChange(tag)}
                                    sx={{ color: '#e2e8f0', '&.Mui-checked': { color: 'primary.main' } }}
                                />
                            }
                            label={<Typography sx={{ fontSize: '0.95rem', fontWeight: filters.dietary?.includes(tag) ? 700 : 500 }}>{tag}</Typography>}
                        />
                    ))}
                </FormGroup>
            </Box>
        </Box>
    );
};

export default ShopFilters;
