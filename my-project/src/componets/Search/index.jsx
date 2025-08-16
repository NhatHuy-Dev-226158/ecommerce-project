import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import { FiSearch } from "react-icons/fi";
import { MyContext } from '../../App'; // Import context
import '../Search/style.css';

const Search = () => {
    const { applyFilterAndNavigate } = useContext(MyContext);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        // Chỉ thực hiện tìm kiếm nếu có từ khóa
        if (searchTerm.trim() !== '') {
            // Gọi hàm từ context để cập nhật bộ lọc và điều hướng
            applyFilterAndNavigate('search', searchTerm.trim());
        }
    };

    const handleKeyDown = (event) => {
        // Thực hiện tìm kiếm khi người dùng nhấn phím "Enter"
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className='searchBox w-[100%] h-[50px] bg-[#e5e5e5] rounded-[10px] p-2 relative'>
            <input
                className='w-full h-[35px] focus:outline-none bg-inherit p-2 text-[16px]'
                type="text"
                placeholder='Tìm kiếm sản phẩm ...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <Button
                className='!absolute top-[7px] right-[5px] z-50 !w-[37px] !min-w-[37px] h-[37px] !rounded-full !text-black'
                onClick={handleSearch}
            >
                <FiSearch className='text-black text-[25px]' />
            </Button>
        </div>
    );
};

export default Search;