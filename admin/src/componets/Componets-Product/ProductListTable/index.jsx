import React, { } from 'react';
import {
    Paper, Button, MenuItem, Checkbox,
    TextField, Select, FormControl, IconButton,
    InputLabel, OutlinedInput, ListItemText
} from '@mui/material';
import { FiSearch, FiMoreHorizontal } from 'react-icons/fi';
import { CiSaveDown1 } from "react-icons/ci";
import { PiTextColumns } from "react-icons/pi";


// Dữ liệu mẫu
const salesRecapData = [
    { id: 1, image: 'https://i.imgur.com/example.png', name: 'Philips Hair dryer 200', category: 'Electronic', productId: '#F012214AF', distributor: 'Jojo Optima', qty: 1223, price: 110.00 },
    { id: 2, image: 'https://i.imgur.com/example.png', name: 'HD Smart Tv T4501', category: 'Electronic', productId: '#F012214AG', distributor: 'Jaya Solusindo', qty: 2412, price: 1950.00 },
    { id: 3, image: 'https://i.imgur.com/example.png', name: 'Smart Indoor CCTV', category: 'Electronic', productId: '#F012214AH', distributor: 'Bala Bala Komp', qty: 2114, price: 50.00 },
    { id: 4, image: 'https://i.imgur.com/example.png', name: 'Mini Blender Juicer', category: 'Electronic', productId: '#F012214AI', distributor: 'Halimawan Group', qty: 1211, price: 23.00 },
    { id: 5, image: 'https://i.imgur.com/example.png', name: 'Study Lamp Flexible', category: 'Electronic', productId: '#F012214AJ', distributor: 'Tara Tekno', qty: 3918, price: 11.00 },
    { id: 6, image: 'https://i.imgur.com/example.png', name: 'Mic Wireless Clip On', category: 'Electronic', productId: '#F012214AK', distributor: 'Jaya Solusindo', qty: 521, price: 921.00 },
];

const ProductListTable = ({ stockSelection, handleStockChange, stockOptions, publishSelection, handlePublishChange, publishOptions, MenuProps }) => (
    <Paper
        sx={{
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
            overflow: 'hidden'
        }}>
        <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <FormControl
                    size="small"
                    sx={{ width: 180 }}>
                    <InputLabel>Stock</InputLabel>
                    <Select
                        multiple
                        value={stockSelection}
                        onChange={handleStockChange}
                        input={<OutlinedInput label="Stock" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                        className='!rounded-lg'>
                        {stockOptions.map((option) => (
                            <MenuItem
                                key={option}
                                value={option}
                                sx={{ pl: 1 }}>
                                <Checkbox
                                    checked={stockSelection.includes(option)}
                                    size="small" />
                                <ListItemText primary={option} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ width: 180 }}>
                    <InputLabel>Publish</InputLabel>
                    <Select
                        multiple
                        value={publishSelection}
                        onChange={handlePublishChange}
                        input={<OutlinedInput label="Publish" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                        className='!rounded-lg'>
                        {publishOptions.map((option) => (
                            <MenuItem
                                key={option}
                                value={option}
                                sx={{ pl: 1 }}>
                                <Checkbox
                                    checked={publishSelection.includes(option)}
                                    size="small" />
                                <ListItemText primary={option} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    className='w-[350px]'
                    size="small"
                    placeholder="Search..."
                    InputProps={{
                        startAdornment: (
                            <FiSearch className="text-[20px] cursor-pointer text-gray-500 mr-2" />
                        ),
                        sx: { borderRadius: '8px' }
                    }} />

            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outlined"
                    size="small"
                    className='!flex !items-center !justify-center !w-[40px] !h-[40px] !min-w-[40px] !border !rounded-[8px] !border-[#bababa]'>
                    <CiSaveDown1 className='!text-[20px] text-[#424242]' />
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    className='!flex !items-center !justify-center !w-[40px] !h-[40px] !min-w-[40px] !border !rounded-[8px] !border-[#bababa]'>
                    <PiTextColumns className='!text-[20px] text-[#424242]' />
                </Button>
                <FormControl size="small" className='!h-[40px]'>
                    <Select defaultValue="filter" className='!h-[40px] !rounded-[8px] !border-[#bababa]'>
                        <MenuItem value="filter">Filter</MenuItem>
                        <MenuItem value="newest">Newest</MenuItem>
                        <MenuItem value="oldest">Oldest</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </div>
        <div className="overflow-x-auto mx-2 mb-2">
            <table className="w-full text-sm text-left text-gray-600 border-collapse">
                <thead className="bg-[#708fff]">
                    <tr>
                        <th className="py-4 rounded-tl-lg rounded-bl-lg"><Checkbox className='!text-white' size="small" /></th>
                        <th className="py-4 font-semibold uppercase text-sm text-[#ffeaea]">Product</th>
                        <th className="py-4 font-semibold uppercase text-sm text-[#ffeaea]">ID</th>
                        <th className="py-4 font-semibold uppercase text-sm text-[#ffeaea]">Distributor</th>
                        <th className="py-4 font-semibold uppercase text-sm text-[#ffeaea]">Qty</th>
                        <th className="py-4 font-semibold uppercase text-sm text-[#ffeaea]">Fix Price</th>
                        <th className="py-4 rounded-tr-lg rounded-br-lg"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {salesRecapData.map(item => (
                        <tr key={item.id} className="bg-white hover:bg-gray-50">
                            <td className="py-4"><Checkbox size="small" /></td>
                            <td className="py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 p-1 border border-gray-200 rounded-md flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.category}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 font-mono">{item.productId}</td>
                            <td className="py-4">{item.distributor}</td>
                            <td className="py-4">{item.qty.toLocaleString()}</td>
                            <td className="py-4 font-semibold text-green-600">${item.price.toFixed(2)}</td>
                            <td className="py-4"><IconButton size="small"><FiMoreHorizontal /></IconButton></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Paper>
);

export default ProductListTable;
