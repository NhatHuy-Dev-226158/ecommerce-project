import React from 'react'
import '../Search/style.css'
import Button from '@mui/material/Button';
import { FiSearch } from "react-icons/fi";
const Search = () => {
    return (
        <div className='searchBox w-[100%] h-[50px] bg-[#e5e5e5] rounded-[10px] p-2 relative'>
            <input className='w-full h-[35px] focus:outline-none bg-inherit p-2 text-[16px]'
                type="text" placeholder='Tìm kiếm sản phẩm ...' />

            <Button className='!absolute top-[7px] right-[5px] z-50 
                    !w-[37px] !min-w-[37px] h-[37px] !rounded-full !text-black'>
                <FiSearch className='text-black text-[25px]' />
            </Button>

        </div>
    )
}

export default Search
