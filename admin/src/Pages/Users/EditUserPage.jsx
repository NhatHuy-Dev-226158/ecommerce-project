import React, { useState, useEffect, useContext } from 'react';
import {
    Typography, Button, Breadcrumbs, MenuItem, TextField, Select, FormControl,
    InputLabel, CircularProgress
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaAngleRight } from "react-icons/fa6";
import { format } from 'date-fns';
import { MyContext } from '../../App';
import { fetchDataFromApi, updateData } from '../../utils/api';

//================================================================================
// SUB-COMPONENT
//================================================================================

// Component con để tạo section cho form
const FormSection = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
        <div className="space-y-6">{children}</div>
    </div>
);


//================================================================================
// MAIN EDIT USER PAGE COMPONENT
//================================================================================

/**
 * @component EditUserPage
 * @description Trang cho phép Admin chỉnh sửa thông tin của một người dùng.
 */
const EditUserPage = () => {
    // --- Hooks & State ---
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const { userId } = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [formData, setFormData] = useState({
        name: '', email: '', role: 'USER', status: 'Active',
        avatar: '', createdAt: ''
    });

    // --- Logic & Effects ---

    // Tải dữ liệu người dùng khi component được mount hoặc userId thay đổi
    useEffect(() => {
        const fetchUserData = async () => {
            setIsFetchingData(true);

            try {
                const result = await fetchDataFromApi(`/api/user/${userId}`);
                if (result.success) {
                    const userData = result.data;
                    setFormData({
                        name: userData.name || '',
                        email: userData.email || '',
                        role: userData.role || 'USER',
                        status: userData.status || 'Active',
                        avatar: userData.avatar || '',
                        createdAt: userData.createdAt || ''
                    });
                } else {
                    throw new Error("Không tìm thấy người dùng.");
                }
            } catch (error) {
                context.openAlerBox("error", error.message);
                navigate('/users');
            } finally {
                setIsFetchingData(false);
            }
        };

        fetchUserData();
    }, [userId, navigate, context]);

    // --- Event Handlers ---

    // Cập nhật state của form khi người dùng nhập liệu
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý logic khi submit form
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // Chỉ gửi đi các trường mà admin được phép sửa đổi
            const dataToUpdate = {
                name: formData.name,
                role: formData.role,
                status: formData.status
            };

            const result = await updateData(`/api/user/updateUserByAdmin/${userId}`, dataToUpdate);

            if (result.success) {
                context.openAlerBox("success", "Cập nhật người dùng thành công!");
                navigate('/users');
            } else {
                throw new Error(result.message || "Cập nhật thất bại.");
            }
        } catch (error) {
            context.openAlerBox("error", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Render ---

    // Dữ liệu breadcrumbs động
    const breadcrumbsData = [
        { name: 'Dashboard', link: '/' },
        { name: 'Người dùng', link: '/users' },
        { name: isFetchingData ? 'Đang tải...' : `Sửa: ${formData.name}` }
    ];

    // Trạng thái loading ban đầu
    if (isFetchingData) {
        return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;
    }

    return (
        <section className="bg-gray-50 p-4 md:p-6">
            <form onSubmit={handleSubmit} noValidate>
                {/* Header của trang */}
                <div className="flex flex-wrap justify-between items-center mb-6">
                    <div>
                        <Typography variant="h5" component="h1" fontWeight="bold">Sửa thông tin người dùng</Typography>
                        <Breadcrumbs separator={<FaAngleRight className='text-sm' />} sx={{ mt: 1 }}>
                            {breadcrumbsData.map((c, i) => (c.link ? <Link key={i} to={c.link} className="text-sm hover:underline">{c.name}</Link> : <Typography key={i} className="text-sm font-semibold">{c.name}</Typography>))}
                        </Breadcrumbs>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outlined" color="secondary" onClick={() => navigate('/users')} sx={{ textTransform: 'none', borderRadius: '8px' }}>Hủy</Button>
                        <Button type="submit" variant="contained" disabled={isLoading} sx={{ textTransform: 'none', borderRadius: '8px' }}>
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Lưu thay đổi'}
                        </Button>
                    </div>
                </div>

                {/* Layout chính của form */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Cột trái: Ảnh đại diện */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                        <FormSection title="Ảnh đại diện">
                            <div className="flex flex-col items-center">
                                <img
                                    src={formData.avatar || `https://i.pravatar.cc/150?u=${formData.email}`}
                                    alt="avatar"
                                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                                    Ngày tham gia: {formData.createdAt ? format(new Date(formData.createdAt), 'dd/MM/yyyy') : 'N/A'}
                                </Typography>
                            </div>
                        </FormSection>
                    </div>

                    {/* Cột phải: Thông tin tài khoản */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-6">
                        <FormSection title="Thông tin tài khoản">
                            <TextField fullWidth label="Họ và tên" name="name" value={formData.name} onChange={handleInputChange} required />
                            <TextField fullWidth label="Địa chỉ Email" name="email" value={formData.email} disabled />
                            <FormControl fullWidth>
                                <InputLabel>Vai trò</InputLabel>
                                <Select label="Vai trò" name="role" value={formData.role} onChange={handleInputChange}>
                                    <MenuItem value="USER">Người dùng (User)</MenuItem>
                                    <MenuItem value="STAFF">Nhân viên (Staff)</MenuItem>
                                    <MenuItem value="ADMIN">Quản trị viên (Admin)</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select label="Trạng thái" name="status" value={formData.status} onChange={handleInputChange}>
                                    <MenuItem value="Active">Hoạt động</MenuItem>
                                    <MenuItem value="Inactive">Không hoạt động</MenuItem>
                                    <MenuItem value="Suspended">Bị khóa</MenuItem>
                                </Select>
                            </FormControl>
                        </FormSection>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default EditUserPage;