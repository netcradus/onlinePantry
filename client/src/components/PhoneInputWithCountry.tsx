import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, ClickAwayListener } from '@mui/material';

// Flags SVGs (Extracted from user request)
const Flags = {
    US: (
        <svg className="w-4 h-4 me-1.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20, marginRight: 8 }}>
            <path d="M8.00013 14.6666C11.6821 14.6666 14.667 11.6818 14.667 7.99992C14.667 4.31802 11.6821 1.33325 8.00013 1.33325C4.31811 1.33325 1.33325 4.31802 1.33325 7.99992C1.33325 11.6818 4.31811 14.6666 8.00013 14.6666Z" fill="white" />
            <path d="M7.71167 7.99975H14.6678C14.6678 7.39807 14.5876 6.8152 14.4382 6.26074H7.71167V7.99975Z" fill="#D80027" />
            <path d="M7.71167 4.52172H13.6894C13.2813 3.85583 12.7596 3.26726 12.1512 2.78271H7.71167V4.52172Z" fill="#D80027" />
            <path d="M8.00053 14.6667C9.56944 14.6667 11.0115 14.1244 12.1502 13.2175H3.85083C4.98958 14.1244 6.43162 14.6667 8.00053 14.6667Z" fill="#D80027" />
            <path d="M2.31233 11.4784H13.689C14.0167 10.9438 14.2708 10.3594 14.4379 9.73926H1.56348C1.73059 10.3594 1.98469 10.9438 2.31233 11.4784V11.4784Z" fill="#D80027" />
            <path d="M4.42123 2.37426H5.02873L4.46365 2.78478L4.6795 3.44902L4.11445 3.03851L3.5494 3.44902L3.73584 2.87519C3.23832 3.28961 2.80224 3.77514 2.44289 4.31614H2.63754L2.27784 4.57745C2.2218 4.67093 2.16806 4.7659 2.11655 4.86227L2.28831 5.3909L1.96786 5.15808C1.8882 5.32684 1.81534 5.49941 1.74985 5.67557L1.93908 6.25802H2.63754L2.07246 6.66853L2.28831 7.33278L1.72326 6.92226L1.38479 7.16818C1.35091 7.4405 1.33325 7.71788 1.33325 7.99939H7.9996C7.9996 4.31781 7.9996 3.88378 7.9996 1.33325C6.68268 1.33325 5.45506 1.71525 4.42123 2.37426V2.37426ZM4.6795 7.33278L4.11445 6.92226L3.5494 7.33278L3.76524 6.66853L3.20017 6.25802H3.89862L4.11445 5.59377L4.33027 6.25802H5.02873L4.46365 6.66853L4.6795 7.33278ZM4.46365 4.72666L4.6795 5.3909L4.11445 4.98039L3.5494 5.3909L3.76524 4.72666L3.20017 4.31614H3.89862L4.11445 3.6519L4.33027 4.31614H5.02873L4.46365 4.72666ZM7.07068 7.33278L6.50563 6.92226L5.94058 7.33278L6.15643 6.66853L5.59135 6.25802H6.28981L6.50563 5.59377L6.72146 6.25802H7.41991L6.85484 6.66853L7.07068 7.33278ZM6.85484 4.72666L7.07068 5.3909L6.50563 4.98039L5.94058 5.3909L6.15643 4.72666L5.59135 4.31614H6.28981L6.50563 3.6519L6.72146 4.31614H7.41991L6.85484 4.72666ZM6.85484 2.78478L7.07068 3.44902L6.50563 3.03851L5.94058 3.44902L6.15643 2.78478L5.59135 2.37426H6.28981L6.50563 1.71002L6.72146 2.37426H7.41991L6.85484 2.78478Z" fill="#1A47B8" />
        </svg>
    ),
    AU: (
        <svg className="w-4 h-4 me-1.5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20, marginRight: 8 }}>
            <path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" fill="white" />
            <path d="M3.05081 4.43384C2.46168 5.20033 2.01745 6.08378 1.75879 7.04352H5.66049L3.05081 4.43384Z" fill="#1A47B8" />
            <path d="M16.2415 7.04349C15.9828 6.08378 15.5386 5.20033 14.9495 4.43384L12.3398 7.04349H16.2415Z" fill="#1A47B8" />
            <path d="M1.75879 10.9567C2.01748 11.9164 2.46171 12.7998 3.05081 13.5663L5.6604 10.9567H1.75879Z" fill="#1A47B8" />
            <path d="M13.5677 3.05047C12.8012 2.46134 11.9178 2.01711 10.9581 1.75842V5.66009L13.5677 3.05047Z" fill="#1A47B8" />
            <path d="M4.43457 14.9497C5.20106 15.5388 6.08451 15.983 7.04422 16.2417V12.3401L4.43457 14.9497Z" fill="#1A47B8" />
            <path d="M7.04419 1.75842C6.08448 2.01711 5.20104 2.46134 4.43457 3.05044L7.04419 5.66006V1.75842Z" fill="#1A47B8" />
            <path d="M10.9581 16.2417C11.9178 15.983 12.8012 15.5388 13.5677 14.9497L10.9581 12.3401V16.2417Z" fill="#1A47B8" />
            <path d="M12.3398 10.9568L14.9495 13.5664C15.5386 12.8 15.9828 11.9165 16.2415 10.9568H12.3398Z" fill="#1A47B8" />
            <path d="M16.4365 8.02175H9.97831H9.97828V1.56349C9.65804 1.5218 9.33155 1.5 9 1.5C8.66839 1.5 8.34196 1.5218 8.02175 1.56349V8.02169V8.02172H1.56349C1.5218 8.34196 1.5 8.66845 1.5 9C1.5 9.33161 1.5218 9.65804 1.56349 9.97825H8.02169H8.02172V16.4365C8.34196 16.4782 8.66839 16.5 9 16.5C9.33155 16.5 9.65804 16.4782 9.97825 16.4365V9.97831V9.97828H16.4365C16.4782 9.65804 16.5 9.33161 16.5 9C16.5 8.66845 16.4782 8.34196 16.4365 8.02175Z" fill="#D80027" />
            <path d="M10.9556 10.9566L14.3023 14.3033C14.4563 14.1495 14.6031 13.9886 14.7432 13.8218L11.8779 10.9565H10.9556V10.9566Z" fill="#D80027" />
            <path d="M7.04405 10.9565H7.04399L3.69727 14.3033C3.85113 14.4572 4.012 14.604 4.17876 14.7441L7.04405 11.8788V10.9565Z" fill="#D80027" />
            <path d="M7.04299 7.0435V7.04344L3.69623 3.69666C3.5423 3.85052 3.39547 4.01139 3.25537 4.17815L6.12069 7.04347H7.04299V7.0435Z" fill="#D80027" />
            <path d="M10.9556 7.04363L14.3024 3.69681C14.1485 3.54289 13.9876 3.39605 13.8209 3.25598L10.9556 6.1213V7.04363Z" fill="#D80027" />
        </svg>
    ),
    UK: (
        <svg className="w-4 h-4 me-1.5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20, marginRight: 8 }}>
            <path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" fill="white" />
            <path d="M16.5012 9.00018C16.5012 5.77544 14.4659 3.02637 11.6099 1.96667V16.0337C14.4659 14.974 16.5012 12.2249 16.5012 9.00018Z" fill="#D80027" />
            <path d="M1.5 8.99994C1.5 12.2247 3.53534 14.9737 6.39132 16.0334V1.96643C3.53534 3.02613 1.5 5.7752 1.5 8.99994Z" fill="#1A47B8" />
        </svg>
    ),
    FR: (
        <svg className="w-4 h-4 me-1.5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20, marginRight: 8 }}>
            <path d="M16.5012 9.00018C16.5012 5.77544 14.4659 3.02637 11.6099 1.96667V16.0337C14.4659 14.974 16.5012 12.2249 16.5012 9.00018Z" fill="#D80027" />
            <path d="M1.5 8.99994C1.5 12.2247 3.53534 14.9737 6.39132 16.0334V1.96643C3.53534 3.02613 1.5 5.7752 1.5 8.99994Z" fill="#1A47B8" />
        </svg>
    ),
    // Using Canada for IN fallback or generic since I don't have IN in snippet but will re-use US or Canada for structure and try to add IN later if needed.
    // Actually the user snippet had France and Canada.
    CA: (
        <svg className="w-4 h-4 me-1.5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20, marginRight: 8 }}>
            <path d="M9.00012 16.5C13.1423 16.5 16.5002 13.1421 16.5002 9C16.5002 4.85786 13.1423 1.5 9.00012 1.5C4.85792 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85792 16.5 9.00012 16.5Z" fill="white" />
            <path d="M16.5009 8.99956C16.5009 6.02627 14.7705 3.4572 12.2619 2.24414V15.7549C14.7705 14.5419 16.5009 11.9728 16.5009 8.99956Z" fill="#D80027" />
            <path d="M1.5 8.99955C1.5 11.9728 3.23035 14.5419 5.73897 15.755V2.24414C3.23035 3.4572 1.5 6.02627 1.5 8.99955Z" fill="#D80027" />
            <path d="M10.3031 9.9782L11.6073 9.32606L10.9552 9.00001V8.34787L9.65092 9.00001L10.3031 7.69573H9.65092L8.99877 6.71753L8.34662 7.69573H7.69447L8.34662 9.00001L7.04232 8.34787V9.00001L6.3902 9.32606L7.69447 9.9782L7.36841 10.6303H8.67271V11.6085H9.32483V10.6303H10.6291L10.3031 9.9782Z" fill="#D80027" />
        </svg>
    ),
    // Placeholder for India - Using US temporarily or drawing a simple tricolor circle if possible, but for now re-using US logic or just text + circle.
    IN: (
        // Simple Circle for IN as placeholder if user didn't provide it
        <svg className="w-4 h-4 me-1.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20, marginRight: 8 }}>
            <circle cx="8" cy="8" r="8" fill="#FF9933" />
            <circle cx="8" cy="8" r="5" fill="#FFFFFF" />
            <circle cx="8" cy="8" r="2" fill="#138808" />
        </svg>
    )
};

const countries = [
    { code: "+91", name: "India", id: "IN", flag: Flags.IN },
    { code: "+1", name: "United States", id: "US", flag: Flags.US },
    { code: "+1", name: "Canada", id: "CA", flag: Flags.CA },
    { code: "+44", name: "United Kingdom", id: "UK", flag: Flags.UK },
    { code: "+61", name: "Australia", id: "AU", flag: Flags.AU },
    { code: "+33", name: "France", id: "FR", flag: Flags.FR },
    { code: "+971", name: "UAE", id: "AE", flag: Flags.US }, // Fallback flag
];

interface PhoneInputProps {
    countryCode: string;
    setCountryCode: (code: string) => void;
    phoneNumber: string;
    setPhoneNumber: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhoneInputWithCountry: React.FC<PhoneInputProps> = ({ countryCode, setCountryCode, phoneNumber, setPhoneNumber }) => {
    const [isOpen, setIsOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);
    const selectedCountry = countries.find(c => c.code === countryCode) || countries[0];

    const handleClickOutside = () => {
        setIsOpen(false);
    };

    return (
        <ClickAwayListener onClickAway={handleClickOutside}>
            <Box sx={{ position: 'relative', width: '100%', mb: 3 }}>
                <Box sx={{ display: 'flex', border: '1px solid #d1d5db', borderRadius: 1.5, overflow: 'hidden', ':focus-within': { ring: 2, ringColor: '#1A56DB', borderColor: '#1A56DB' } }}>
                    {/* Dropdown Button */}
                    <Box
                        component="button"
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        ref={anchorRef}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexShrink: 0,
                            zIndex: 10,
                            bgcolor: '#f3f4f6',
                            borderRight: '1px solid #d1d5db',
                            px: 2,
                            py: 1.5,
                            cursor: 'pointer',
                            outline: 'none',
                            border: 'none',
                            color: '#374151',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            '&:hover': { bgcolor: '#e5e7eb' }
                        }}
                    >
                        {selectedCountry.flag}
                        {selectedCountry.code}
                        <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6" style={{ width: 10, height: 6, marginLeft: 6 }}>
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                        </svg>
                    </Box>

                    {/* Phone Input */}
                    <Box
                        component="input"
                        type="tel"
                        name="phone"
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        placeholder="9876543210"
                        required
                        sx={{
                            width: '100%',
                            py: 1.5,
                            px: 2,
                            fontSize: '0.875rem',
                            color: '#1f2937',
                            border: 'none',
                            outline: 'none',
                            bgcolor: '#fff'
                        }}
                    />
                </Box>

                {/* Dropdown Menu */}
                {isOpen && (
                    <Paper
                        elevation={3}
                        sx={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            zIndex: 20,
                            width: 250,
                            mt: 1,
                            maxHeight: 240,
                            overflowY: 'auto',
                            bgcolor: 'white',
                            borderRadius: 1.5
                        }}
                    >
                        <Box component="ul" sx={{ listStyle: 'none', p: 1, m: 0 }}>
                            {countries.map((country, index) => (
                                <Box
                                    component="li"
                                    key={`${country.id}-${index}`}
                                    onClick={() => {
                                        setCountryCode(country.code);
                                        setIsOpen(false);
                                    }}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        px: 2,
                                        py: 1,
                                        cursor: 'pointer',
                                        borderRadius: 1,
                                        '&:hover': { bgcolor: '#f3f4f6' },
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {country.flag}
                                    <span style={{ marginRight: 'auto' }}>{country.name}</span>
                                    <span style={{ color: '#6b7280' }}>({country.code})</span>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                )}
            </Box>
        </ClickAwayListener>
    );
};

export default PhoneInputWithCountry;
