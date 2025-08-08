import React, { useState, useMemo } from 'react';
import { Paper, Typography, Box, Grid, IconButton, Button, ButtonGroup } from '@mui/material';
import { FiShoppingCart, FiStar, FiUserPlus, FiChevronLeft, FiChevronRight, FiGrid, FiLayout, FiList, FiCalendar } from 'react-icons/fi';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// --- THIẾT LẬP BAN ĐẦU CHO CALENDAR ---
const localizer = momentLocalizer(moment);

// Dữ liệu mẫu cho Lịch 
const calendarEvents = [
    { id: 1, title: 'Repeating Event', start: new Date(2025, 6, 3, 19, 30), end: new Date(2025, 6, 3, 20, 30), color: '#ef4444' },
    { id: 2, title: 'Conference', start: new Date(2025, 6, 8), end: new Date(2025, 6, 9), color: '#f59e0b' },
    { id: 3, title: 'Long Event', start: new Date(2025, 6, 11), end: new Date(2025, 6, 13), color: '#6b7280' },
    { id: 4, title: 'Long Event', start: new Date(2025, 6, 21), end: new Date(2025, 6, 23), color: '#3b82f6' },
    { id: 5, title: 'Breakfast', start: new Date(2025, 6, 15, 13, 30), end: new Date(2025, 6, 15, 14, 0), color: '#3b82f6' },
    { id: 6, title: 'Anniversary Celebration', start: new Date(2025, 6, 15, 16, 0), end: new Date(2025, 6, 15, 17, 0), color: '#ef4444' },
    { id: 7, title: 'Meeting', start: new Date(2025, 6, 15, 16, 45), end: new Date(2025, 6, 15, 17, 30), color: '#fef3c7' },
    { id: 8, title: 'All Day Event', start: new Date(2025, 6, 14), end: new Date(2025, 6, 14), allDay: true, color: '#22c55e' },
    { id: 9, title: 'Opening Ceremony', start: new Date(2025, 6, 14, 8, 21), end: new Date(2025, 6, 14, 9, 0), color: '#dcfce7' },
    { id: 10, title: 'Repeating Event', start: new Date(2025, 6, 17, 4, 51), end: new Date(2025, 6, 17, 5, 30), color: '#6b7280' },
    { id: 11, title: 'Birthday Party', start: new Date(2025, 6, 17, 5, 6), end: new Date(2025, 6, 17, 6, 0), color: '#f59e0b' },
];

//Dữ liệu mẫu cho Dòng hoạt động
const activityData = [
    { type: 'order', icon: FiShoppingCart, color: 'blue', title: 'Đơn hàng mới từ Lê Linh', details: '76.257 đ', time: '40 phút trước' },
    { type: 'review', icon: FiStar, color: 'yellow', title: 'Đánh giá mới cho Áo thun', details: { rating: 5, max: 5 }, time: '15 phút trước' },
    { type: 'newUser', icon: FiUserPlus, color: 'green', title: 'Phạm Hà vừa đăng ký thành viên', details: 'Khách hàng mới', time: '24 phút trước' },
];

// --- CÁC COMPONENT CON ---
/*Toolbar tùy chỉnh cho Lịch*/
const CustomToolbar = (toolbar) => {
    const goToBack = () => { toolbar.onNavigate('PREV'); };
    const goToNext = () => { toolbar.onNavigate('NEXT'); };
    const goToCurrent = () => { toolbar.onNavigate('TODAY'); };
    const label = () => { return (<span>{toolbar.label}</span>); };

    return (
        <div className="flex flex-wrap justify-between items-center mb-4 p-1">
            <div className="flex items-center gap-2">
                <Button variant="outlined" size="small" onClick={goToCurrent} sx={{ textTransform: 'none' }}>Hôm nay</Button>
                <IconButton onClick={goToBack} size="small"><FiChevronLeft /></IconButton>
                <IconButton onClick={goToNext} size="small"><FiChevronRight /></IconButton>
            </div>
            <Typography variant="h6" fontWeight="bold" color="text.primary">{label()}</Typography>
            <ButtonGroup variant="outlined" size="small">
                <Button onClick={() => toolbar.onView('month')} className={toolbar.view === 'month' ? '!bg-blue-500 !text-white' : ''}><FiGrid /></Button>
                <Button onClick={() => toolbar.onView('week')} className={toolbar.view === 'week' ? '!bg-blue-500 !text-white' : ''}><FiLayout /></Button>
                <Button onClick={() => toolbar.onView('day')} className={toolbar.view === 'day' ? '!bg-blue-500 !text-white' : ''}><FiCalendar /></Button>
                <Button onClick={() => toolbar.onView('agenda')} className={toolbar.view === 'agenda' ? '!bg-blue-500 !text-white' : ''}><FiList /></Button>
            </ButtonGroup>
        </div>
    );
};

/*Hiển thị lịch với các sự kiện*/
const CalendarCard = () => {
    // Hàm để style cho các event 
    const eventStyleGetter = (event, start, end, isSelected) => {
        let style = {
            backgroundColor: event.color || '#3174ad',
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };
        // Làm cho text màu tối với nền sáng
        if (event.color === '#fef3c7' || event.color === '#dcfce7') {
            style.color = '#333';
        }
        return { style };
    };

    return (
        <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', height: '100%' }}>
            <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 650 }}
                components={{ toolbar: CustomToolbar }}
                eventPropGetter={eventStyleGetter}
                views={['month', 'week', 'day', 'agenda']}
                defaultDate={new Date(2025, 6, 1)}
            />
        </Paper>
    );
};

const RatingStars = ({ rating, max }) => (<div className="flex">{[...Array(max)].map((_, i) => (<FiStar key={i} className={i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'} />))}</div>);

const ActivityFeedCard = () => { const iconColors = { blue: 'bg-blue-100 text-blue-600', yellow: 'bg-yellow-100 text-yellow-600', green: 'bg-green-100 text-green-600' }; return (<Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)', height: '100%' }}><Typography variant="h6" fontWeight="bold" color="text.primary" mb={3}>Hoạt động Mới nhất</Typography><div className="relative"><div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>{activityData.map((activity, index) => (<div key={index} className="flex items-start gap-4 mb-5 relative"><div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${iconColors[activity.color]}`}><activity.icon size={16} /></div><div className="flex-1"><p className="text-sm text-gray-800">{activity.title}</p>{activity.type === 'review' ? (<RatingStars rating={activity.details.rating} max={activity.details.max} />) : (<p className="text-sm font-bold text-gray-900">{activity.details}</p>)}</div><p className="text-xs text-gray-500">{activity.time}</p></div>))}</div></Paper>); };

// === COMPONENT CHÍNH ===
const ScheduleAndToolsSection = () => {
    return (
        <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Lịch & Công cụ</h2>
            <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                    <CalendarCard />
                </Grid>
                <Grid item xs={12} lg={4}>
                    <ActivityFeedCard />
                </Grid>
            </Grid>
        </section>
    );
};

export default ScheduleAndToolsSection;