import { useState } from 'react'
import { useNavigate } from 'react-router'

function Header() {
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId')
    const userRole = localStorage.getItem('userRole')
    return (
        <div className="w-[100%] h-[fit-content] flex justify-between fixed top-0 bg-gray-100 p-6">
            <div className='flex gap-4 items-center text-[20px] font-bold'>
                {userId ? (
                    userRole === 'admin' ? (
                        <button
                        onClick={() => {
                            navigate('/dashboard')
                        }}
                        >مرحبا بك في لوحة التحكم</button>
                    ) : (
                        <span>مرحبا بك في نظام البصمة</span>
                    )
                ) : (
                    <button>دخول</button>
                )}


            </div>
            <div className='flex gap-4 items-center'>
                <ul className='flex gap-4 text-[20px] font-bold'>
                    <li>تقييم خدمة</li>
                    <li>الاستطلاعات</li>
                    <li>بصمة</li>
                    <li>الرئيسية </li>
                </ul>
                <div className='w-[60px] h-[60px]'>
                    <img src='logo.png' className='w-[100%] h-[100%]'></img>
                </div>

            </div>


        </div>
    )
}

export default Header
