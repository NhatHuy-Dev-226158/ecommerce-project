import React, { useContext, useEffect, useState } from 'react';
import { FiMonitor, FiSmartphone } from 'react-icons/fi';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';

import 'react-international-phone/style.css';
import { MyContext } from '../../../App';
import { postData } from '../../../utils/api';

const CustomPassTextField = ({
    id,
    label,
    name,
    type,
    value,
    onChange,
    disabled,
    required,
    ...props
}) => {
    return (
        <TextField
            fullWidth
            id={id}
            label={label}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            variant="standard"

            {...props}
        />
    );
};

const ToggleSwitch = ({ enabled, setEnabled }) => (
    <button onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${enabled ? 'bg-indigo-600' : 'bg-gray-300'}`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

// === CÁC COMPONENT NỘI DUNG CHO TỪNG TAB (Giờ đã có logic) ==

const SecurityTab = () => {
    const context = useContext(MyContext)
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const [isShowNewPassword, setIsShowNewPassword] = useState(false);
    const handleClickShowPassword = () => setIsShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setIsShowConfirmPassword((show) => !show);
    const handleClickShowNewPassword = () => setIsShowNewPassword((show) => !show);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [changePassword, setChangePassword] = useState({
        email: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setChangePassword(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        if (context?.userData?._id) {
            setChangePassword(prevState => ({
                ...prevState,
                email: context.userData.email || ''
            }));
        }
    }, [context?.userData]);

    const handlePasswordSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        const { oldPassword, newPassword, confirmPassword } = changePassword;
        if (!oldPassword && !newPassword && !confirmPassword) {
            context.openAlerBox("error", "Vui lòng điền đầy đủ thông tin để đăng ký.");
            setIsLoading(false);
            return;
        }
        if (!oldPassword) {
            context.openAlerBox("error", "Vui lòng nhập mật khẩu cũ.");
            setIsLoading(false);
            return;
        }
        if (!newPassword) {
            context.openAlerBox("error", "Bạn chưa nhập mật khẩu mới.");
            setIsLoading(false);
            return;
        }
        if (!confirmPassword) {
            context.openAlerBox("error", "Bạn chưa xác nhân mật khẩu mới.");
            setIsLoading(false);
            return;
        }
        if (!newPassword !== !confirmPassword) {
            context.openAlerBox("error", "Mật khẩu mới và mật khẩu xác nhận không khớp.");
            setIsLoading(false);
            return;
        }
        postData(`/api/user/change-password`, changePassword, { withCredentials: true }).then((res) => {
            console.log(res);
            if (res?.error !== true) {
                setIsLoading(false);
                context.openAlerBox("success", res?.message);
            } else {
                context.openAlerBox("error", res?.message);
                setIsLoading(false);
            }
        });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 ">
            <div>
                <h3 className="font-bold text-lg mb-4">Đổi mật khẩu</h3>
                <form onSubmit={handlePasswordSubmit} noValidate className="p-6 bg-slate-50 rounded-xl space-y-8">
                    <CustomPassTextField
                        id="oldPassword"
                        label="Mật khẩu hiện tại"
                        type={isShowPassword ? 'text' : 'password'}
                        name='oldPassword'
                        value={changePassword.oldPassword}
                        onChange={onChangeInput}
                        disabled={isLoading === true ? true : false}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {changePassword.oldPassword && (
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {isShowPassword ? <IoIosEye /> : <IoIosEyeOff />}
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            )
                        }}
                    />
                    <CustomPassTextField
                        id="newPassword"
                        label="Mật khẩu mới"
                        type={isShowNewPassword ? 'text' : 'password'}
                        name='newPassword'
                        value={changePassword.newPassword}
                        onChange={onChangeInput}
                        disabled={isLoading === true ? true : false}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {changePassword.newPassword && (
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowNewPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {isShowNewPassword ? <IoIosEye /> : <IoIosEyeOff />}
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            )
                        }}
                    />
                    <CustomPassTextField
                        id="confirmPassword"
                        label="Xác nhận mật khẩu mới"
                        type={isShowConfirmPassword ? 'text' : 'password'}
                        name='confirmPassword'
                        value={changePassword.confirmPassword}
                        onChange={onChangeInput}
                        disabled={isLoading === true ? true : false}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {changePassword.confirmPassword && (
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowConfirmPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {isShowConfirmPassword ? <IoIosEye /> : <IoIosEyeOff />}
                                        </IconButton>
                                    )}
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
            <div>
                <h3 className="font-bold text-lg mb-4">Xác thực hai yếu tố (2FA)</h3>

                <div>
                    <div className="p-6 bg-slate-50 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-800">Bật xác thực hai yếu tố</p>
                            <p className="text-sm text-gray-500">Trạng thái hiện tại: <span className={is2FAEnabled ? 'font-bold text-green-600' : 'font-bold text-red-600'}>{is2FAEnabled ? 'Đã bật' : 'Đã tắt'}</span></p>
                        </div>
                        <ToggleSwitch enabled={is2FAEnabled} setEnabled={setIs2FAEnabled} />
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4 mt-5">Thiết bị đã đăng nhập</h3>
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
        </div>
    );
};
export default SecurityTab; 