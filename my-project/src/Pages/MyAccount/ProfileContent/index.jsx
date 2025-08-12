import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-international-phone/style.css';
import ProfileInfoTab from './Info';
import SecurityTab from './Security';
import AddressManagementSection from './AddAddress';
import { MyContext } from '../../../App';


// === COMPONENT CHÍNH CỦA TRANG PROFILE ===
const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const context = useContext(MyContext);
    const history = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accesstoken');
        if (token == null) {
            history('/login');
            context.openAlerBox("error", "Bạn cần đăng nhập để truy cập trang này.");
        }

    }, [context?.isLogin, history])


    if (context.isLogin === false) {
        return null;
    }

    return (
        <div className='w-auto h-auto'>
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Hồ sơ và Bảo mật</h2>
                <p className="text-gray-500 mt-1">Quản lý thông tin và giúp tài khoản của bạn an toàn hơn.</p>
            </div>
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
            <div>
                {activeTab === 'profile' && <ProfileInfoTab />}
                {activeTab === 'address' && <AddressManagementSection />}
                {activeTab === 'security' && <SecurityTab />}
            </div>
        </div>
    );
};

export default ProfilePage;