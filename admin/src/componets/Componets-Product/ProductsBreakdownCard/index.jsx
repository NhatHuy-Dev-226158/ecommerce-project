import React, { } from 'react';
import { Paper, Typography, LinearProgress, Divider } from '@mui/material';
import { FiBox, FiMonitor, FiHome } from 'react-icons/fi';


// Dữ liệu mẫu
const productsBreakdownData = {
    homeLiving: 13250,
    electronic: 24112,
    totalInWarehouse: 37362,
    capacityUsed: 75,
};

const ProductsBreakdownCard = () => (
    <Paper
        sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
            height: '100%'
        }}>
        <div className="flex items-center gap-2 mb-4">
            <FiBox className="text-gray-500" />
            <Typography
                variant="body1"
                fontWeight="bold"
                color="text.primary">
                Products Breakdown
            </Typography>
        </div>
        <div className="flex divide-x divide-gray-200">
            <div className="w-1/2 pr-4 flex items-center gap-3">
                <FiHome className="text-blue-500 text-3xl" />
                <div>
                    <Typography
                        variant="h6"
                        fontWeight="bold">
                        {productsBreakdownData.homeLiving.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Home Living</Typography>
                </div>
            </div>
            <div className="w-1/2 pl-4 flex items-center gap-3">
                <FiMonitor className="text-teal-500 text-3xl" />
                <div>
                    <Typography variant="h6" fontWeight="bold">
                        {productsBreakdownData.electronic.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Electronic</Typography>
                </div>
            </div>
        </div>
        <Divider sx={{ my: 2 }} />
        <div className="flex items-center justify-between text-sm">
            <div>
                <span className="font-bold text-lg">
                    {productsBreakdownData.totalInWarehouse.toLocaleString()}
                </span>
                <span className="text-gray-500">(Total Items In Warehouse)</span>
            </div>
            <span className="font-medium text-gray-600">
                {productsBreakdownData.capacityUsed}
                % used of 100% capacity
            </span>
        </div>
        <LinearProgress
            variant="determinate"
            value={productsBreakdownData.capacityUsed}
            sx={{
                height: 8,
                borderRadius: '4px',
                mt: 1
            }} />
    </Paper>
);
export default ProductsBreakdownCard;
