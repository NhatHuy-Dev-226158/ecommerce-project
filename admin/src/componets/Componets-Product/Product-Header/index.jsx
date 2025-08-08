import React, { } from 'react';
import { Typography, Button, Breadcrumbs, TextField, IconButton, InputAdornment } from '@mui/material';
import { Link } from 'react-router-dom';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";

const PageHeader = () => {
    const handleAddProductClick = () => {
        console.log("Redirecting to Add Product page...");
    };

    return (
        <div className="flex flex-wrap justify-between items-center mb-4">
            <div>
                <Typography variant="h5" component="h1" fontWeight="bold" color="text.primary">Product List</Typography>
                <Breadcrumbs separator={<FaAngleRight className='text-[13px]' />} aria-label="breadcrumb" sx={{ mt: 0.5 }}>
                    <Link to='/' className="text-sm font-medium text-gray-500 hover:underline">Dashboard</Link>
                    <Typography color="text.primary" className="text-sm font-medium">Product List</Typography>
                </Breadcrumbs>
            </div>
            <div className='flex items-center gap-2'>
                <TextField
                    className='w-[495px]'
                    size="small"
                    label="Tìm kiếm"
                    placeholder="Ví dụ: ID #12312445 hoặc ...."
                    variant="outlined"
                    InputProps={{
                        sx: {
                            borderRadius: '14px',
                            paddingRight: 0,
                        },
                        endAdornment: (
                            <InputAdornment position="end" className='!ml-0'>
                                <IconButton
                                    aria-label="search"
                                    onClick={() => console.log('Search clicked!')}
                                    sx={{
                                        width: '60px',
                                        height: '40px',
                                        backgroundColor: '#1976D2',
                                        borderTopLeftRadius: 0,
                                        borderBottomLeftRadius: 0,
                                        borderTopRightRadius: '14px',
                                        borderBottomRightRadius: '14px',
                                        '&:hover': {
                                            backgroundColor: '#0389ff',
                                        }
                                    }}
                                >
                                    <FiSearch className="text-[20px] text-[#e4e4e4]" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Link to='/product-upload'>
                    <Button
                        variant="contained"
                        startIcon={<FiPlus />}
                        onClick={handleAddProductClick}
                        sx={{ bgcolor: '#1A202C', color: 'white', textTransform: 'none', fontWeight: '600', borderRadius: '14px', px: 3, py: 1, '&:hover': { bgcolor: '#2D3748' } }}
                    >
                        Thêm Sản Phẩm
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default PageHeader;
