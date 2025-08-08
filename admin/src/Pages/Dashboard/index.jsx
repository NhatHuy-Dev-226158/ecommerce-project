import React, { useState } from 'react';
import StatsGrid from '../../componets/Componets-Dashboard/DashboardBox';
import EmployeeCard from '../../componets/Componets-Dashboard/EmployeeCard/EmployeeCard';
import ConversionFunnelChart from '../../componets/Componets-Dashboard/FunnelChart/FunnelChart';
import SalesTrendChart from '../../componets/Componets-Dashboard/RevenueChart/RevenueChart';
import YearlySalesChart from '../../componets/Componets-Dashboard/RevenueChart/YearlySalesChart';
import CategoryRanking from '../../componets/Componets-Dashboard/CategoryRanking/CategoryRanking';
import RevenueByRegionChart from '../../componets/Componets-Dashboard/RevenueByRegionChart/RevenueByRegionChart';
import AIAssistantCard from '../../componets/Componets-Dashboard/AIAssistantCard/AIAssistantCard';
import QuickActionsCard from '../../componets/Componets-Dashboard/QuickActionsCard/QuickActionsCard';
import DetailedAnalysisSection from '../../componets/Componets-Dashboard/DetailedAnalysisSection/DetailedAnalysisSection';
import { FiClock } from "react-icons/fi";
import OperationsSection from '../../componets/Componets-Dashboard/OperationsSection/OperationsSection';
import OverviewSection from '../../componets/Componets-Dashboard/OperationsSection/OverviewSection';
import ScheduleAndToolsSection from '../../componets/Componets-Dashboard/ScheduleAndToolsSection/ScheduleAndToolsSection';


// --- CÁC COMPONENT GIAO DIỆN CON ---
const PeriodFilter = ({ activePeriod, setActivePeriod }) => {
    const periods = ['Today', 'Last 7 Days', 'Last 30 Days', 'This Month'];
    return (
        <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            {periods.map(period => (
                <button
                    key={period}
                    onClick={() => setActivePeriod(period)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${activePeriod === period
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-indigo-600'
                        }`}
                >
                    {period}
                </button>
            ))}
        </div>
    );
};

/*Component DashboardHeader*/
const DashboardHeader = ({ activePeriod, setActivePeriod }) => (
    <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Siêu thị Mini</h1>
            <p className="text-sm text-gray-500">Tổng quan, Thứ Hai, 14 tháng 7, 2025</p>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 flex items-center gap-1.5">
                <FiClock size={12} /> Cập nhật lần cuối: 21:53:48
            </span>
            <PeriodFilter activePeriod={activePeriod} setActivePeriod={setActivePeriod} />
        </div>
    </div>
);

/* Component PerformanceSection*/
const PerformanceSection = ({ employee }) => (
    <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Hiệu suất & Chuyển đổi</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EmployeeCard employee={employee} />
            <ConversionFunnelChart />
        </div>
    </div>
);

/*Component RevenueAnalysisSection*/
const RevenueAnalysisSection = () => (
    <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Phân tích Doanh thu</h2>
        <div className="space-y-6">
            <SalesTrendChart />
            <YearlySalesChart />
        </div>
    </div>
);

/*Component RankingsAndInsightsSection */
const RankingsAndInsightsSection = () => (
    <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Bảng xếp hạng & Phân tích</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1"><CategoryRanking /></div>
            <div className="lg:col-span-1"><RevenueByRegionChart /></div>
            <div className="lg:col-span-1 flex flex-col gap-6">
                <AIAssistantCard />
                <QuickActionsCard />
            </div>
        </div>
    </div>
);


// === COMPONENT DASHBOARD CHÍNH ===
const Dashboard = () => {
    // State để quản lý bộ lọc thời gian.
    const [activePeriod, setActivePeriod] = useState('This Month');

    // Dữ liệu mẫu cho card nhân viên
    const employeeData = {
        name: 'Lê Hoàng Cường',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
        specialty: 'Rau củ & Trái cây',
        strength: 'Giải quyết khiếu nại hiệu quả',
        sales: 55200000,
        orders: 88,
        avgOrderValue: 627273,
        recommendation: 'Khen thưởng nóng & chia sẻ kinh nghiệm.'
    };

    return (
        <section className="space-y-6 pb-6">
            <DashboardHeader activePeriod={activePeriod} setActivePeriod={setActivePeriod} />
            <StatsGrid />
            <PerformanceSection employee={employeeData} />
            <RevenueAnalysisSection />
            <DetailedAnalysisSection />
            <RankingsAndInsightsSection />
            <OperationsSection />
            <OverviewSection />
            <ScheduleAndToolsSection />
        </section>
    );
};

export default Dashboard;