import React, { useContext, useEffect, useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { FiMonitor, FiSmartphone } from 'react-icons/fi';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';

//================================================================================
// SUB-COMPONENTS (Thành phần giao diện con)
//================================================================================

// Component TextField tùy chỉnh cho mật khẩu
const CustomPassTextField = (props) => {
    return (
        <TextField
            fullWidth
            variant="standard"
            {...props}
        />
    );
};

// Component Switch tùy chỉnh
const ToggleSwitch = ({ enabled, setEnabled }) => (
    <button type="button" onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${enabled ? 'bg-indigo-600' : 'bg-gray-300'}`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);


//================================================================================
// MAIN SECURITY TAB COMPONENT
//================================================================================

/**
 * @component SecurityTab
 * @description Tab "Bảo mật" trong trang Profile, cho phép người dùng đổi mật khẩu,
 * quản lý 2FA và các thiết bị đã đăng nhập.
 */
const SecurityTab = () => {
    // --- State Management ---
    const context = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(false);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false); // Logic 2FA chưa được implement

    // State để quản lý việc ẩn/hiện các trường mật khẩu
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });

    // State cho form đổi mật khẩu
    const [changePassword, setChangePassword] = useState({
        email: '', oldPassword: '', newPassword: '', confirmPassword: ''
    });

    // --- Logic & Effects ---

    // Lấy email người dùng từ context
    useEffect(() => {
        if (context?.userData?.email) {
            setChangePassword(prevState => ({ ...prevState, email: context.userData.email }));
        }
    }, [context?.userData]);


    // --- Event Handlers ---

    // Cập nhật state của form khi người dùng nhập liệu
    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setChangePassword(prevState => ({ ...prevState, [name]: value }));
    };

    // Xử lý ẩn/hiện mật khẩu
    const toggleShowPassword = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };
    const handleMouseDownPassword = (event) => event.preventDefault();

    // Xử lý logic khi submit form đổi mật khẩu
    const handlePasswordSubmit = (event) => {
        event.preventDefault();
        const { oldPassword, newPassword, confirmPassword } = changePassword;

        // Validation phía client
        if (!oldPassword || !newPassword || !confirmPassword) {
            context.openAlerBox("error", "Vui lòng điền đầy đủ thông tin.");
            return;
        }
        if (newPassword !== confirmPassword) {
            context.openAlerBox("error", "Mật khẩu mới và mật khẩu xác nhận không khớp.");
            return;
        }

        setIsLoading(true);
        postData(`/api/user/change-password`, changePassword)
            .then((res) => {
                if (res?.error !== true) {
                    context.openAlerBox("success", res?.message);
                    // Reset form sau khi thành công
                    setChangePassword(prev => ({ ...prev, oldPassword: '', newPassword: '', confirmPassword: '' }));
                } else {
                    context.openAlerBox("error", res?.message);
                }
            })
            .finally(() => setIsLoading(false));
    };


    // --- Render ---
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            {/* Phần Đổi mật khẩu */}
            <div>
                <h3 className="font-bold text-lg mb-4">Đổi mật khẩu</h3>
                <form onSubmit={handlePasswordSubmit} noValidate className="p-6 bg-slate-50 rounded-xl space-y-8">
                    <CustomPassTextField
                        id="oldPassword" label="Mật khẩu hiện tại"
                        type={showPasswords.old ? 'text' : 'password'}
                        name='oldPassword' value={changePassword.oldPassword} onChange={onChangeInput}
                        disabled={isLoading}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => toggleShowPassword('old')} onMouseDown={handleMouseDownPassword} edge="end">
                                        {showPasswords.old ? <IoIosEye /> : <IoIosEyeOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <CustomPassTextField
                        id="newPassword" label="Mật khẩu mới"
                        type={showPasswords.new ? 'text' : 'password'}
                        name='newPassword' value={changePassword.newPassword} onChange={onChangeInput}
                        disabled={isLoading}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => toggleShowPassword('new')} onMouseDown={handleMouseDownPassword} edge="end">
                                        {showPasswords.new ? <IoIosEye /> : <IoIosEyeOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <CustomPassTextField
                        id="confirmPassword" label="Xác nhận mật khẩu mới"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        name='confirmPassword' value={changePassword.confirmPassword} onChange={onChangeInput}
                        disabled={isLoading}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => toggleShowPassword('confirm')} onMouseDown={handleMouseDownPassword} edge="end">
                                        {showPasswords.confirm ? <IoIosEye /> : <IoIosEyeOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <ul className="text-xs text-gray-500 list-disc list-inside space-y-1"><li>Ít nhất 8 ký tự, có chữ hoa, số...</li></ul>
                    <div className="flex justify-end">
                        <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300">
                            {isLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Phần 2FA và Thiết bị đã đăng nhập (giao diện tĩnh) */}
            <div>
                <h3 className="font-bold text-lg mb-4">Xác thực hai yếu tố (2FA)</h3>
                <div className="p-6 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-800">Bật xác thực hai yếu tố</p>
                        <p className="text-sm text-gray-500">Trạng thái hiện tại: <span className={is2FAEnabled ? 'font-bold text-green-600' : 'font-bold text-red-600'}>{is2FAEnabled ? 'Đã bật' : 'Đã tắt'}</span></p>
                    </div>
                    <ToggleSwitch enabled={is2FAEnabled} setEnabled={setIs2FAEnabled} />
                </div>

                <h3 className="font-bold text-lg mb-4 mt-8">Thiết bị đã đăng nhập</h3>
                <div className="py-3 px-6 bg-slate-50 rounded-xl space-y-4">
                    <div className="flex items-center justify-between"><div className="flex items-center gap-4"><FiMonitor size={24} className="text-gray-600" /><div><p className="font-medium">Windows 11, Chrome</p><p className="text-sm text-green-600">Active now</p></div></div></div><hr />
                    <div className="flex items-center justify-between"><div className="flex items-center gap-4"><FiSmartphone size={24} className="text-gray-500" /><div><p className="font-medium">iPhone 15 Pro</p><p className="text-sm text-gray-500">Đăng nhập 2 ngày trước</p></div></div><button className="text-xs text-gray-500 hover:underline">Đăng xuất</button></div><hr />
                    <div className="flex justify-end">
                        <button className="text-sm font-medium text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg transition-colors">
                            Đăng xuất khỏi tất cả thiết bị khác
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityTab;