import React from 'react';
import { Paper, Typography, CircularProgress } from '@mui/material';

/**
 * @component RejectionItemsCard
 * @description Một thẻ (card) hiển thị thống kê về các mặt hàng bị từ chối từ nhiều nguồn khác nhau,
 * đi kèm với một thanh trạng thái và chi tiết cho từng nguồn.
 * @param {object} props - Props cho component.
 * @param {object} props.data - Dữ liệu thống kê. Nếu không có dữ liệu (null/undefined),
 * component sẽ hiển thị trạng thái đang tải.
 * @param {number} props.data.total - Tổng số mặt hàng bị từ chối.
 * @param {Array<{name: string, count: number, color: string}>} props.data.sources - Mảng các nguồn.
 * @example
 * const data = {
 *   total: 210,
 *   sources: [
 *     { name: 'Website', count: 100, color: '#2dd4bf' },
 *     { name: 'Ebay', count: 50, color: '#38bdf8' },
 *     { name: 'Amazon', count: 60, color: '#3b82f6' }
 *   ]
 * };
 * <RejectionItemsCard data={data} />
 */
const RejectionItemsCard = ({ data }) => {
    // Hiển thị trạng thái tải nếu không có dữ liệu được cung cấp
    if (!data) {
        return (
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={24} />
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', height: '100%' }}>
            {/* Tiêu đề hiển thị tổng số mặt hàng */}
            <Typography variant="body1" fontWeight="bold" color="text.primary">
                {data.total} Rejection Items
            </Typography>

            {/* Thanh trạng thái phân chia theo tỷ lệ phần trăm */}
            <div className="flex w-full h-2 rounded-full overflow-hidden my-3">
                {data.sources.map(source => (
                    <div
                        key={source.name}
                        title={`${source.name}: ${source.count}`} // Thêm tooltip để dễ xem
                        // Tính toán chiều rộng của mỗi phần dựa trên tỷ lệ đóng góp vào tổng số
                        style={{
                            width: `${(source.count / data.total) * 100}%`,
                            backgroundColor: source.color
                        }}
                    />
                ))}
            </div>

            {/* Chú thích chi tiết cho từng nguồn */}
            <div className="flex justify-between text-center">
                {data.sources.map(source => (
                    <div key={source.name} className="w-1/3">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                            {/* Chấm màu đại diện */}
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: source.color }}></span>
                            <Typography variant="caption" color="text.secondary">{source.name}</Typography>
                        </div>
                        <Typography variant="h6" fontWeight="bold">{source.count}</Typography>
                        <Typography variant="caption" color="text.secondary">Total Items</Typography>
                    </div>
                ))}
            </div>
        </Paper>
    );
};

export default RejectionItemsCard;