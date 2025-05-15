import React, { useState } from 'react';
import { useNavigate } from 'react-router';

function Login() {
    const navigate = useNavigate();
    const [nationalID, setnationalID] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost/ejadBackend/api/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // ⬅️ يسمح بإرسال الكوكيز إن وجدت
            body: JSON.stringify({ nationalID, password }),
        });

        const data = await response.json();

        if (response.ok) {
            setUser(data); // حفظ بيانات المستخدم
            setMessage(data.message);
            // يمكنك أيضًا حفظ بيانات الدخول في localStorage مثلاً
            localStorage.setItem("userId", data.id);
            localStorage.setItem("username", data.username);
            localStorage.setItem("userRole", data.role);
            navigate('/dashboard'); // إعادة التوجيه إلى الصفحة الرئيسية
        } else {
            setMessage(data.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-sm">
                {user ? (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">مرحباً، {user.username}!</h2>
                        <p className="text-green-600">{message}</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-bold text-center mb-4">تسجيل الدخول</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="number"
                                placeholder="البريد الإلكتروني"
                                value={nationalID}
                                onChange={(e) => setnationalID(e.target.value)}
                                className="p-2 border border-gray-300 rounded text-right"
                                required
                            />
                            <input
                                type="password"
                                placeholder="كلمة المرور"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="p-2 border border-gray-300 rounded text-right"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >
                                دخول
                            </button>
                            {message && <p className="text-center text-red-600">{message}</p>}
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default Login;
