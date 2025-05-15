import { useState, useEffect } from 'react';

function TaskManager() {
    const userID = localStorage.getItem('userId');
    const [viewState, setViewState] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addTaskData, setAddTaskData] = useState({
        title: '',
        details: '',
        department_id: '',
        deadline: '',
        from_user_id: userID,
        to_user_id: '',
        file: null,
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (!viewState) return;

        setLoading(true);
        switch (viewState) {
            case 'sent_tasks':
                fetchData(`http://localhost/ejadBackend/api/get_sent_tasks.php?user_id=${userID}`, setTasks);
                break;
            case 'received_tasks':
                fetchData(`http://localhost/ejadBackend/api/get_user_tasks.php?user_id=${userID}`, setTasks);
                break;
            case 'all_department_tasks':
                fetchData('http://localhost/ejadBackend/api/get_all_tasks.php', setTasks);
                break;
            case 'tasks_by_department':
                fetchData('http://localhost/ejadBackend/api/get_tasks_by_department.php', setTasks);
                break;
            case 'member_progress':
                fetchData('http://localhost/ejadBackend/api/get_member_progress.php', setProgressData);
                break;
            default:
                setLoading(false);
                break;
        }
    }, [viewState, userID]);

    useEffect(() => {
        if (addTaskData.department_id) {
            setLoading(true);
            fetch(`http://localhost/ejadBackend/api/get_employees_by_department.php?department_id=${addTaskData.department_id}`)
                .then(res => res.json())
                .then(data => {
                    if (data && Array.isArray(data)) {
                        setEmployees(data);
                    } else {
                        setEmployees([]);
                    }
                })
                .catch(err => console.error('Error fetching employees:', err))
                .finally(() => setLoading(false));
        }
    }, [addTaskData.department_id]);

    function fetchDepartments() {
        setLoading(true);
        fetch('http://localhost/ejadBackend/api/get_departments.php')
            .then(response => response.json())
            .then(data => {
                if (data.departments && Array.isArray(data.departments)) {
                    setDepartments(data.departments);
                } else {
                    setDepartments([]);
                }
            })
            .catch(error => console.error('Error fetching departments:', error))
            .finally(() => setLoading(false));
    }

    function fetchData(url, callback) {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.tasks && Array.isArray(data.tasks)) {
                    callback(data.tasks);
                } else {
                    callback([]);
                }
            })
            .catch(err => {
                console.error('Error:', err);
                callback([]);
            })
            .finally(() => setLoading(false));
    }

    function handleTaskSubmit(e) {
        e.preventDefault();
        
        if (!addTaskData.title || !addTaskData.details || !addTaskData.to_user_id || !addTaskData.department_id) {
            alert('الرجاء تعبئة جميع الحقول المطلوبة');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        
        Object.keys(addTaskData).forEach(key => {
            if (addTaskData[key] !== null && addTaskData[key] !== '') {
                formData.append(key, addTaskData[key]);
            }
        });

        fetch('http://localhost/ejadBackend/api/create_task.php', {
            method: 'POST',
            body: formData,
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('تم إنشاء المهمة بنجاح');
                    setViewState('sent_tasks');
                    // Reset form
                    setAddTaskData({
                        title: '',
                        details: '',
                        department_id: '',
                        deadline: '',
                        from_user_id: userID,
                        to_user_id: '',
                        file: null,
                    });
                } else {
                    alert(data.message || 'حدث خطأ أثناء إنشاء المهمة');
                }
            })
            .catch(err => console.error('Error creating task:', err))
            .finally(() => setLoading(false));
    }

    function renderView() {
        if (loading) {
            return (
                <div className="text-center py-8">
                    <p>جاري التحميل...</p>
                </div>
            );
        }

        switch (viewState) {
            case 'create_task':
                return (
                    <div className='p-8 bg-white shadow rounded w-full'>
                        <h2 className='text-xl font-bold mb-4'>إنشاء مهمة جديدة</h2>
                        <form className='space-y-4' onSubmit={handleTaskSubmit}>
                            <input
                                type="text"
                                value={addTaskData.title}
                                onChange={(e) => setAddTaskData({ ...addTaskData, title: e.target.value })}
                                placeholder="عنوان المهمة *"
                                className="w-full border rounded p-2"
                                required
                            />
                            <textarea
                                placeholder="تفاصيل المهمة *"
                                value={addTaskData.details}
                                onChange={(e) => setAddTaskData({ ...addTaskData, details: e.target.value })}
                                rows="4"
                                className="w-full border rounded p-2"
                                required
                            />
                            <select
                                className="border rounded p-2 w-full"
                                value={addTaskData.department_id}
                                onChange={(e) => setAddTaskData({ ...addTaskData, department_id: e.target.value })}
                                required
                            >
                                <option value="">اختر القسم *</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                            <select
                                className='w-full border p-2 rounded'
                                value={addTaskData.to_user_id}
                                onChange={(e) => setAddTaskData({ ...addTaskData, to_user_id: e.target.value })}
                                required
                                disabled={!addTaskData.department_id}
                            >
                                <option value="">اختر الموظف المستقبل *</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={addTaskData.deadline}
                                onChange={(e) => setAddTaskData({ ...addTaskData, deadline: e.target.value })}
                                placeholder="مهلة الإنجاز (بالأيام)"
                                className="w-full border rounded p-2"
                            />
                            <input
                                type="file"
                                className="w-full border p-2 rounded"
                                onChange={(e) => setAddTaskData({ ...addTaskData, file: e.target.files[0] })}
                            />
                            <button 
                                type="submit" 
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? 'جاري الإرسال...' : 'إرسال المهمة'}
                            </button>
                        </form>
                    </div>
                );
            case 'sent_tasks':
                return <DisplayTasks title="المهام الصادرة" tasks={tasks} />;
            case 'received_tasks':
                return <DisplayTasks title="المهام الواردة" tasks={tasks} />;
            case 'all_department_tasks':
                return <DisplayTasks title="جميع مهام الإدارة" tasks={tasks} />;
            case 'tasks_by_department':
                return <DisplayTasks title="مهام كل إدارة" tasks={tasks} />;
            case 'member_progress':
                return (
                    <div className='p-8 bg-white shadow rounded w-full'>
                        <h2 className='text-xl font-bold mb-4'>نسبة إنجاز الأعضاء</h2>
                        <table className='w-full border text-right'>
                            <thead className='bg-gray-100'>
                                <tr>
                                    <th className='p-2'>الموظف</th>
                                    <th className='p-2'>عدد المهام</th>
                                    <th className='p-2'>نسبة الإنجاز</th>
                                </tr>
                            </thead>
                            <tbody>
                                {progressData.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className='text-center py-4'>لا توجد بيانات</td>
                                    </tr>
                                ) : (
                                    progressData.map((item, index) => (
                                        <tr key={index} className='border-t'>
                                            <td className='p-2'>{item.employee_name || 'غير معروف'}</td>
                                            <td className='p-2'>{item.total_tasks || 0}</td>
                                            <td className='p-2'>{item.completion_rate || 0}%</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                );
            default:
                return (
                    <div className="text-gray-600 text-center w-full py-8">
                        <p className='text-lg'>اختر عملية من القائمة الجانبية</p>
                    </div>
                );
        }
    }

    return (
        <div className='flex flex-col md:flex-row gap-6'>
            <div className='flex-1'>
                {renderView()}
            </div>
            <div className='w-full md:w-1/4 bg-white p-4 shadow rounded'>
                <h3 className='text-lg font-semibold mb-4'>خيارات المهام</h3>
                <ul className='space-y-2'>
                    <li><SidebarButton text="إنشاء مهمة" onClick={() => setViewState('create_task')} /></li>
                    <li><SidebarButton text="المهام الصادرة" onClick={() => setViewState('sent_tasks')} /></li>
                    <li><SidebarButton text="المهام الواردة" onClick={() => setViewState('received_tasks')} /></li>
                    <li><SidebarButton text="جميع مهام الإدارة" onClick={() => setViewState('all_department_tasks')} /></li>
                    <li><SidebarButton text="مهام كل إدارة" onClick={() => setViewState('tasks_by_department')} /></li>
                    <li><SidebarButton text="نسبة إنجاز الأعضاء" onClick={() => setViewState('member_progress')} /></li>
                </ul>
            </div>
        </div>
    );
}

function SidebarButton({ text, onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-full text-right text-blue-600 hover:underline p-2 hover:bg-gray-100 rounded transition"
        >
            {text}
        </button>
    );
}

function DisplayTasks({ title, tasks }) {
    return (
        <div className='p-8 bg-white shadow rounded w-full'>
            <h2 className='text-xl font-bold mb-4 text-right'>{title}</h2>
            <table className='w-full border text-right'>
                <thead className='bg-gray-100'>
                    <tr>
                        <th className='p-2'>العنوان</th>
                        <th className='p-2'>التفاصيل</th>
                        <th className='p-2'>المرسل</th>
                        <th className='p-2'>المستلم</th>
                        <th className='p-2'>الموعد النهائي</th>
                        <th className='p-2'>الحالة</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.length === 0 ? (
                        <tr>
                            <td colSpan="5" className='text-center py-4'>لا توجد مهام</td>
                        </tr>
                    ) : (
                        tasks.map((task, index) => (
                            <tr key={index} className='border-t hover:bg-gray-50'>
                                <td className='p-2'>{task.title || 'بدون عنوان'}</td>
                                <td className='p-2'>{task.description || 'لا توجد تفاصيل'}</td>
                                <td className='p-2'>{task.sender || 'غير محدد'}</td>
                                <td className='p-2'>{task.receiver || 'غير محدد'}</td>
                                <td className='p-2'>{task.due_date || 'غير محدد'}</td>
                                <td className='p-2'>{task.status || 'غير محدد'}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TaskManager;