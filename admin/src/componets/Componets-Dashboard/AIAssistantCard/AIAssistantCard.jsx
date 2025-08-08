import React, { useState } from 'react';
import { Button, Dialog, Box, Typography, CircularProgress, IconButton } from '@mui/material';
import { BsLightbulb } from 'react-icons/bs';
import { FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const AIAssistantCard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const handleAnalyze = () => { setIsLoading(true); setTimeout(() => setIsLoading(false), 3000); };

    return (
        <>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80 h-full flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-100 rounded-full"><BsLightbulb className="text-indigo-600" /></div>
                        <h3 className="font-bold text-lg text-gray-800">Trợ lý AI</h3>
                    </div>
                    <p className="text-sm text-gray-600">Nhận phân tích và đề xuất thông minh để hiểu rõ hơn về hiệu suất kinh doanh của bạn.</p>
                </div>
                <Button className="!flex !text-sm !py-2 px-3 !bg-indigo-500 !text-white !rounded-lg hover:!bg-indigo-600 !transition-colors" onClick={handleAnalyze} >
                    Phân tích dữ liệu
                </Button>
            </div>
            <AnimatePresence>
                {isLoading && (
                    <Dialog open={isLoading} PaperProps={{ sx: { borderRadius: 4, width: 400 } }}>
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2"><BsLightbulb className="text-indigo-600" /><Typography variant="h6" fontWeight="bold">Phân tích từ Trợ lý AI</Typography></div>
                                    <IconButton onClick={() => setIsLoading(false)} size="small"><FiX /></IconButton>
                                </div>
                                <CircularProgress sx={{ my: 3 }} />
                                <Typography variant="h6" sx={{ mt: 2 }}>AI đang phân tích dữ liệu...</Typography>
                                <Typography color="text.secondary" variant="body2">Quá trình này có thể mất vài giây, vui lòng đợi.</Typography>
                                <Button onClick={() => setIsLoading(false)} variant="contained" sx={{ mt: 4, width: '100px' }}>Đóng</Button>
                            </Box>
                        </motion.div>
                    </Dialog>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIAssistantCard;