import React from 'react';
import { IoTimerOutline } from "react-icons/io5";
import { FaAnglesRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';

// Component giờ đây nhận một prop tên là `blog`
const BlogItem = ({ blog }) => {
    // Nếu không có dữ liệu blog (ví dụ: đang loading), không hiển thị gì cả
    if (!blog) {
        return null;
    }

    // Định dạng lại ngày tháng cho đẹp hơn
    const formattedDate = new Date(blog.createdAt).toLocaleDateString('vi-VN', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <div className='blogitem'>
            <div className="group img-Wrapper w-[100%] overflow-hidden rounded-md cursor-pointer relative">
                {/* Sử dụng ảnh, tiêu đề, và slug từ dữ liệu động */}
                <Link to={`/blog/${blog.slug}`}>
                    <img src={blog.featuredImage} alt={blog.title} className='w-full h-48 object-cover transition-all
                                duration-300 group-hover:opacity-100 group-hover:scale-105' />
                </Link>

                <span className='flex items-center justify-center text-white absolute bottom-[15px]
                    right-[15px] z-50 bg-[#ff2727] rounded-md p-1 px-2 text-[11px] font-[500] gap-1'>
                    <IoTimerOutline className='text-[18px]' /> {formattedDate}
                </span>
            </div>

            <div className="info py-4">
                <h2 className='text-[15px] font-[600] text-black h-12 overflow-hidden'>
                    <Link to={`/blog/${blog.slug}`} className='hover:text-[#ff4444]'>
                        {blog.title}
                    </Link>
                </h2>

                <p className="text-[13px] font-[400] text-[rgba(0,0,0,0.8)] multi-line-ellipsis h-12 overflow-hidden mt-1">
                    {/* Sử dụng đoạn trích ngắn (excerpt) */}
                    {blog.excerpt}
                </p>
                <Link to={`/blog/${blog.slug}`} className='hover:text-[#ff1515] text-[#7a28ff] font-[450] text-[14px] flex items-center gap-1 mt-2'>
                    ĐỌC THÊM <FaAnglesRight />
                </Link>
            </div>
        </div>
    );
};

export default BlogItem;