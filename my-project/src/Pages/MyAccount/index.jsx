import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    FiGrid, FiUser, FiShoppingCart, FiMapPin, FiHeart,
    FiStar, FiTag, FiSettings, FiLogOut, FiEdit2, FiClock,
    FiCheckSquare, FiGift, FiArrowRight, FiUploadCloud
} from 'react-icons/fi';
import WishlistPage from './WishList';
import ProfilePage from './ProfileContent';
import OrdersContent from './Orders';
import AddressesContent from './AddressesContent';
import ReviewsContent from './ReviewContent';
import VouchersContent from './VouchersContent';
import SettingsContent from './SettingContent';



// === COMPONENT CON CHO GIAO DIỆN (Định nghĩa trong cùng file) ===

const StatWidget = ({ icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all duration-300">
        <div className={`text-3xl mb-3 ${color}`}>{icon}</div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
);

const RecentOrderCard = ({ order }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl mb-3 hover:bg-slate-100 transition-colors">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                <img src={order.productImage} alt="product" className="w-full h-full object-cover rounded-md" />
            </div>
            <div>
                <p className="font-bold text-gray-800">{order.id}</p>
                <p className="text-sm text-gray-500">{order.date}</p>
            </div>
        </div>
        <div>
            <p className="font-semibold text-right">{order.total}</p>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${order.statusClass}`}>{order.status}</span>
        </div>
    </div>
);


// === CÁC COMPONENT NỘI DUNG CHO TỪNG TAB (Placeholder) ===

const DashboardContent = () => {
    // Nội dung chi tiết của trang Dashboard
    const user = { name: 'Nguyễn Nhật Huy', rank: 'Thành viên Vàng', points: 1500, nextRankPoints: 5000 };
    const recentOrders = [
        { id: '#123-ABC', date: '28/05/2024', total: '1.250.000đ', status: 'Đang xử lý', statusClass: 'bg-yellow-100 text-yellow-800', productImage: '/product/720x840.png' },
        { id: '#122-XYZ', date: '25/05/2024', total: '7.300.000đ', status: 'Đã giao', statusClass: 'bg-green-100 text-green-800', productImage: '/product/720x840.png' },
    ];

    return (
        <div className="space-y-8">
            <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg">
                <p className="font-bold text-lg">Xin chào, {user.name}!</p>
                <p className="text-sm opacity-90">{user.rank} - {user.points} điểm</p>
                <div className="w-full bg-white/30 rounded-full h-2.5 mt-3">
                    <div className="bg-white h-2.5 rounded-full" style={{ width: `${(user.points / user.nextRankPoints) * 100}%` }}></div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <StatWidget icon={<FiClock />} title="Đang chờ xử lý" value="2" color="text-yellow-500" />
                <StatWidget icon={<FiCheckSquare />} title="Đã hoàn thành" value="15" color="text-green-500" />
                <StatWidget icon={<FiGift />} title="Ví voucher" value="5" color="text-blue-500" />
                <StatWidget icon={<FiStar />} title="Chờ đánh giá" value="3" color="text-pink-500" />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Đơn hàng gần đây</h3>
                    <Link to="/my-account?tab=orders" className="text-sm font-medium text-indigo-600 hover:underline flex items-center gap-1">
                        Xem tất cả <FiArrowRight size={14} />
                    </Link>
                </div>
                <div className="space-y-3">{recentOrders.map(order => <RecentOrderCard key={order.id} order={order} />)}</div>
            </div>
        </div>
    );
};

// === COMPONENT CHÍNH CỦA TRANG "MY ACCOUNT" ===
const MyAccountPage = () => {
    // --- Sử dụng `useSearchParams` để quản lý tab từ URL ---
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'dashboard';
    const [anchorEl, setAnchorEl] = React.useState(null);

    // Hàm để thay đổi tab VÀ cập nhật URL
    const setActiveTab = (tabId) => {
        setSearchParams({ tab: tabId });
    };

    const logout = () => {
        setAnchorEl(null);
    }

    const user = { name: 'Nguyễn Nhật Huy', avatar: 'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740' };
    const navigationMenu = [
        { id: 'dashboard', title: 'Tổng quan', icon: <FiGrid /> },
        { id: 'profile', title: 'Thông tin cá nhân', icon: <FiUser /> },
        { id: 'wishlist', title: 'Sản phẩm yêu thích', icon: <FiHeart /> },
        { id: 'orders', title: 'Quản lý đơn hàng', icon: <FiShoppingCart /> },
        { id: 'addresses', title: 'Sổ địa chỉ', icon: <FiMapPin /> },
        { kind: 'divider' },
        { id: 'reviews', title: 'Nhận xét của tôi', icon: <FiStar /> },
        { id: 'vouchers', title: 'Ví voucher', icon: <FiTag /> },
        { kind: 'divider' },
        { id: 'settings', title: 'Cài đặt tài khoản', icon: <FiSettings /> },
        { id: 'logout', title: 'Đăng xuất', icon: <FiLogOut />, isExternalLink: true, href: '/logout' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return <ProfilePage />;
            case 'orders': return <OrdersContent />;
            case 'wishlist': return <WishlistPage />;
            case 'addresses': return <AddressesContent />;
            case 'reviews': return <ReviewsContent />;
            case 'vouchers': return <VouchersContent />;
            case 'settings': return <SettingsContent />;
            case 'dashboard':
            default: return <DashboardContent />;
        }
    };

    return (
        <section className="bg-slate-50 py-8 px-4 sm:px-6">
            <div className="container mx-auto max-w-screen-xl">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight mb-8">
                    Tài khoản của tôi
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* --- Cột Trái: Sidebar Menu --- */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm h-fit sticky top-8">
                            <div className="flex flex-col items-center p-6 border-b border-slate-200">
                                <div className="relative group w-28 h-28 mb-3">
                                    <img src={user.avatar} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
                                    <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <FiUploadCloud size={24} />
                                        <input type="file" id="avatar-upload" className="hidden" />
                                    </label>
                                </div>
                                <h3 className="font-bold text-xl text-gray-800">{user.name}</h3>
                            </div>

                            <nav className="p-4 space-y-1 custom-scrollbar">
                                {navigationMenu.map((item, index) => {
                                    if (item.kind === 'divider') {
                                        return <div key={`divider-${index}`} className="py-2"><hr className="border-slate-200" /></div>;
                                    }
                                    if (item.isExternalLink) {
                                        return (
                                            <Link key={item.id} to={item.href} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-slate-100 hover:text-gray-900 group transition-all duration-200">
                                                <span className="text-xl text-gray-400 group-hover:text-indigo-600">{item.icon}</span>
                                                <span>{item.title}</span>
                                            </Link>
                                        );
                                    }
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group text-left
                                                ${activeTab === item.id
                                                    ? 'bg-indigo-600 text-white shadow-md'
                                                    : 'text-gray-600 hover:bg-slate-100 hover:text-gray-900'}
                                            `}
                                        >
                                            <span className={`text-xl transition-colors ${activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600'}`}>{item.icon}</span>
                                            <span>{item.title}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* --- Cột Phải: Nội dung thay đổi động --- */}
                    <main className="lg:col-span-3">
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 min-h-[60vh]">
                            {renderContent()}
                        </div>
                    </main>
                </div>
            </div>
        </section>
    );
};

export default MyAccountPage;