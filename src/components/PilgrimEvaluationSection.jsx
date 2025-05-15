import { useState, useEffect } from 'react';

function PilgrimEvaluationSection({ services }) {
    const [nationalId, setNationalId] = useState(localStorage.getItem('pilgrimId') || '');
    const [inputId, setInputId] = useState('');
    const [submitted, setSubmitted] = useState(!!nationalId);
    const [ratings, setRatings] = useState({});
    const [submittedRatings, setSubmittedRatings] = useState(false);

    const handleLogin = async () => {
        if (inputId.trim() !== '') {
            const res = await fetch('http://localhost/ejadBackend/api/login_pilgrim.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ national_id: inputId })
            });

            const data = await res.json();
            if (data.status === 'success') {
                const pilgrim = data.pilgrim;
                localStorage.setItem('nationalId', pilgrim.national_id); // optional
                localStorage.setItem('pilgrimId', pilgrim.id); // ⬅️ المهم
                setNationalId(pilgrim.id); // استخدم ID الحقيقي
                setSubmitted(true);
            } else {
                alert(data.message);
            }
        }
    };


    const handleRatingChange = (criteriaId, value) => {
        setRatings(prev => ({
            ...prev,
            [criteriaId]: value
        }));
    };

    const handleSubmitRatings = async () => {
        const pilgrim_id = nationalId; // استخدم رقم الهوية كـ id حسب تصميمك
        const payload = {
            pilgrim_id: pilgrim_id,
            ratings: []
        };

        // تضمين service_id مع كل تقييم
        services.forEach(service => {
            service.criteria.forEach(criterion => {
                const ratingValue = ratings[criterion.id];
                if (ratingValue) {
                    payload.ratings.push({
                        service_id: parseInt(service.id), // تأكد من تحويل service_id إلى رقم صحيح
                        criteria_id: criterion.id,
                        rating: parseInt(ratingValue)
                    });
                }
            });
        });

        const res = await fetch('http://localhost/ejadBackend/api/submit_criteria_rating.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        alert(data.message);
        if (data.status === 'success') {
            setSubmittedRatings(true); // ✅ أظهر رسالة الشكر
        }
    };


    const renderStars = (criteriaId) => {
        const currentRating = ratings[criteriaId] || 0;
        const stars = [1, 2, 3, 4, 5];

        return (
            <div className='flex'>
                {stars.map((star) => (
                    <svg
                        key={star}
                        onClick={() => handleRatingChange(criteriaId, star)}
                        xmlns="http://www.w3.org/2000/svg"
                        fill={star <= currentRating ? "yellow" : "gray"}
                        height="20"
                        viewBox="0 0 24 24"
                        width="20"
                        className="cursor-pointer"
                    >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <div className='w-[100%] h-[100vh] flex flex-col items-center justify-center pt-[60px] bg-gray-50'>
            {submitted ? (
                submittedRatings ? (
                    // ✅ رسالة الشكر بعد التقييم
                    <div className="bg-white p-6 rounded shadow-md text-center">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">شكرًا لتقييمك!</h2>
                        <p className="text-gray-700">نقدّر وقتك وملاحظاتك القيمة.</p>
                    </div>
                ) : (
                    // ✅ نموذج التقييم
                    <div className='w-[80%] h-[100%] overflow-y-auto'>
                        <h2 className='text-2xl font-bold text-center mb-6'>قيّم الخدمات</h2>
                        {services.map((service, index) => (
                            <div key={index} className='bg-white p-4 mb-6 rounded shadow-md'>
                                <h3 className='text-lg font-semibold mb-2'>{service.name}</h3>
                                {service.criteria.map((item, idx) => (
                                    <div key={idx} className='mb-3'>
                                        <label className='block mb-1 text-sm font-medium'>{item.title}</label>
                                        {renderStars(item.id)}
                                    </div>
                                ))}
                            </div>
                        ))}
                        <button
                            onClick={handleSubmitRatings}
                            className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-4'
                        >
                            إرسال التقييم
                        </button>
                    </div>
                )
            ) : (
                // شاشة تسجيل الدخول
                <div className='bg-white p-6 rounded shadow-md flex flex-col gap-4 w-[300px]'>
                    <h2 className='text-xl font-bold text-center'>تسجيل دخول الحاج</h2>
                    <input
                        type='text'
                        placeholder='أدخل رقم الهوية'
                        value={inputId}
                        onChange={e => setInputId(e.target.value)}
                        className='p-2 border rounded text-right'
                    />
                    <button
                        onClick={handleLogin}
                        className='bg-green-600 text-white py-2 rounded hover:bg-green-700'
                    >
                        دخول
                    </button>
                </div>
            )}

        </div>
    );
}

export default PilgrimEvaluationSection;
