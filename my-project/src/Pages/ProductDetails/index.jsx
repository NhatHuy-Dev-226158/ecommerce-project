import React, { useState } from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import ZoomProductImg from '../../componets/ZoomProductImg';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import '../ProductDetails/style.css';
import ProductsSlider from '../../componets/ProductsSlider';
import ProductDetailsComponets from '../../componets/ProductDetails/inddex';


const ProductDetails = () => {

    const [isActiveTab, setActiveTab] = useState(0);

    return (
        <>
            <div className='py-5'>
                <div className="container">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" to="/" className='link transition !text-[14px]'>
                            HOME
                        </Link>
                        <Link
                            underline="hover"
                            color="inherit"
                            to="/"
                            className='link transition !text-[14px]'
                        >
                            Fashion
                        </Link>
                        <Link
                            underline="hover"
                            color="inherit"
                            className='link transition !text-[14px]'
                        >
                            Name Product
                        </Link>
                    </Breadcrumbs>
                </div>
            </div>

            <section className='bg-white py-5'>
                <div className="container flex gap-8 ">
                    <div className="zoom-product-img w-[30%]">
                        <ZoomProductImg></ZoomProductImg>
                    </div>

                    <div className="zoom-product-img w-[70%] pr-10">
                        <ProductDetailsComponets></ProductDetailsComponets>
                    </div>
                </div>

                <div className="container pt-10 ">
                    <div className="flex items-center gap-8 mb-5">
                        <span className={`link text-[17px] cursor-pointer font-[500]
                         ${isActiveTab === 0 && 'text-primary'}`
                        }
                            onClick={() => setActiveTab(0)}
                        >
                            Mô tả
                        </span>
                        <span className={`link text-[17px] cursor-pointer font-[500]
                         ${isActiveTab === 1 && 'text-primary'}`
                        }
                            onClick={() => setActiveTab(1)}
                        >
                            Thông tin chi tiết
                        </span>
                        <span className={`link text-[17px] cursor-pointer font-[500]
                         ${isActiveTab === 2 && 'text-primary'}`
                        }
                            onClick={() => setActiveTab(2)}
                        >
                            Đánh giá (1,000)
                        </span>
                    </div>
                    {
                        isActiveTab === 0 &&
                        (<div className="shadow-md w-full py-8 px-8 rounded-md leading-relaxed">
                            <h2 className="text-2xl font-bold mb-4">Đánh Giá & Giới Thiệu Tai Nghe Bluetooth Zento X9</h2>
                            <p className="mb-4">
                                Trong thế giới công nghệ ngày nay, việc sở hữu một chiếc tai nghe không dây chất lượng cao là nhu cầu thiết yếu với nhiều người,
                                đặc biệt là các tín đồ yêu âm nhạc và những người thường xuyên di chuyển. Tai nghe Bluetooth Zento X9 ra đời như một giải pháp toàn diện,
                                đáp ứng mọi tiêu chí về thiết kế, chất lượng âm thanh và tiện ích.
                            </p>

                            <h3 className="text-xl font-semibold mb-3">Thiết Kế Sang Trọng, Thoải Mái Khi Sử Dụng</h3>
                            <p className="mb-4">
                                Zento X9 sở hữu thiết kế công thái học tinh tế với phần đệm tai mềm mại, ôm khít tai người dùng giúp cách âm tốt và tạo cảm giác dễ chịu khi đeo trong thời gian dài.
                                Phần housing được làm từ nhựa cao cấp kết hợp viền kim loại bóng bẩy, mang đến vẻ ngoài hiện đại và cá tính.
                            </p>

                            <h3 className="text-xl font-semibold mb-3">Chất Lượng Âm Thanh Vượt Trội</h3>
                            <p className="mb-4">
                                Được trang bị công nghệ Active Noise Cancelling (ANC), tai nghe Zento X9 có khả năng loại bỏ tiếng ồn xung quanh lên đến 90%,
                                giúp bạn tận hưởng âm nhạc trọn vẹn dù đang ở nơi đông người hay trên các phương tiện giao thông công cộng.
                                Âm bass sâu, chắc khỏe kết hợp cùng dải treble trong trẻo mang đến trải nghiệm âm thanh sống động và chi tiết.
                            </p>

                            <h3 className="text-xl font-semibold mb-3">Kết Nối Ổn Định, Dung Lượng Pin Khủng</h3>
                            <p className="mb-4">
                                Nhờ tích hợp Bluetooth 5.3 mới nhất, Zento X9 cho tốc độ kết nối nhanh chóng, độ trễ thấp và phạm vi hoạt động lên đến 10 mét.
                                Pin dung lượng lớn cho phép tai nghe hoạt động liên tục đến 30 giờ, đáp ứng mọi nhu cầu giải trí và làm việc trong suốt cả ngày dài.
                            </p>

                            <h3 className="text-xl font-semibold mb-3">Điều Khiển Cảm Ứng & Tính Năng Thông Minh</h3>
                            <p className="mb-4">
                                Zento X9 hỗ trợ điều khiển cảm ứng thông minh trên tai nghe, giúp người dùng dễ dàng chuyển bài hát, nhận cuộc gọi hoặc kích hoạt trợ lý ảo
                                chỉ bằng một cú chạm nhẹ. Tính năng này mang lại sự tiện lợi tối đa, đặc biệt hữu ích khi bạn đang bận tay lái xe hoặc tập luyện thể thao.
                            </p>

                            <h3 className="text-xl font-semibold mb-3">Kết Luận</h3>
                            <p className="mb-2">
                                Với thiết kế hiện đại, chất lượng âm thanh ấn tượng cùng hàng loạt tính năng thông minh,
                                Tai nghe Bluetooth Zento X9 xứng đáng là người bạn đồng hành lý tưởng cho mọi tín đồ công nghệ và người yêu nhạc.
                                Đây chắc chắn là sản phẩm bạn không nên bỏ lỡ nếu đang tìm kiếm một mẫu tai nghe không dây chất lượng trong tầm giá hợp lý.
                            </p>
                        </div>
                        )}

                    {
                        isActiveTab === 1 &&
                        (<div className="shadow-md w-full py-8 px-8 rounded-md space-y-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="md:w-1/2 w-full">
                                    <h3 className="text-2xl font-semibold mb-4">Thông tin chi tiết</h3>
                                    <table className="table-auto w-full border border-gray-300 text-sm">
                                        <tbody>
                                            {[
                                                ["Tên sản phẩm", "Tai nghe Bluetooth Zento X9"],
                                                ["Công nghệ kết nối", "Bluetooth 5.3"],
                                                ["Chống ồn", "Active Noise Cancelling (ANC)"],
                                                ["Thời lượng pin", "30 giờ sử dụng liên tục"],
                                                ["Phạm vi kết nối", "10 mét"],
                                                ["Cổng sạc", "Type-C"],
                                                ["Trọng lượng", "150g"],
                                                ["Số lượng hiện có", "120 sản phẩm"],
                                                ["Tình trạng kho", "Còn hàng"],
                                                ["Xuất xứ", "Hàn Quốc"],
                                                ["Ngày cập nhật", "21/06/2025"]
                                            ].map(([label, value], index) => (
                                                <tr key={index} className="even:bg-gray-50">
                                                    <td className="border px-3 py-2 font-medium w-1/3">{label}</td>
                                                    <td className="border px-3 py-2">{value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="md:w-1/2 w-full h-[452px] flex justify-center items-center">
                                    <img
                                        src="/product/samsung-galaxy-a55-5g-note.jpg"
                                        alt="Hình minh họa sản phẩm"
                                        className="rounded-md border shadow-md h-full w-full"
                                    />
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-2">Ưu điểm</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Chống ồn chủ động ANC hiệu quả</li>
                                    <li>Bluetooth 5.3 tốc độ kết nối nhanh</li>
                                    <li>Pin dùng cực lâu 30 giờ</li>
                                    <li>Điều khiển cảm ứng thông minh tiện lợi</li>
                                    <li>Thiết kế nhẹ, đệm tai êm, đeo lâu không mỏi</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-2">Nhược điểm</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Không hỗ trợ chống nước</li>
                                    <li>Chỉ có 2 màu Đen và Trắng</li>
                                    <li>Không hỗ trợ kết nối đa thiết bị cùng lúc</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-2">Đánh giá tổng quan</h4>
                                <p className="mb-2">
                                    Tai nghe Bluetooth Zento X9 là lựa chọn đáng giá trong phân khúc tầm trung, với chất lượng âm thanh tốt, chống ồn hiệu quả và kiểu dáng hiện đại.
                                    Sản phẩm phù hợp cho cả công việc, học tập lẫn giải trí.
                                </p>
                                <p className="font-semibold text-primary">★ ★ ★ ★ ☆ (4.5/5)</p>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-2">Chính sách bảo hành & đổi trả</h4>
                                <p className="mb-2">
                                    Sản phẩm được bảo hành chính hãng 12 tháng. Hỗ trợ đổi mới miễn phí trong vòng 7 ngày với sản phẩm lỗi do nhà sản xuất.
                                    Chi tiết liên hệ bộ phận chăm sóc khách hàng.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-2">Hướng dẫn sử dụng</h4>
                                <p className="mb-2">
                                    Kết nối với thiết bị bằng Bluetooth 5.3, chạm nhẹ vào tai nghe để điều khiển phát nhạc, nhận cuộc gọi hoặc kích hoạt trợ lý ảo.
                                    Để tận dụng đầy đủ tính năng, vui lòng tham khảo sách hướng dẫn đi kèm.
                                </p>
                            </div>
                        </div>
                        )}
                    {
                        isActiveTab === 2 && (
                            <div className="shadow-md w-[80%] py-8 px-8 rounded-md">
                                <div className="w-full product-reviews">
                                    <h3 className="text-2xl font-semibold mb-4">Câu hỏi & trả lời</h3>
                                    <div className="scroll-area w-full max-h-[300px] overflow-y-scroll overflow-x-hidden mt-5 pr-5 rounded-md bg-white">
                                        <div className="reviews w-full flex items-center justify-between p-4 border-b border-gray-200">
                                            <div className="info w-[60%] flex items-center gap-3">
                                                <div className="img w-[80px] h-[80px] overflow-hidden rounded-full">
                                                    <img
                                                        src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="w-[80%]">
                                                    <h4 className="font-semibold">Tôi là ai ?</h4>
                                                    <h5 className="text-sm text-gray-500 mb-2">2025-10-29</h5>
                                                    <p className="text-sm text-gray-700 leading-relaxed">
                                                        Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không?
                                                    </p>
                                                </div>
                                            </div>
                                            <Rating name="size-small" defaultValue={3} readOnly />
                                        </div>
                                        <div className="reviews w-full flex items-center justify-between p-4 border-b border-gray-200">
                                            <div className="info w-[60%] flex items-center gap-3">
                                                <div className="img w-[80px] h-[80px] overflow-hidden rounded-full">
                                                    <img
                                                        src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="w-[80%]">
                                                    <h4 className="font-semibold">Tôi là ai ?</h4>
                                                    <h5 className="text-sm text-gray-500 mb-2">2025-10-29</h5>
                                                    <p className="text-sm text-gray-700 leading-relaxed">
                                                        Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không?
                                                    </p>
                                                </div>
                                            </div>
                                            <Rating name="size-small" defaultValue={3} readOnly />
                                        </div>
                                        <div className="reviews w-full flex items-center justify-between p-4 border-b border-gray-200">
                                            <div className="info w-[60%] flex items-center gap-3">
                                                <div className="img w-[80px] h-[80px] overflow-hidden rounded-full">
                                                    <img
                                                        src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="w-[80%]">
                                                    <h4 className="font-semibold">Tôi là ai ?</h4>
                                                    <h5 className="text-sm text-gray-500 mb-2">2025-10-29</h5>
                                                    <p className="text-sm text-gray-700 leading-relaxed">
                                                        Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không?
                                                    </p>
                                                </div>
                                            </div>
                                            <Rating name="size-small" defaultValue={3} readOnly />
                                        </div>
                                        <div className="reviews w-full flex items-center justify-between p-4 border-b border-gray-200">
                                            <div className="info w-[60%] flex items-center gap-3">
                                                <div className="img w-[80px] h-[80px] overflow-hidden rounded-full">
                                                    <img
                                                        src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="w-[80%]">
                                                    <h4 className="font-semibold">Tôi là ai ?</h4>
                                                    <h5 className="text-sm text-gray-500 mb-2">2025-10-29</h5>
                                                    <p className="text-sm text-gray-700 leading-relaxed">
                                                        Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không?
                                                    </p>
                                                </div>
                                            </div>
                                            <Rating name="size-small" defaultValue={3} readOnly />
                                        </div>
                                        <div className="reviews w-full flex items-center justify-between p-4 border-b border-gray-200">
                                            <div className="info w-[60%] flex items-center gap-3">
                                                <div className="img w-[80px] h-[80px] overflow-hidden rounded-full">
                                                    <img
                                                        src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="w-[80%]">
                                                    <h4 className="font-semibold">Tôi là ai ?</h4>
                                                    <h5 className="text-sm text-gray-500 mb-2">2025-10-29</h5>
                                                    <p className="text-sm text-gray-700 leading-relaxed">
                                                        Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không? Bạn biết tôi là ai không?
                                                    </p>
                                                </div>
                                            </div>
                                            <Rating name="size-small" defaultValue={3} readOnly />
                                        </div>
                                    </div>

                                    <div className="reviews-form bg-[#fafafa] p-4 rounded-md">
                                        <h2 className='text-[18px]'>
                                            Bình luận
                                        </h2>
                                        <form className='w-full mt-5'>
                                            <TextField
                                                id="outlined-multiline-flexible"
                                                label="Nhập bình luận của bạn về sản phẩm"
                                                multiline
                                                rows={4}
                                                className='w-full'
                                            />
                                            <Rating name="size-small" defaultValue={3} size="small" className='mt-5' />
                                            <div className="flex items-center mt-5">
                                                <Button className='org-btn hover:!bg-[#38362b]'> Bình Luận</Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                </div>
                <div className="container pt-14">
                    <h2 className='text-[20px] font-[600]'> Sản phẩm tương tự</h2>
                    <ProductsSlider items={6}></ProductsSlider>
                </div>
            </section>
        </>
    )
}

export default ProductDetails;
