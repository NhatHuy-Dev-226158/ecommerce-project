import React, { useState } from 'react';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Stack } from '@mui/material';
import { IoMdClose } from "react-icons/io";
import Button from '@mui/material/Button';

const EditItemModal = ({ item, onSave, onClose }) => {

    const [attributes, setAttributes] = useState(item.attributes);
    const availableSizes = ['S', 'M', 'L', 'XL'];
    const availableColors = ['Black', 'White', 'Blue', 'Red'];

    const handleSave = () => {
        onSave(item.id, attributes);
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} PaperProps={{ sx: { borderRadius: 4, maxWidth: 450 } }}>
            <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }}>
                Edit Item
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
                    <IoMdClose />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                    <Box>
                        <Typography fontWeight="bold">{item.name}</Typography>
                        <Typography color="primary" fontWeight="bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</Typography>
                    </Box>
                </Box>

                <Typography gutterBottom fontWeight="medium">Size</Typography>
                <Stack direction="row" spacing={1} mb={3}>
                    {availableSizes.map(size => (
                        <Button
                            key={size}
                            variant={attributes.size === size ? 'contained' : 'outlined'}
                            onClick={() => setAttributes(prev => ({ ...prev, size }))}
                        >
                            {size}
                        </Button>
                    ))}
                </Stack>

                <Typography gutterBottom fontWeight="medium">Color</Typography>
                <Stack direction="row" spacing={1.5}>
                    {availableColors.map(color => (
                        <Box
                            key={color}
                            onClick={() => setAttributes(prev => ({ ...prev, color }))}
                            sx={{
                                width: 32, height: 32, borderRadius: '50%', bgcolor: color.toLowerCase(), cursor: 'pointer',
                                border: 3, borderColor: attributes.color === color ? 'primary.main' : 'transparent',
                                transition: 'all 0.2s', transform: attributes.color === color ? 'scale(1.1)' : 'scale(1)'
                            }}
                        />
                    ))}
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={handleSave} variant="contained">Save Changes</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditItemModal;