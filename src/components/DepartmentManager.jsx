import React, { useState, useEffect } from 'react';

function DepartmentManager() {
    const [viewState, setViewState] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState('');
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        // محاكاة جلب الأقسام من الباكند
        setDepartments([
            { id: 1, name: 'الصيانة' },
            { id: 2, name: 'الإرشاد' },
            { id: 3, name: 'الضيافة' },
        ]);
    }, []);

    useEffect(() => {
        if (selectedDept) {
            // محاكاة جلب الموظفين حسب القسم
            const mockEmployees = {
                1: ['محمد فهد', 'عبدالله التميمي'],
                2: ['نورة السبيعي', 'رهف العتيبي'],
                3: ['خالد المطيري'],
            };
            setEmployees(mockEmployees[selectedDept] || []);
        }
    }, [selectedDept]);

    function renderView() {
        switch (viewState) {
            case 'add_department':
                return (
                    <div className='p-8 bg-white shadow rounded w-full'>
                        <h2 className='text-xl font-bold mb-4'>إضافة قسم جديد</h2>
                        <form className='space-y-4'>
                            <input
                                type="text"
                                placeholder="اسم القسم"
                                className="w-full border rounded p-2"
                            />
                            <textarea
                                placeholder="وصف القسم"
                                rows="3"
                                className="w-full border rounded p-2"
                            />
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                                إضافة القسم
                            </button>
                        </form>
                    </div>
                );
            case 'view_employees':
                return (
                    <div className='p-8 bg-white shadow rounded w-full'>
                        <h2 className='text-xl font-bold mb-4'>استعراض موظفي القسم</h2>
                        <select
                            className='w-full border p-2 rounded mb-4'
                            onChange={(e) => setSelectedDept(e.target.value)}
                        >
                            <option disabled selected>اختر القسم</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                        <ul className='list-disc ml-6 text-gray-700'>
                            {employees.length === 0 ? (
                                <li>لا يوجد موظفون لهذا القسم</li>
                            ) : (
                                employees.map((emp, i) => <li key={i}>{emp}</li>)
                            )}
                        </ul>
                    </div>
                );
            default:
                return (
                    <div className="text-gray-600 text-center w-full">
                        <p className='text-lg'>اختر عملية من القائمة الجانبية</p>
                    </div>
                );
        }
    }

    return (
        <div className='flex flex-col md:flex-row gap-6'>

            {/* عرض المحتوى */}
            <div className='flex-1'>
                {renderView()}
            </div>
            
            {/* القائمة الجانبية */}
            <div className='w-full md:w-1/4 bg-white p-4 shadow rounded'>
                <h3 className='text-lg font-semibold mb-4'>إدارة الأقسام</h3>
                <ul className='space-y-2'>
                    <li><SidebarButton text="إضافة قسم" onClick={() => setViewState('add_department')} /></li>
                    <li><SidebarButton text="استعراض موظفين القسم" onClick={() => setViewState('view_employees')} /></li>
                </ul>
            </div>

            
        </div>
    );
}

function SidebarButton({ text, onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-full text-right text-blue-600 hover:underline"
        >
            {text}
        </button>
    );
}

export default DepartmentManager;
