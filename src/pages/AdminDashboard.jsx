import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import TaskManager from '../components/TaskManager';
import EvaluationManager from '../components/EvaluationManager';
import DepartmentManager from '../components/DepartmentManager';
import EmployeeManager from '../components/EmployeeManager';
function AdminDashboard() {
    const [managerState, setManagerState] = useState('task_manager');
    const [stats, setStats] = useState({
        pilgrims: 0,
        services: 0,
        reviews: 0,
    });

    useEffect(() => {
        // جلب الإحصائيات
        fetch('http://localhost/ejadBackend/api/admin_dashboard_stats.php')
            .then(res => res.json())
            .then(data => {
                setStats(data);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="max-w-6xl mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold mb-6">لوحة تحكم الأدمن</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard label="عدد الحجاج" value={stats.pilgrims} color="green" />
                    <StatCard label="عدد الخدمات" value={stats.services} color="blue" />
                    <StatCard label="عدد التقييمات" value={stats.reviews} color="yellow" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <AdminCard title="إدارة التقييمات" state="review_manager" onClick={setManagerState} />
                    <AdminCard title="إدارة المهام" state="task_manager" onClick={setManagerState} />
                    <AdminCard title="إدارة الاقسام" state="department_manager" onClick={setManagerState} />
                    <AdminCard title="إدارة الموظفين" state="employee_manager" onClick={setManagerState} />

                </div>

                <div className='bg-white p-6 rounded shadow'>
                    {managerState === 'task_manager' && <TaskManager />}
                    {managerState === 'review_manager' && <EvaluationManager />}
                    {managerState === 'department_manager' && <DepartmentManager />}
                    {managerState === 'employee_manager' && <EmployeeManager />}

                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, color }) {
    const colorMap = {
        green: 'text-green-600',
        blue: 'text-blue-600',
        yellow: 'text-yellow-500',
    };
    return (
        <div className="bg-white p-6 shadow rounded text-center">
            <h2 className="text-xl font-bold text-gray-700 mb-2">{label}</h2>
            <p className={`text-3xl ${colorMap[color]}`}>{value}</p>
        </div>
    );
}

function AdminCard({ title, state, onClick }) {
    return (
        <button
            onClick={() => onClick(state)}
            className="bg-white p-5 shadow hover:shadow-md rounded transition cursor-pointer text-center w-full"
        >
            <h3 className="text-lg font-semibold">{title}</h3>
        </button>
    );
}

export default AdminDashboard;
