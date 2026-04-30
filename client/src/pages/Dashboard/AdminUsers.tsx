import { Box, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Avatar, Stack } from '@mui/material';
import { useGetAllUsersQuery } from '../../store/api/userApi';
import { Eye, Phone, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PantryButton } from '../../components/ui/PantryButton';

const AdminUsers = () => {
    const { data: usersData, isLoading } = useGetAllUsersQuery(undefined);
    const navigate = useNavigate();

    if (isLoading) return <Box sx={{ py: 10, textAlign: 'center' }}>Loading users...</Box>;

    const users = usersData?.data || [];

    return (
        <Box sx={{ py: 6, bgcolor: 'var(--pantry-cream)', minHeight: '100vh' }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h1" sx={{ fontWeight: 800, mb: 1 }}>User Directory</Typography>
                        <Typography variant="body1" sx={{ color: 'var(--pantry-gray-400)' }}>Manage and support your Online Pantry customers</Typography>
                    </Box>
                    <PantryButton variant="ghost" onClick={() => navigate('/admin/dashboard')} sx={{ color: 'var(--pantry-green-600)', fontWeight: 700 }}>
                        &larr; Back to Console
                    </PantryButton>
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '24px', border: '1.5px solid var(--pantry-gray-100)', overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 800 }}>
                        <TableHead sx={{ bgcolor: 'var(--pantry-gray-50)' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Customer</TableCell>
                                <TableCell sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Contact Info</TableCell>
                                <TableCell sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Account Details</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, py: 2.5, color: 'var(--pantry-gray-800)' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user: any) => (
                                <TableRow key={user._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar 
                                                sx={{ 
                                                    width: 44, 
                                                    height: 44, 
                                                    bgcolor: 'var(--pantry-green-50)', 
                                                    color: 'var(--pantry-green-600)',
                                                    fontWeight: 800,
                                                    fontSize: '16px'
                                                }}
                                            >
                                                {user.firstName?.[0]}{user.lastName?.[0]}
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontWeight: 800 }}>{user.firstName} {user.lastName}</Typography>
                                                <Typography variant="caption" sx={{ color: 'var(--pantry-green-600)', fontWeight: 700, textTransform: 'uppercase' }}>
                                                    {user.role}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Stack spacing={0.5}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--pantry-gray-400)' }}>
                                                <Mail size={14} /> 
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{user.email}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--pantry-gray-400)' }}>
                                                <Phone size={14} /> 
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{user.phone || 'No phone'}</Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ py: 2.5 }}>
                                        <Typography variant="body2" sx={{ color: 'var(--pantry-gray-400)', fontWeight: 500 }}>
                                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'var(--pantry-gray-400)' }}>
                                            {user.addresses?.length || 0} Saved Addresses
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ py: 2.5 }}>
                                        <PantryButton
                                            variant="ghost"
                                            size="small"
                                            startIcon={<Eye size={16} />}
                                            onClick={() => navigate(`/admin/users/${user._id}`)}
                                            sx={{ borderRadius: '24px', fontWeight: 700, color: 'var(--pantry-green-600)', borderColor: 'var(--pantry-green-100)' }}
                                        >
                                            View Profile
                                        </PantryButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    );
};

export default AdminUsers;
