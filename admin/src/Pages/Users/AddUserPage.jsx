import React, { useState } from 'react';
import {
    Typography, Button, Breadcrumbs, TextField, Select, FormControl, InputLabel,
    Switch, InputAdornment, MenuItem, IconButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import { FiUploadCloud, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaAngleRight } from "react-icons/fa6";

// --- COMPONENT GIAO DIỆN CON ---
// Tái sử dụng FormSection
const FormSection = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);

const breadcrumbsData = [
    { name: 'Dashboard', link: '/' },
    { name: 'Người dùng', link: '/user-list' },
    { name: 'Thêm mới' }
];

// === COMPONENT TRANG CHÍNH ===
const AddUserPage = () => {
    // State cho việc hiển thị mật khẩu
    const [showPassword, setShowPassword] = useState(false);

    // State cho việc có gửi email chào mừng hay không
    const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);

    return (
        <section className="bg-gray-50">
            {/* Header của trang */}
            <div className="flex flex-wrap justify-between items-center mb-6">
                <div>
                    <Typography variant="h5" component="h1" fontWeight="bold">Tạo tài khoản người dùng mới</Typography>
                    <Breadcrumbs separator={<FaAngleRight className='text-sm' />} sx={{ mt: 1 }}>
                        {breadcrumbsData.map((c, i) => (c.link ? <Link key={i} to={c.link} className="text-sm hover:underline">{c.name}</Link> : <Typography key={i} className="text-sm font-semibold">{c.name}</Typography>))}
                    </Breadcrumbs>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outlined" color="secondary" sx={{ textTransform: 'none', borderRadius: '8px' }}>Hủy</Button>
                    <Button variant="contained" sx={{ textTransform: 'none', borderRadius: '8px' }}>Thêm người dùng</Button>
                </div>
            </div>

            {/* Layout chính của form */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* Cột bên trái (Nội dung chính) */}
                <div className="w-full lg:w-2/3 flex flex-col gap-6">
                    <FormSection title="Thông tin tài khoản">
                        <TextField fullWidth label="Họ và tên" placeholder="Nguyễn Văn A" variant="outlined" required />
                        <TextField fullWidth label="Địa chỉ Email" placeholder="email@example.com" type="email" variant="outlined" required />
                        <TextField
                            fullWidth
                            label="Mật khẩu"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            required
                            helperText="Người dùng có thể đổi mật khẩu này sau khi đăng nhập."
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <FiEyeOff /> : <FiEye />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormSection>
                </div>

                {/* Cột bên phải (Các tùy chọn) */}
                <div className="w-full lg:w-1/3 flex flex-col gap-6">
                    <FormSection title="Ảnh đại diện">
                        <div className="flex justify-center">
                            <div className="relative group w-32 h-32">
                                <img src="https://via.placeholder.com/128/e0e7ff/4f46e5?text=Avatar" alt="avatar placeholder" className="w-full h-full rounded-full object-cover border-2 border-gray-200" />
                                <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <FiUploadCloud size={32} />
                                    <input type="file" id="avatar-upload" className="hidden" accept="image/*" />
                                </label>
                            </div>
                        </div>
                    </FormSection>

                    <FormSection title="Phân quyền & Trạng thái">
                        <FormControl fullWidth>
                            <InputLabel>Vai trò</InputLabel>
                            <Select label="Vai trò" defaultValue="USER">
                                <MenuItem value="USER">Người dùng (User)</MenuItem>
                                <MenuItem value="ADMIN">Quản trị viên (Admin)</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Trạng thái</InputLabel>
                            <Select label="Trạng thái" defaultValue="Active">
                                <MenuItem value="Active">Hoạt động</MenuItem>
                                <MenuItem value="Inactive">Không hoạt động</MenuItem>
                                <MenuItem value="Suspended">Bị khóa</MenuItem>
                            </Select>
                        </FormControl>
                    </FormSection>

                    <FormSection title="Tùy chọn">
                        <div className="flex justify-between items-center">
                            <Typography>Gửi email chào mừng</Typography>
                            <Switch checked={sendWelcomeEmail} onChange={(e) => setSendWelcomeEmail(e.target.checked)} />
                        </div>
                        <Typography variant="caption" color="text.secondary">
                            Gửi cho người dùng một email chứa thông tin đăng nhập và liên kết đến trang web.
                        </Typography>
                    </FormSection>
                </div>
            </div>
        </section>
    );
};

export default AddUserPage;