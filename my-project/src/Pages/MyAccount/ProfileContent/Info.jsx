import React, { useContext, useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { PhoneInput } from 'react-international-phone';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'react-international-phone/style.css';
import { MyContext } from '../../../App';
import { updateData } from '../../../utils/api';


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
// === CÁC COMPONENT NỘI DUNG CHO TỪNG TAB (Giờ đã có logic) ===
const ProfileInfoTab = () => {
    const [previews, setPreviews] = useState([]);
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
                context.openAlerBox("success", res?.message);
            } else {
                context.openAlerBox("error", res?.message);
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

    return (

        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form onSubmit={handleSubmit} noValidate className="w-full pt-6 ">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
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
export default ProfileInfoTab;