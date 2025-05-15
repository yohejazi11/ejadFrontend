import React, { useState } from 'react';

function EvaluationManager() {
    const [viewState, setViewState] = useState(null);

    function renderView() {
        switch (viewState) {
            case 'add_criteria':
                return (
                    <div className='p-8 bg-white shadow rounded w-full'>
                        <h2 className='text-xl font-bold mb-4'>إضافة بند تقييم</h2>
                        <form className='space-y-4'>
                            <input
                                type="text"
                                placeholder="اسم البند"
                                className="w-full border rounded p-2"
                            />
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                                حفظ البند
                            </button>
                        </form>
                    </div>
                );
            case 'add_evaluation':
                return (
                    <div className='p-8 bg-white shadow rounded w-full'>
                        <h2 className='text-xl font-bold mb-4'>إضافة تقييم</h2>
                        <form className='space-y-4'>
                            <select className='w-full border p-2 rounded'>
                                <option>اختر البند</option>
                                <option>جودة الخدمة</option>
                                <option>سرعة الاستجابة</option>
                            </select>
                            <input
                                type="number"
                                placeholder="درجة التقييم"
                                className="w-full border rounded p-2"
                            />
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                                إضافة التقييم
                            </button>
                        </form>
                    </div>
                );
            case 'view_votes':
                return (
                    <div className='p-8 bg-white shadow rounded w-full'>
                        <h2 className='text-xl font-bold mb-4'>قائمة المصوتين</h2>
                        <ul className='list-disc pl-6'>
                            <li>أحمد محمد - تقييم: 4.5</li>
                            <li>سارة عبد الله - تقييم: 5</li>
                            <li>ياسر العتيبي - تقييم: 3.8</li>
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
                <h3 className='text-lg font-semibold mb-4'>خيارات التقييم</h3>
                <ul className='space-y-2'>
                    <li>
                        <button
                            onClick={() => setViewState('add_criteria')}
                            className="w-full text-right text-blue-600 hover:underline"
                        >
                            إضافة بند
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setViewState('add_evaluation')}
                            className="w-full text-right text-blue-600 hover:underline"
                        >
                            إضافة تقييم
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setViewState('view_votes')}
                            className="w-full text-right text-blue-600 hover:underline"
                        >
                            عرض المصوتين
                        </button>
                    </li>
                </ul>
            </div>

            
        </div>
    );
}

export default EvaluationManager;

