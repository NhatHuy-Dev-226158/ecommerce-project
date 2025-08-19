import React, { useState, useMemo, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// --- Thư viện UI & Icons ---
import { FiChevronRight, FiHome, FiLock, FiTag, FiCheckCircle, FiEdit2 } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@mui/material';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';

// --- CÁC COMPONENT CON TÙY CHỈNH ---
const CustomTextField = ({ id, label, type = 'text', value, onChange }) => (
    <div className="relative group">
        <input
            id={id} name={id} type={type} required
            value={value}
            onChange={onChange}
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

const CustomRadio = ({ id, name, value, label, checked, onChange }) => (
    <label htmlFor={id} className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all duration-200 ${checked ? 'border-indigo-600 ring-2 ring-indigo-200 bg-indigo-50/50' : 'border-gray-300 hover:border-gray-400'}`}>
        <div className="flex items-center">
            <input type="radio" id={id} name={name} value={value} checked={checked} onChange={onChange} className="sr-only peer" />
            <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${checked ? 'border-indigo-600' : 'border-gray-400'}`}>
                {checked && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>}
            </div>
            <span className={`ml-3 font-medium ${checked ? 'text-indigo-900' : 'text-gray-700'}`}>{label}</span>
        </div>
    </label>
);

const AccordionSection = ({ title, sectionId, openSection, setOpenSection, isCompleted, children, summary }) => (
    // Component này không cần thay đổi
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

// Hàm tiện ích
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);


// === COMPONENT CHÍNH ===
const CheckoutPage = () => {
    // --- KẾT NỐI CONTEXT & ROUTER ---
    const context = useContext(MyContext);
    const { cart, userData, fetchCartData, openAlerBox } = context;
    const navigate = useNavigate();

    // --- QUẢN LÝ STATE CHO FORM & LUỒNG THANH TOÁN ---
    const [openSection, setOpenSection] = useState(1);
    const [completedSections, setCompletedSections] = useState([]);
    const [shippingAddress, setShippingAddress] = useState({
        fullName: userData?.name || '',
        phone: '',
        address: '',
        city: '',
        country: 'Vietnam',
    });
    const [paymentMethod, setPaymentMethod] = useState('COD'); //Cash on Delivery

    // --- TÍNH TOÁN DỮ LIỆU TÓM TẮT ĐƠN HÀNG ---
    const summaryData = useMemo(() => {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = subtotal > 0 ? 30000 : 0;
        return {
            subtotal,
            shipping,
            total: subtotal + shipping,
        };
    }, [cart]);

    // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleNextStep = (currentStep) => {
        // Validate thông tin giao hàng
        if (currentStep === 1) {
            const { fullName, phone, address, city } = shippingAddress;
            if (!fullName || !phone || !address || !city) {
                openAlerBox("error", "Vui lòng điền đầy đủ thông tin giao hàng.");
                return;
            }
        }

        // Cập nhật các bước đã hoàn thành và mở bước tiếp theo
        if (!completedSections.includes(currentStep)) {
            setCompletedSections(prev => [...prev, currentStep]);
        }
        setOpenSection(currentStep + 1);
    };

    const handlePlaceOrder = async () => {
        // Kiểm tra lần cuối trước khi đặt hàng
        if (!completedSections.includes(1) || !completedSections.includes(2)) {
            openAlerBox("error", "Vui lòng hoàn thành các bước thông tin và giao hàng.");
            return;
        }

        const payload = {
            shippingAddress: {
                ...shippingAddress,
                // Đảm bảo không gửi các trường không cần thiết nếu có
            },
            paymentMethod,
        };

        try {
            const result = await postData('/api/orders/', payload);
            if (result.success) {
                openAlerBox("success", "Đặt hàng thành công!");
                fetchCartData(); // Làm mới giỏ hàng (sẽ trống)
                navigate('/my-account?tab=orders'); // Chuyển đến trang quản lý đơn hàng
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            openAlerBox("error", error.message || "Đã có lỗi xảy ra khi đặt hàng.");
        }
    };

    // Nếu giỏ hàng trống, chuyển về trang giỏ hàng (sẽ hiển thị EmptyCart)
    if (cart.length === 0 && userData) {
        navigate('/view-cart');
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 font-sans">
            <div className="container mx-auto max-w-screen-xl">
                <header className="mb-8">
                    <nav className="flex items-center text-sm text-gray-500 flex-wrap">
                        <Link to="/" className="flex items-center hover:text-indigo-600"><FiHome className="mr-2" /> Trang chủ</Link>
                        <FiChevronRight className="mx-2" /><Link to="/view-cart" className="hover:text-indigo-600">Giỏ hàng</Link>
                        <FiChevronRight className="mx-2" /><span className={`font-medium ${openSection >= 1 ? 'text-gray-700' : 'text-gray-400'}`}>Thông tin</span>
                        <FiChevronRight className="mx-2" /><span className={`font-medium ${openSection >= 2 ? 'text-gray-700' : 'text-gray-400'}`}>Giao hàng</span>
                        <FiChevronRight className="mx-2" /><span className={`font-medium ${openSection >= 3 ? 'text-gray-700' : 'text-gray-400'}`}>Thanh toán</span>
                    </nav>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
                    <main className="order-2 lg:order-1">
                        <div className="space-y-4">

                            {/* --- BƯỚC 1: THÔNG TIN GIAO HÀNG --- */}
                            <AccordionSection title="Thông tin liên hệ & Giao hàng" sectionId={1} openSection={openSection} setOpenSection={setOpenSection} isCompleted={completedSections.includes(1)}
                                summary={`${shippingAddress.fullName}, ${shippingAddress.address}, ${shippingAddress.city}`}>
                                <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleNextStep(1); }}>
                                    <CustomTextField id="email" label="Địa chỉ email" type="email" value={userData?.email || ''} onChange={() => { }} />
                                    <CustomTextField id="fullName" name="fullName" label="Họ và tên" value={shippingAddress.fullName} onChange={handleInputChange} />
                                    <CustomTextField id="phone" name="phone" label="Số điện thoại" value={shippingAddress.phone} onChange={handleInputChange} />
                                    <CustomTextField id="address" name="address" label="Địa chỉ" value={shippingAddress.address} onChange={handleInputChange} />
                                    <CustomTextField id="city" name="city" label="Thành phố" value={shippingAddress.city} onChange={handleInputChange} />
                                    <Button type="submit" className="!w-full !bg-indigo-600 !text-white !font-bold !py-3 !rounded-lg hover:!bg-indigo-700 !transition-colors">Tiếp tục đến giao hàng</Button>
                                </form>
                            </AccordionSection>

                            {/* --- BƯỚC 2: PHƯƠNG THỨC GIAO HÀNG --- */}
                            <AccordionSection title="Phương thức giao hàng" sectionId={2} openSection={openSection} setOpenSection={setOpenSection} isCompleted={completedSections.includes(2)} summary="Giao hàng tiêu chuẩn">
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-600">Hiện tại chúng tôi chỉ hỗ trợ giao hàng tiêu chuẩn.</p>
                                    <Button type="button" onClick={() => handleNextStep(2)} className="!w-full !bg-indigo-600 !text-white !font-bold !py-3 !rounded-lg hover:!bg-indigo-700 !transition-colors mt-4">Tiếp tục đến thanh toán</Button>
                                </div>
                            </AccordionSection>

                            {/* --- BƯỚC 3: PHƯƠNG THỨC THANH TOÁN --- */}
                            <AccordionSection title="Chi tiết thanh toán" sectionId={3} openSection={openSection} setOpenSection={setOpenSection} isCompleted={completedSections.includes(3)}>
                                <div className="space-y-4">
                                    <CustomRadio id="cod" name="paymentMethod" value="COD" label="Thanh toán khi nhận hàng (COD)" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} />
                                    <CustomRadio id="online" name="paymentMethod" value="ONLINE" label="Thanh toán Online (Sắp có)" checked={paymentMethod === 'ONLINE'} onChange={() => { }} disabled />
                                    <Button type="button" onClick={handlePlaceOrder} className="!w-full !flex !items-center !justify-center !gap-2 !bg-black !text-white !font-bold !py-3 !rounded-lg hover:!bg-gray-800 !transition-colors mt-4">
                                        <FiLock /><span>Hoàn tất đặt hàng</span>
                                    </Button>
                                </div>
                            </AccordionSection>

                        </div>
                    </main>

                    {/* --- CỘT PHẢI: TÓM TẮT ĐƠN HÀNG --- */}
                    <aside className="order-1 lg:order-2">
                        <div className="sticky top-8">
                            <div className="bg-white border border-gray-200/80 rounded-2xl">
                                <div className="p-6 border-b border-gray-200"><h2 className="text-lg font-bold">Tóm tắt đơn hàng ({cart.length})</h2></div>
                                <div className="p-6 space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
                                    {cart.map(item => (
                                        <div key={item.cartItemId} className="flex items-center gap-4">
                                            <div className="relative flex-shrink-0">
                                                <img src={item.images[0]} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-700 text-white text-xs font-bold rounded-full flex items-center justify-center">{item.quantity}</div>
                                            </div>
                                            <div className="flex-grow"><p className="font-semibold text-sm leading-tight">{item.name}</p></div>
                                            <p className="font-semibold text-sm">{formatCurrency(item.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 border-t border-b border-gray-200 space-y-4">
                                    <label htmlFor="discount-code" className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1"><FiTag /> Mã giảm giá</label>
                                    <div className="flex">
                                        <input id="discount-code" type="text" placeholder="Nhập mã" className="w-full bg-gray-100 border-gray-300 rounded-l-md py-2.5 pl-4 focus:ring-2 focus:ring-indigo-500 transition" />
                                        <button className="bg-gray-200 text-gray-700 font-semibold px-4 rounded-r-md hover:bg-gray-300">Áp dụng</button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600"><span>Tạm tính</span><span>{formatCurrency(summaryData.subtotal)}</span></div>
                                    <div className="flex justify-between text-sm text-gray-600"><span>Phí giao hàng</span><span>{formatCurrency(summaryData.shipping)}</span></div>
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