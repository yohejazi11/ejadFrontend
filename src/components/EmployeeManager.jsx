import React, { useState, useEffect } from 'react';

function EmployeeManager() {
    const [view, setView] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState('');
    const [employees, setEmployees] = useState([]);

    const [addEmployeeData, setAddEmployeeData] = useState({
        full_name: '',
        national_id: '',
        phone: '',
        email: '',
        role: '',
        department_id: '',
        password: '',
    });
    useEffect(() => {
        // جلب الأقسام عند تحميل الصفحة
        fetchDepartments();
    }, []);

    function fetchDepartments() {
        // محاكاة جلب الأقسام من API
        fetch('http://localhost/ejadBackend/api/get_departments.php')
            .then(response => response.json())
            .then(data => setDepartments(data.departments))
            .catch(error => console.error('Error fetching departments:', error));

    }

    function fetchEmployees(departmentId = null) {
        let url = 'http://localhost/ejadBackend/api/get_employees_by_department.php';
        if (departmentId) {
            url += `?department_id=${departmentId}`;
        }

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setEmployees(data);
            })
            .catch(error => {
                console.error('حدث خطأ أثناء جلب الموظفين:', error);
            });
    }


    useEffect(() => {
        fetchEmployees(); // بدون قسم = جلب جميع الموظفين
    }, []);

    function addEmployee(e) {
        e.preventDefault();

        fetch('http://localhost/ejadBackend/api/add_employee.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(addEmployeeData),
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                setAddEmployeeData({
                    full_name: '',
                    national_id: '',
                    phone: '',
                    email: '',
                    role: '',
                    department_id: '',
                    password: '',
                });
            })
            .catch(err => {
                console.error('Error adding employee:', err);
            });
    }


    function renderView() {
        switch (view) {
            case 'add_employee':
                return (
                    <div className="p-8 bg-white shadow rounded w-full">
                        <h2 className="text-xl font-bold mb-6">إضافة موظف جديد</h2>
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={addEmployee}>
                            <input type="text"
                                value={addEmployeeData.full_name}
                                onChange={(e) => setAddEmployeeData({ ...addEmployeeData, full_name: e.target.value })}
                                placeholder="الاسم الرباعي" className="border rounded p-2" />
                            <input type="text"
                                value={addEmployeeData.national_id}
                                onChange={(e) => setAddEmployeeData({ ...addEmployeeData, national_id: e.target.value })}
                                placeholder="رقم الهوية" className="border rounded p-2" />
                            <input type="text"
                                value={addEmployeeData.phone}
                                onChange={(e) => setAddEmployeeData({ ...addEmployeeData, phone: e.target.value })}
                                placeholder="رقم الجوال" className="border rounded p-2" />
                            <input type="email"
                                value={addEmployeeData.email}
                                onChange={(e) => setAddEmployeeData({ ...addEmployeeData, email: e.target.value })}
                                placeholder="البريد الإلكتروني" className="border rounded p-2" />
                            <select
                                className="border rounded p-2"
                                value={addEmployeeData.role}
                                onChange={(e) => setAddEmployeeData({ ...addEmployeeData, role: e.target.value })}
                            >
                                <option disabled value="">اختر الدور</option>
                                <option value="admin">إداري</option>
                                <option value="employee">مشرف</option>
                            </select>
                            <select
                                className="border rounded p-2"
                                value={addEmployeeData.department_id}
                                onChange={(e) => setAddEmployeeData({ ...addEmployeeData, department_id: e.target.value })}
                            >
                                <option disabled value="">اختر القسم</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>

                            <input type="password"
                                value={addEmployeeData.password}
                                onChange={(e) => setAddEmployeeData({ ...addEmployeeData, password: e.target.value })}
                                placeholder="كلمة المرور" className="border rounded p-2 md:col-span-2" />
                            <button type="submit" className="bg-green-600 text-white py-2 rounded col-span-2">إضافة</button>
                        </form>
                    </div>
                );
            case 'view_employees':
                return (
                    <div className="p-8 bg-white shadow rounded w-full">
                        <h2 className="text-xl font-bold mb-4">استعراض الموظفين</h2>
                        <select
                            className="w-full border p-2 rounded mb-4"
                            onChange={(e) => {
                                const deptId = e.target.value;
                                setSelectedDept(deptId);
                                fetchEmployees(deptId);
                            }}
                        >
                            <option value="">جميع الأقسام</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>

                        <table className="w-full text-right border">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2">الاسم</th>
                                    <th className="p-2">الدور</th>
                                    <th className="p-2">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4">لا يوجد موظفون</td>
                                    </tr>
                                ) : (
                                    employees.map(emp => (
                                        <tr key={emp.id} className="border-t">
                                            <td className="p-2">{emp.full_name}</td>
                                            <td className="p-2">{emp.role}</td>
                                            <td className="p-2 space-x-2">
                                                <button className="text-red-600 hover:underline">حذف</button>
                                                <button className="text-blue-600 hover:underline">نقل قسم</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                );
            default:
                return <div className="text-center text-gray-600">اختر عملية من القائمة الجانبية</div>;
        }
    }

    return (
        <div className='flex flex-col md:flex-row gap-6'>

            {/* عرض العمليات */}
            <div className='flex-1'>
                {renderView()}
            </div>

            {/* القائمة الجانبية */}
            <div className='w-full md:w-1/4 bg-white p-4 shadow rounded'>
                <h3 className='text-lg font-semibold mb-4'>إدارة الموظفين</h3>
                <ul className='space-y-2'>
                    <li><SidebarButton text="إضافة موظف" onClick={() => setView('add_employee')} /></li>
                    <li><SidebarButton text="استعراض الموظفين" onClick={() => setView('view_employees')} /></li>
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

export default EmployeeManager;
