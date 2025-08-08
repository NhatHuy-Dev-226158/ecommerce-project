import React, { useState } from 'react';
import { Paper, Grid } from '@mui/material';
import PageHeader from '../../componets/Componets-Product/Product-Header';
import RejectionItemsCard from '../../componets/Componets-Product/RejectionItemsCard';
import ProductsBreakdownCard from '../../componets/Componets-Product/ProductsBreakdownCard';
import ProductListTable from '../../componets/Componets-Product/ProductListTable';

const ProductListPage = () => {
    // Quản lý state cho các bộ lọc của bảng
    const stockOptions = ['In stock', 'Low stock', 'Out of stock'];
    const [stockSelection, setStockSelection] = useState([]);

    const publishOptions = ['Published', 'Draft'];
    const [publishSelection, setPublishSelection] = useState([]);

    const handleStockChange = (event) => {
        const { target: { value } } = event;
        setStockSelection(typeof value === 'string' ? value.split(',') : value);
    };

    const handlePublishChange = (event) => {
        const { target: { value } } = event;
        setPublishSelection(typeof value === 'string' ? value.split(',') : value);
    };

    const MenuProps = {
        PaperProps: { style: { maxHeight: 224, width: 180 } },
    };
    return (
        <section className="bg-gray-50">
            {/*Component Header: Hiển thị tiêu đề trang, breadcrumbs và các nút hành động chính.*/}
            <PageHeader />

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} lg={5}>
                    {/*Component Card: Thống kê các mặt hàng bị từ chối theo nguồn.*/}
                    <RejectionItemsCard />
                </Grid>
                <Grid item xs={12} lg={7}>
                    {/*Component Card: Thống kê phân loại sản phẩm trong kho.*/}
                    <ProductsBreakdownCard />
                </Grid>
            </Grid>

            <Paper sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
                {/*Component Bảng: Hiển thị danh sách sản phẩm cùng với các bộ lọc.*/}
                <ProductListTable
                    stockSelection={stockSelection}
                    handleStockChange={handleStockChange}
                    stockOptions={stockOptions}
                    publishSelection={publishSelection}
                    handlePublishChange={handlePublishChange}
                    publishOptions={publishOptions}
                    MenuProps={MenuProps}
                />
            </Paper>
        </section>
    );
};

export default ProductListPage;