import React, { useContext, useEffect, useState } from 'react';
import { FiMonitor, FiSmartphone } from 'react-icons/fi';
import { CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { MyContext } from '../../App';
import { PhoneInput } from 'react-international-phone';
import { postData, updateData, uploadImage } from '../../utils/api';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { FiUploadCloud } from 'react-icons/fi';
import 'react-international-phone/style.css';

// --- CÁC COMPONENT CON TÙY CHỈNH (Không thay đổi về JSX, nhưng giờ sẽ nhận state) ---
const CustomTextField = React.forwardRef((props, ref) => {
    const {
        id,
        label,
        type = 'text',
        value,
        onChange,
        name,
        InputProps,
        inputProps,
        focused,
        ownerState,
        error,
        ...other
    } = props;

    return (
        <div ref={ref} className="relative group flex items-center" {...other}>
            <input
                id={id}
                name={name || id}
                type={type}
                required
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
            {InputProps?.endAdornment}
        </div>
    );
});
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

// === CÁC COMPONENT NỘI DUNG CHO TỪNG TAB (Giờ đã có logic) ===
const ProfileInfoTab = () => {
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false)
    const [userId, setUserId] = useState("")
    const context = useContext(MyContext)
    const [formFields, setFormFields] = useState({
        name: '',
        email: '',
        mobile: '',
        birthday: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleDateChange = (newValue) => {
        setFormFields(prevState => ({
            ...prevState,
            birthday: newValue ? newValue.format('YYYY-MM-DD') : ''
        }));
    };

    const onChangeInput = (e) => {
        const { name, value } = e.target;

        if (name === 'mobile') {
            const numericValue = /^[0-9]*$/;
            if (value === '' || numericValue.test(value)) {
                setFormFields(prevState => ({ ...prevState, [name]: value }));
            }
        } else {
            setFormFields(prevState => ({ ...prevState, [name]: value }));
        }
    };
    const handlePhoneChange = (phoneValue) => {
        setFormFields(prevState => ({
            ...prevState,
            mobile: phoneValue
        }));
    };

    useEffect(() => {
        if (context?.userData?._id) {
            setUserId(context.userData._id);
            setFormFields({
                name: context?.userData?.name || '',
                email: context?.userData?.email || '',
                mobile: context.userData.mobile ? String(context.userData.mobile) : '', birthday: context?.userData?.birthday || ''
            });
        }
    }, [context?.userData]);


    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        const { name, email, mobile } = formFields;
        if (!name && !email && !mobile) {
            context.openAlerBox("error", "Vui lòng điền đầy đủ thông tin để đăng ký.");
            setIsLoading(false);
            return;
        }
        if (!name) {
            context.openAlerBox("error", "Bạn chưa nhập tên.");
            setIsLoading(false);
            return;
        }
        if (!email) {
            context.openAlerBox("error", "Bạn chưa nhập địa chỉ email.");
            setIsLoading(false);
            return;
        }
        if (!mobile) {
            context.openAlerBox("error", "Bạn chưa nhập số điện thoại.");
            setIsLoading(false);
            return;
        }
        updateData(`/api/user/${userId}`, formFields, { withCredentials: true }).then((res) => {
            console.log(res);
            if (res?.error !== true) {
                setIsLoading(false);
                context.openAlerBox("success", res?.data?.message);
            } else {
                context.openAlerBox("error", res?.data?.message);
                setIsLoading(false);
            }
        });
    };


    useEffect(() => {
        const userAvtar = [];
        if (context?.userData?.avatar !== "" && context?.userData?.avatar !== undefined) {
            userAvtar.push(context?.userData?.avatar);
            setPreviews(userAvtar);
        }
    }, [context?.userData])

    useEffect(() => {
        const token = localStorage.getItem('accesstoken');
        if (token == null) {
            history('/');
            context.openAlerBox("error", "Bạn cần đăng nhập để truy cập trang này.");
        }

    }, [context?.isLogin, history])

    if (context.isLogin === false) {
        return null;
    }

    let selectedImages = [];
    const formdata = new FormData();

    const onChangeFile = async (e, apiEndPoint) => {
        try {
            setPreviews([]);
            const files = e.target.files;
            setUploading(true);


            for (var i = 0; i < files.length; i++) {
                if (files[i] && (files[i].type === "image/jpeg" || files[i].type === "image/jpg" ||
                    files[i].type === "image/png" ||
                    files[i].type === "image/webp")
                ) {

                    const file = files[i];
                    selectedImages.push(file);
                    formdata.append('avatar', file);
                } else {
                    context.openAlerBox('error', 'Vui lòng chọn ảnh JPG, PNG hoặc WEBP')
                    setUploading(false)
                    return false;
                }
            }


            uploadImage('/api/user/user-avatar', formdata).then((res) => {
                setUploading(false)
                let avatar = [];
                console.log(res?.data?.avatar);
                avatar.push(res?.data?.avatar);
                setPreviews(avatar);

            })

        } catch (error) {
            console.log(error)
        }
    }

    return (

        <LocalizationProvider dateAdapter={AdapterDayjs}>

            <form onSubmit={handleSubmit} noValidate className="w-full pt-6 ">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                    <div className=" flex-shrink-0 mx-auto md:mx-0">
                        <div className="relative group w-32 h-32 rounded-full bg-slate-300 flex items-center justify-center">
                            {
                                uploading ? (
                                    <CircularProgress color='inherit' />
                                ) : (
                                    <>
                                        {previews?.length > 0 ? (
                                            previews.map((img, index) => (
                                                <img src={img} key={index} alt='user avatar' className="w-full h-full rounded-full object-cover" />
                                            ))
                                        ) : (
                                            <img src='/user.png' alt='user avatar' className="w-full h-full rounded-full object-cover" />
                                        )}
                                    </>
                                )
                            }
                            <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <FiUploadCloud size={32} />
                                <input type="file" id="avatar-upload" className="hidden"
                                    onChange={onChangeFile}
                                    name='avatar'
                                    accept='image/*'
                                />
                            </label>
                        </div>
                    </div>
                    <div className="flex-grow space-y-8 w-full">
                        <div>
                            <div className='flex items-center justify-between mb-4'>
                                <h3 className="font-bold text-lg">Thông tin cá nhân</h3>
                                <p className="text-[18px] text-right text-gray-500 mt-2"><a href="/login" className="text-indigo-600 hover:underline">Sử dụng tài khoản khác.</a></p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <CustomTextField
                                    id="fullName"
                                    label="Họ và tên"
                                    name='name'
                                    value={formFields.name}
                                    onChange={onChangeInput}
                                    disabled={isLoading === true ? true : false}
                                />
                                <PhoneInput
                                    defaultCountry="vn"
                                    value={formFields.mobile}
                                    disabled={isLoading === true ? true : false}
                                    onChange={handlePhoneChange}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <DatePicker
                                label="Ngày sinh"
                                value={formFields.birthday ? dayjs(formFields.birthday) : null}
                                onChange={handleDateChange}
                                disabled={isLoading}
                                format="DD/MM/YYYY"
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        variant: 'standard',
                                    },
                                }}
                            />
                            <div className="relative group">
                                <input
                                    id="email"
                                    type="email"
                                    disabled
                                    name='email'
                                    value={formFields.email}
                                    onChange={onChangeInput}
                                    className=" block w-full px-1 pt-4 pb-1 text-md bg-slate-300 text-gray-500 border-0 border-b-2 !rounded-tl-xl !rounded-tr-xl border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer transition" />
                                <label htmlFor="email" className="absolute px-1 text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">Email</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center mt-10">
                    <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed">
                        {isLoading == true ? <CircularProgress size={24} color="inherit" /> : 'Cập Nhật Ngay'}
                    </button>
                </div>
            </form>
        </LocalizationProvider>
    );
};

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

// === COMPONENT CHÍNH CỦA TRANG PROFILE ===
const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className='w-auto h-auto p-6 border-2  rounded-2xl !border-[#4b4b4b11] bg-[#fefcfc] shadow-lg'>
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