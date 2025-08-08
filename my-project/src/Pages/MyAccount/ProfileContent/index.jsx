import React, { useState } from 'react';
import { FiMonitor, FiSmartphone, FiUploadCloud } from 'react-icons/fi';
import toast from 'react-hot-toast';

// --- CÁC COMPONENT CON TÙY CHỈNH (Không thay đổi về JSX, nhưng giờ sẽ nhận state) ---
const CustomTextField = ({ id, label, type = 'text', value, onChange, name }) => (
    <div className="relative group">
        <input id={id} name={name || id} type={type} required value={value} onChange={onChange}
            className="block w-full px-1 pt-4 pb-1 text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer transition"
            placeholder=" " />
        <label htmlFor={id} className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">
            {label}
        </label>
    </div>
);
const ToggleSwitch = ({ enabled, setEnabled }) => (
    <button onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${enabled ? 'bg-indigo-600' : 'bg-gray-300'}`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);


// === CÁC COMPONENT NỘI DUNG CHO TỪNG TAB (Giờ đã có logic) ===

const ProfileInfoTab = () => {
    const [profileData, setProfileData] = useState({
        fullName: 'Nguyễn Nhật Huy',
        nickname: 'NhatHuy',
        dob: '2000-01-01',
        phone: '0339656885',
        email: 'nhathuy@example.com'
    });
    const [avatarPreview, setAvatarPreview] = useState("https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740");
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Giả lập API call
        setTimeout(() => {
            console.log("Saving profile data:", profileData);
            setIsLoading(false);
            toast.success("Cập nhật thông tin thành công!");
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            <div className="md:col-span-1">
                <h3 className="font-bold text-lg mb-2">Ảnh đại diện</h3>
                <div className="flex flex-col items-center">
                    <div className="relative group w-40 h-40">
                        <img src={avatarPreview} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
                        <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <FiUploadCloud size={32} />
                            <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </label>
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-3">PNG, JPG, GIF không quá 5MB.</p>
                </div>
            </div>
            <div className="md:col-span-2 space-y-8">
                <div>
                    <h3 className="font-bold text-lg mb-4">Thông tin cá nhân</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <CustomTextField id="fullName" label="Họ và tên" value={profileData.fullName} onChange={handleInputChange} />
                        <CustomTextField id="nickname" label="Nickname" value={profileData.nickname} onChange={handleInputChange} />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <CustomTextField id="dob" label="Ngày sinh" type="date" value={profileData.dob} onChange={handleInputChange} />
                    <CustomTextField id="phone" label="Số điện thoại" type="tel" value={profileData.phone} onChange={handleInputChange} />
                </div>
                <div>
                    <div className="relative group">
                        <input id="email" type="email" disabled value={profileData.email}
                            className="block w-full px-1 pt-4 pb-1 text-md text-gray-500 bg-gray-100 border-0 border-b-2 border-gray-300" />
                        <label htmlFor="email" className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0]">Email</label>
                    </div>
                    <p className="text-[18px] text-gray-500 mt-2"><a href="#" className="text-indigo-600 hover:underline">Đổi tài khoản.</a></p>
                </div>
                <div className="flex justify-end">
                    <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed">
                        {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>
        </form>
    );
};

const SecurityTab = () => {
    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            toast.error("Mật khẩu mới không khớp!");
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            console.log("Changing password...");
            setIsLoading(false);
            toast.success("Đổi mật khẩu thành công!");
            setPasswords({ old: '', new: '', confirm: '' });
        }, 1500);
    };

    return (
        <div className="pt-6 space-y-12">
            <div>
                <h3 className="font-bold text-lg mb-4">Đổi mật khẩu</h3>
                <form onSubmit={handlePasswordSubmit} className="p-6 bg-slate-50 rounded-xl space-y-8">
                    <CustomTextField id="oldPassword" name="old" label="Mật khẩu hiện tại" type="password" value={passwords.old} onChange={handlePasswordChange} />
                    <CustomTextField id="newPassword" name="new" label="Mật khẩu mới" type="password" value={passwords.new} onChange={handlePasswordChange} />
                    <CustomTextField id="confirmPassword" name="confirm" label="Xác nhận mật khẩu mới" type="password" value={passwords.confirm} onChange={handlePasswordChange} />
                    <ul className="text-xs text-gray-500 list-disc list-inside space-y-1"><li>Ít nhất 8 ký tự, có chữ hoa, số...</li></ul>
                    <div className="flex justify-end">
                        <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300">
                            {isLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
                        </button>
                    </div>
                </form>
            </div>
            <div>
                <h3 className="font-bold text-lg mb-4">Xác thực hai yếu tố (2FA)</h3>
                <div className="p-6 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-800">Bật xác thực hai yếu tố</p>
                        <p className="text-sm text-gray-500">Trạng thái hiện tại: <span className={is2FAEnabled ? 'font-bold text-green-600' : 'font-bold text-red-600'}>{is2FAEnabled ? 'Đã bật' : 'Đã tắt'}</span></p>
                    </div>
                    <ToggleSwitch enabled={is2FAEnabled} setEnabled={setIs2FAEnabled} />
                </div>
            </div>
            <div>
                <h3 className="font-bold text-lg mb-4">Thiết bị đã đăng nhập</h3>
                <div className="p-6 bg-slate-50 rounded-xl space-y-4">
                    <div className="flex items-center justify-between"><div className="flex items-center gap-4"><FiMonitor size={24} className="text-gray-600" /><div><p className="font-medium">Windows 11, Chrome</p><p className="text-sm text-green-600">Active now</p></div></div></div><hr />
                    <div className="flex items-center justify-between"><div className="flex items-center gap-4"><FiSmartphone size={24} className="text-gray-500" /><div><p className="font-medium">iPhone 15 Pro</p><p className="text-sm text-gray-500">Đăng nhập 2 ngày trước</p></div></div><button className="text-xs text-gray-500 hover:underline">Đăng xuất</button></div><hr />
                    <div className="flex justify-end pt-2">
                        <button className="text-sm font-medium text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg transition-colors">
                            Đăng xuất khỏi tất cả thiết bị khác
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// === COMPONENT CHÍNH CỦA TRANG PROFILE ===
const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div>
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
                    <button onClick={() => setActiveTab('security')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'security' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Bảo mật
                    </button>
                </nav>
            </div>
            <div>
                {activeTab === 'profile' && <ProfileInfoTab />}
                {activeTab === 'security' && <SecurityTab />}
            </div>
        </div>
    );
};

export default ProfilePage;