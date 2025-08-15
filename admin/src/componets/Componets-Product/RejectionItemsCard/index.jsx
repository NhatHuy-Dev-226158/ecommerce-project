import React, { } from 'react';
import { Paper, Typography, CircularProgress } from '@mui/material';

// Dữ liệu mẫu
const rejectionItemsData = {
    total: 210,
    sources: [
        { name: 'Website', count: 100, color: '#2dd4bf' },
        { name: 'Ebay', count: 50, color: '#38bdf8' },
        { name: 'Amazon', count: 60, color: '#3b82f6' }
    ]
};

const RejectionItemsCard = ({ data }) => {
    if (!data) {
        return <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', height: '100%' }}><CircularProgress size={20} /></Paper>;
    }
    return (
        <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', height: '100%' }}>
            <Typography variant="body1" fontWeight="bold" color="text.primary">
                {rejectionItemsData.total}
                Rejection Items
            </Typography>
            <div className="flex w-full h-2 rounded-full overflow-hidden my-3">
                {rejectionItemsData.sources.map(source => (
                    <div key={source.name}
                        style={{
                            width: `${(source.count / rejectionItemsData.total) * 100}%`,
                            backgroundColor: source.color
                        }} />
                ))}
            </div>
            <div className="flex justify-between text-center">
                {rejectionItemsData.sources.map(source => (
                    <div key={source.name} className="w-1/3">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
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
