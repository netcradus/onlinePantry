import { Box, Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip } from '@mui/material';
import { useGetBlogsQuery, useDeleteBlogMutation } from '../../../store/api/blogApi';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Plus, FileText } from 'lucide-react';
import BackButton from '../../common/BackButton';

const BlogManager = () => {
    const { data, isLoading } = useGetBlogsQuery({});
    const [deleteBlog] = useDeleteBlogMutation();
    const navigate = useNavigate();

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            await deleteBlog(id);
        }
    };

    return (
        <Box sx={{ py: 6, minHeight: '100vh', bgcolor: '#f8fafc' }}>
            <Container maxWidth="lg">
                <BackButton to="/admin/dashboard" />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1.5, bgcolor: '#dcfce7', borderRadius: 2, color: '#16a34a' }}>
                            <FileText size={28} />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: '800', color: '#1e293b' }}>Blogs</Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Plus size={20} />}
                        onClick={() => navigate('/admin/blogs/new')}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.2)'
                        }}
                    >
                        New Post
                    </Button>
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Title</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Author</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Date</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: '#64748b' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.data?.map((blog: any) => (
                                <TableRow key={blog._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ fontWeight: 500, color: '#334155' }}>{blog.title}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={`${blog.author?.firstName || 'Unknown'} ${blog.author?.lastName || ''}`}
                                            size="small"
                                            sx={{
                                                bgcolor: '#f1f5f9',
                                                color: '#475569',
                                                fontWeight: 500
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ color: '#64748b' }}>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={() => navigate(`/admin/blogs/edit/${blog._id}`)}
                                            sx={{ color: '#3b82f6', mr: 1 }}
                                        >
                                            <Edit2 size={18} />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(blog._id)}
                                            sx={{ color: '#ef4444' }}
                                        >
                                            <Trash2 size={18} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!data?.data || data?.data.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                                        <Typography color="text.secondary">No blog posts found</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    );
};

export default BlogManager;
