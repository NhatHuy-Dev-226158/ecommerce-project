import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-international-phone/style.css'; // Import style cho component con

// --- Component Imports for Tabs ---
import ProfileInfoTab from './Info';
import SecurityTab from './Security';
import AddressManagementSection from './AddAddress';

// --- Context Import ---
import { MyContext } from '../../App';

//================================================================================
// MAIN PROFILE PAGE COMPONENT
//================================================================================

/**
 * @component ProfilePage
 * @description Trang chính quản lý hồ sơ người dùng, bao gồm các tab để xem/sửa thông tin cá nhân,
 * địa chỉ và cài đặt bảo mật.
 */
const ProfilePage = () => {
    // --- State Management ---
    const [activeTab, setActiveTab] = useState('profile'); // Quản lý tab đang được chọn

    // --- Hooks ---
    const context = useContext(MyContext);
    const history = useNavigate(); // Ghi chú: Tôi sẽ giữ nguyên tên biến `history` theo yêu cầu của bạn.

    // --- Logic & Effects ---

    // Effect: Kiểm tra quyền truy cập (route guard)
    // Chuyển hướng người dùng về trang đăng nhập nếu chưa có token.
    useEffect(() => {
        const token = localStorage.getItem('accesstoken');
        if (token == null) {
            history('/login');
            context.openAlerBox("error", "Bạn cần đăng nhập để truy cập trang này.");
        }
    }, [context?.isLogin, history, context]); // Thêm context vào dependency array

    // --- Conditional Rendering ---

    // Tránh render nội dung khi chưa xác định trạng thái đăng nhập
    if (context.isLogin === false) {
        return null;
    }

    // --- Main Render ---
    return (
        <div className='w-auto h-auto p-6 border-2 rounded-2xl !border-[#4b4b4b11] bg-[#fefcfc] shadow-lg'>
            {/* Header của trang */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Hồ sơ và Bảo mật</h2>
                <p className="text-gray-500 mt-1">Quản lý thông tin và giúp tài khoản của bạn an toàn hơn.</p>
            </div>

            {/* Thanh điều hướng các tab */}
            <div className="border-b border-gray-200 mt-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('profile')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'profile' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Hồ sơ
                    </button>
                    <button onClick={() => setActiveTab('address')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'address' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Địa chỉ
                    </button>
                    <button onClick={() => setActiveTab('security')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'security' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Bảo mật
                    </button>
                </nav>
            </div>

            {/* Vùng hiển thị nội dung của tab được chọn */}
            <div className="mt-8">
                {activeTab === 'profile' && <ProfileInfoTab />}
                {activeTab === 'address' && <AddressManagementSection />}
                {activeTab === 'security' && <SecurityTab />}
            </div>
        </div>
    );
};

export default ProfilePage;