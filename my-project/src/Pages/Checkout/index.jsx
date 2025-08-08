import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome, FiLock, FiTag, FiCheckCircle, FiChevronDown, FiEdit2 } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@mui/material';

// --- CÁC COMPONENT CON TÙY CHỈNH (Giữ nguyên) ---
const CustomTextField = ({ id, label, type = 'text', defaultValue = "" }) => (
    <div className="relative group">
        <input
            id={id} name={id} type={type} required
            defaultValue={defaultValue}
            className="block w-full px-1 pt-4 pb-1 text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer transition"
            placeholder=" "
        />
        <label
            htmlFor={id}
            className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
        >
            {label}
        </label>
    </div>
);

const CustomRadio = ({ id, name, value, label, price, defaultChecked = false }) => (
    <label htmlFor={id} className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-200 ${defaultChecked ? 'border-indigo-600 ring-2 ring-indigo-200 bg-indigo-50/50' : 'border-gray-300 hover:border-gray-400'}`}>
        <div className="flex items-center">
            <input type="radio" id={id} name={name} value={value} defaultChecked={defaultChecked} className="sr-only peer" />
            <div className={`w-5 h-5 rounded-full border-2 transition-all ${defaultChecked ? 'border-indigo-600 bg-indigo-600' : 'border-gray-400'}`}>
                {defaultChecked && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
            </div>
            <span className={`ml-3 font-medium ${defaultChecked ? 'text-indigo-900' : 'text-gray-700'}`}>{label}</span>
        </div>
        <span className={`font-bold ${defaultChecked ? 'text-indigo-900' : 'text-gray-800'}`}>{price}</span>
    </label>
);

const AccordionSection = ({ title, sectionId, openSection, setOpenSection, isCompleted, children, summary }) => (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300">
        <div className="flex justify-between items-center p-5 cursor-pointer hover:bg-gray-50"
            onClick={() => setOpenSection(openSection === sectionId ? null : sectionId)}>
            <div className="flex items-center gap-4">
                {isCompleted ? <FiCheckCircle className="text-green-500 text-2xl" /> :
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold transition-all ${openSection === sectionId ? 'border-indigo-600 text-indigo-600' : 'border-gray-300 text-gray-400'}`}>{sectionId}</div>}
                <h2 className="text-lg font-bold text-gray-800">{title}</h2>
            </div>
            {isCompleted && openSection !== sectionId && (
                <button type="button" onClick={(e) => { e.stopPropagation(); setOpenSection(sectionId); }} className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1">
                    <FiEdit2 size={14} /> Sửa
                </button>
            )}
        </div>
        <AnimatePresence>
            {openSection === sectionId && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <div className="p-6 border-t border-gray-200">{children}</div>
                </motion.div>
            )}
        </AnimatePresence>
        {isCompleted && openSection !== sectionId && summary && (<div className="p-5 text-sm text-gray-600 bg-gray-50 border-t border-gray-200">{summary}</div>)}
    </div>
);

// --- DỮ LIỆU TĨNH ---
const cartItems = [
    { id: 1, name: 'Khăn lụa Aura', image: '/product/720x840.png', price: 1250000, quantity: 1 },
    { id: 2, name: 'Đồng hồ da Helios', image: '/product/720x840.png', price: 7300000, quantity: 1 },
    { id: 1, name: 'Khăn lụa Aura', image: '/product/720x840.png', price: 1250000, quantity: 1 },
    { id: 2, name: 'Đồng hồ da Helios', image: '/product/720x840.png', price: 7300000, quantity: 1 },
    { id: 1, name: 'Khăn lụa Aura', image: '/product/720x840.png', price: 1250000, quantity: 1 },
    { id: 2, name: 'Đồng hồ da Helios', image: '/product/720x840.png', price: 7300000, quantity: 1 },
    { id: 1, name: 'Khăn lụa Aura', image: '/product/720x840.png', price: 1250000, quantity: 1 },
    { id: 2, name: 'Đồng hồ da Helios', image: '/product/720x840.png', price: 7300000, quantity: 1 },
];
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const summaryData = {
    subtotal: 8550000,
    shipping: 30000,
    discount: 100000,
    taxes: 676000,
    total: 9156000
};


// === COMPONENT CHÍNH ===
const CheckoutPage = () => {
    const [openSection, setOpenSection] = useState(1);
    const [completedSections] = useState([1, 2]); // Giả sử bước 1 và 2 đã hoàn thành để xem giao diện

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 font-sans">
            <div className="container mx-auto max-w-screen-xl">
                <header className="mb-8">
                    <nav className="flex items-center text-sm text-gray-500  flex-wrap">
                        <Link to="/" className="flex items-center hover:text-indigo-600 transition-colors"><FiHome className="mr-2" /> Trang chủ</Link>
                        <FiChevronRight className="mx-2 text-gray-400" /><Link to="/view-cart" className="flex items-center hover:text-indigo-600 transition-colors">Giỏ hàng</Link>
                        <FiChevronRight className="mx-2 text-gray-400" /><span className={`font-medium ${openSection >= 1 || completedSections.includes(1) ? 'text-gray-700' : 'text-gray-400'}`}>Thông tin</span>
                        <FiChevronRight className="mx-2 text-gray-400" /><span className={`font-medium ${openSection >= 2 || completedSections.includes(2) ? 'text-gray-700' : 'text-gray-400'}`}>Giao hàng</span>
                        <FiChevronRight className="mx-2 text-gray-400" /><span className={`font-medium ${openSection >= 3 || completedSections.includes(3) ? 'text-gray-700' : 'text-gray-400'}`}>Thanh toán</span>
                    </nav>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
                    <main className="order-2 lg:order-1">
                        <div className="space-y-4">
                            <AccordionSection title="Thông tin liên hệ & Giao hàng" sectionId={1} {...{ openSection, setOpenSection, completedSections }} summary="Nguyễn Văn A, 123 Đường ABC, Quận 1, TP.HCM">
                                <form className="space-y-8">
                                    <CustomTextField id="email" label="Địa chỉ email" type="email" />
                                    <CustomTextField id="name" label="Họ và tên" />
                                    <CustomTextField id="address" label="Địa chỉ" />
                                    <div className="grid grid-cols-2 gap-8"><CustomTextField id="city" label="Thành phố" /><CustomTextField id="postalCode" label="Mã bưu điện" /></div>
                                    <Button type="button" className="!w-full !bg-indigo-600 !text-white !font-bold !py-3 !rounded-lg hover:!bg-indigo-700 !transition-colors">Tiếp tục đến giao hàng</Button>
                                </form>
                            </AccordionSection>

                            <AccordionSection title="Phương thức giao hàng" sectionId={2} {...{ openSection, setOpenSection, completedSections }} summary="Giao hàng tiêu chuẩn">
                                <div className="space-y-4">
                                    <CustomRadio id="standard" name="shippingMethod" value="standard" label="Giao hàng tiêu chuẩn" price={formatCurrency(30000)} defaultChecked={true} />
                                    <CustomRadio id="express" name="shippingMethod" value="express" label="Giao hàng hỏa tốc" price={formatCurrency(50000)} />
                                    <Button type="button" className="!w-full !bg-indigo-600 !text-white !font-bold !py-3 !rounded-lg hover:!bg-indigo-700 !transition-colors mt-4">Tiếp tục đến thanh toán</Button>
                                </div>
                            </AccordionSection>

                            <AccordionSection title="Chi tiết thanh toán" sectionId={3} {...{ openSection, setOpenSection, completedSections }}>
                                <form className="space-y-8">
                                    <CustomTextField id="cardName" label="Tên trên thẻ" />
                                    <CustomTextField id="cardNumber" label="Số thẻ" />
                                    <div className="grid grid-cols-2 gap-8"><CustomTextField id="expiryDate" label="Ngày hết hạn (MM/YY)" /><CustomTextField id="cvc" label="Mã bảo mật (CVC)" /></div>
                                    <Button type="button" className="!w-full !flex !items-center !justify-center !gap-2 !bg-black !text-white !font-bold !py-3 !rounded-lg hover:!bg-gray-800 !transition-colors">
                                        <FiLock /><span>Thanh toán {formatCurrency(summaryData.total)}</span>
                                    </Button>
                                </form>
                            </AccordionSection>
                        </div>
                    </main>

                    <aside className="order-1 lg:order-2">
                        <div className="sticky top-8">
                            <div className="bg-white border border-gray-200/80 rounded-2xl">
                                <div className="p-6 border-b border-gray-200"><h2 className="text-lg font-bold">Tóm tắt đơn hàng ({cartItems.length})</h2></div>
                                <div className="p-6 space-y-4 max-h-64 overflow-y-auto custom-scrollbar">{cartItems.map(item => (<div key={item.id} className="flex items-center gap-4"><div className="relative flex-shrink-0"><img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" /><div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-700 text-white text-xs font-bold rounded-full flex items-center justify-center">{item.quantity}</div></div><div className="flex-grow"><p className="font-semibold text-sm leading-tight">{item.name}</p></div><p className="font-semibold text-sm">{formatCurrency(item.price * item.quantity)}</p></div>))}</div>

                                {/* 2 KHUNG VOUCHER RIÊNG BIỆT */}
                                <div className="p-6 border-t border-b border-gray-200 space-y-4">
                                    <div>
                                        <label htmlFor="discount-code" className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1"><FiTag /> Mã giảm giá đơn hàng</label>
                                        <div className="flex"><input id="discount-code" type="text" placeholder="Nhập mã" className="w-full bg-gray-100 border-gray-300 rounded-l-md py-2.5 pl-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" /><button className="bg-gray-200 text-gray-700 font-semibold px-4 rounded-r-md hover:bg-gray-300 transition-colors">Thêm</button></div>
                                        {/* <p className="text-green-600 text-xs mt-1">Đã áp dụng mã: <strong>GIAM100K</strong></p> */}
                                    </div>
                                    <div>
                                        <label htmlFor="shipping-code" className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1"><FiTag /> Mã miễn phí vận chuyển</label>
                                        <div className="flex"><input id="shipping-code" type="text" placeholder="Nhập mã" className="w-full bg-gray-100 border-gray-300 rounded-l-md py-2.5 pl-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" /><button className="bg-gray-200 text-gray-700 font-semibold px-4 rounded-r-md hover:bg-gray-300 transition-colors">Thêm</button></div>
                                        {/* <p className="text-red-500 text-xs mt-1">Mã không hợp lệ</p> */}
                                    </div>
                                </div>

                                <div className="p-6 space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600"><span>Tạm tính</span><span>{formatCurrency(summaryData.subtotal)}</span></div>
                                    <div className="flex justify-between text-sm text-green-600"><span>Giảm giá</span><span>- {formatCurrency(summaryData.discount)}</span></div>
                                    <div className="flex justify-between text-sm text-gray-600"><span>Phí giao hàng</span><span className="font-semibold text-green-600">Miễn phí</span></div>
                                    <div className="flex justify-between text-sm text-gray-600"><span>Thuế (VAT 8%)</span><span>{formatCurrency(summaryData.taxes)}</span></div>
                                </div>
                                <div className="p-6 border-t-2 border-gray-200">
                                    <div className="flex justify-between items-center font-bold text-lg"><span>Tổng cộng</span><span className="text-indigo-600">{formatCurrency(summaryData.total)}</span></div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;