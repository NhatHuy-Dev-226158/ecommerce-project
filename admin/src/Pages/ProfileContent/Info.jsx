import React from 'react';
import 'react-international-phone/style.css'; // Import style

// --- Component & Library Imports ---
import { CircularProgress, TextField } from '@mui/material';
import { PhoneInput } from 'react-international-phone';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { FiUploadCloud } from 'react-icons/fi';

// --- Context & API Imports ---
import { MyContext } from '../../App';
import { updateData, uploadImage } from '../../utils/api';


//================================================================================
// CUSTOM TEXTFIELD COMPONENT (Chưa được sử dụng trong phiên bản hiện tại)
//================================================================================
// const CustomTextField = React.forwardRef((props, ref) => { ... });


//================================================================================
// MAIN PROFILE INFO TAB COMPONENT
//================================================================================

/**
 * @component ProfileInfoTab
 * @description Tab "Hồ sơ" trong trang Profile, cho phép người dùng xem và cập nhật thông tin cá nhân.
 */
const ProfileInfoTab = () => {
    // --- State Management ---
    const context = useContext(MyContext);
    const [uploading, setUploading] = useState(false); // Trạng thái loading khi upload ảnh
    const [isLoading, setIsLoading] = useState(false); // Trạng thái loading khi submit form
    const [previews, setPreviews] = useState([]); // URL xem trước ảnh đại diện
    const [userId, setUserId] = useState("");
    const [formFields, setFormFields] = useState({
        name: '', email: '', mobile: '', birthday: ''
    });

    // --- Logic & Effects ---

    // Effect: Điền dữ liệu người dùng từ context vào form khi component được mount hoặc khi userData thay đổi
    useEffect(() => {
        if (context?.userData?._id) {
            setUserId(context.userData._id);
            setFormFields({
                name: context.userData.name || '',
                email: context.userData.email || '',
                mobile: String(context.userData.mobile || ''),
                birthday: context.userData.birthday || ''
            });
            if (context.userData.avatar) {
                setPreviews([context.userData.avatar]);
            }
        }
    }, [context?.userData]);

    // --- Event Handlers for Form ---

    // Xử lý thay đổi ngày sinh
    const handleDateChange = (newValue) => {
        setFormFields(prevState => ({
            ...prevState,
            birthday: newValue ? newValue.format('YYYY-MM-DD') : ''
        }));
    };

    // Cập nhật state của form khi người dùng nhập liệu
    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields(prevState => ({ ...prevState, [name]: value }));
    };

    // Xử lý thay đổi số điện thoại từ component PhoneInput
    const handlePhoneChange = (phoneValue) => {
        setFormFields(prevState => ({ ...prevState, mobile: phoneValue }));
    };

    // Xử lý logic khi submit form
    const handleSubmit = (event) => {
        event.preventDefault();
        const { name, email, mobile } = formFields;
        // Validation
        if (!name || !email || !mobile) {
            context.openAlerBox("error", "Vui lòng điền đầy đủ thông tin.");
            return;
        }
        setIsLoading(true);
        updateData(`/api/user/${userId}`, formFields)
            .then((res) => {
                if (res?.error !== true) {
                    context.openAlerBox("success", res?.message);
                } else {
                    context.openAlerBox("error", res?.message);
                }
            })
            .finally(() => setIsLoading(false));
    };

    // Xử lý logic khi người dùng chọn file ảnh đại diện mới
    const onChangeFile = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const formdata = new FormData();
        formdata.append('avatar', files[0]); // Chỉ lấy file đầu tiên

        try {
            const res = await uploadImage('/api/user/user-avatar', formdata);
            if (res?.success) {
                setPreviews([res.data.avatar]); // Cập nhật ảnh đại diện mới
                context.openAlerBox("success", "Cập nhật ảnh đại diện thành công!");
                // Có thể cần cập nhật lại userData trong context ở đây
            } else {
                throw new Error(res.message);
            }
        } catch (error) {
            context.openAlerBox('error', error.message || 'Tải ảnh lên thất bại.');
        } finally {
            setUploading(false);
        }
    };


    // --- Render ---
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form onSubmit={handleSubmit} noValidate className="w-full pt-6">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    {/* Phần Ảnh đại diện */}
                    <div className="flex-shrink-0">
                        <div className="relative group w-32 h-32 rounded-full bg-slate-300 flex items-center justify-center">
                            {uploading ? <CircularProgress color='inherit' /> : (
                                <>
                                    {previews.length > 0
                                        ? <img src={previews[0]} alt='user avatar' className="w-full h-full rounded-full object-cover" />
                                        : <img src='/user.png' alt='user avatar' className="w-full h-full rounded-full object-cover" />}
                                </>
                            )}
                            <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <FiUploadCloud size={32} />
                                <input type="file" id="avatar-upload" className="hidden" onChange={onChangeFile} name='avatar' accept='image/*' />
                            </label>
                        </div>
                    </div>

                    {/* Phần Thông tin cá nhân */}
                    <div className="flex-grow space-y-8 w-full">
                        <div>
                            <h3 className="font-bold text-lg mb-4">Thông tin cá nhân</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <TextField variant="standard" fullWidth label="Họ và tên" name='name' value={formFields.name} onChange={onChangeInput} disabled={isLoading} />
                                <PhoneInput defaultCountry="vn" value={formFields.mobile} onChange={handlePhoneChange} disabled={isLoading} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <DatePicker
                                label="Ngày sinh"
                                value={formFields.birthday ? dayjs(formFields.birthday) : null}
                                onChange={handleDateChange}
                                disabled={isLoading}
                                format="DD/MM/YYYY"
                                slotProps={{ textField: { fullWidth: true, variant: 'standard' } }}
                            />
                            <TextField variant="standard" fullWidth label="Email" name='email' value={formFields.email} disabled />
                        </div>
                    </div>
                </div>

                {/* Nút Cập nhật */}
                <div className="flex items-center justify-center mt-10">
                    <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed">
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Lưu Thay Đổi'}
                    </button>
                </div>
            </form>
        </LocalizationProvider>
    );
};

export default ProfileInfoTab;