import React from 'react'
import { Link } from 'react-router-dom';
const BannerSmall = (props) => {
    return (
        <div className="banner-small w-full overflow-hidden rounded-md group border relative">
            <img src={props.image} alt="" className='w-full transition-all duration-150 group-hover:scale-105' />

            <div className={`info absolute p-5 top-0 
                ${props.info === "left" ? "left-0" : "right-0"} 
                w-[70%] h-[100%] z-50 flex items-center justify-center flex-col gap-2 ${props.info === "left" ? "" : "pl-12"}`}>
                <h2 className='text-[20px] font-[600]'>Name Product Name Product</h2>
                <span className='text-[20px] text-[#efff09] font-[600] w-full'>2,000,000</span>
                <div className='w-full'>
                    <Link to='/' className='text-[16px] font-[600] link hover:!text-[#a2ff0cfe] underline hover:decoration-[#a2ff0cfe]'> Mua Ngay</Link>
                </div>
            </div>
        </div>
    )
}

export default BannerSmall;
