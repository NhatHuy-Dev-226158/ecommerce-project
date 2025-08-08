import React from 'react'
import { IoTimerOutline } from "react-icons/io5";
import { FaAnglesRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const BlogItem = () => {
    return (
        <div className='blogitem'>
            <div className="group img-Wrapper w-[100%] overflow-hidden rounded-md cursor-pointer relative">
                <img src="/blog/blog(1).png" alt="" className='w-full transition-all
                            duration-300 group-hover:opacity-100 group-hover:scale-105' />

                <span className='flex items-center justify-center text-white absolute bottom-[15px]
right-[15px] z-50 bg-[#ff2727] rounded-md p-1 text-[11px] font-[500] gap-1'>
                    <IoTimerOutline className='text-[18px]' /> 17 June, 2025
                </span>
            </div>

            <div className="info py-4">
                <h2 className='text-[15px] font-[600] text-black'>
                    <Link to='/' className='hover:text-[#ff4444]'>
                        Slow Down to Hear Christ’s Voice: God Still Speaks!
                    </Link>
                </h2>

                <p className="text-[13px] font-[400] text-[rgba(0,0,0,0.8)] multi-line-ellipsis">
                    <Link to='/' className='hover:text-black'>
                        Nothing is worse in a conversation than talking to someone who gives you the silent treatment in return.
                    </Link>
                </p>
                <Link className='hover:text-[#ff1515] text-[#7a28ff] font-[450] text[14px] flex items-center gap-1'>
                    VIEW THESE RESOURCES <FaAnglesRight />
                </Link>
            </div>
        </div>
    )
}

export default BlogItem;
