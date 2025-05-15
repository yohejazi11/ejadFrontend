import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { GrLanguage } from "react-icons/gr";

function Header() {
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId')
    const userRole = localStorage.getItem('userRole')
    const username = localStorage.getItem('username')

        const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <div className={`w-[100%] h-[fit-content] flex justify-between fixed top-0 ${scrolled?'bg-gray-100 ':'bg-[transparent]'} p-6 z-50`}>
            <div className='flex gap-4 items-center text-[20px] font-bold'>
                
                <div className={`h-[60px] w-[60px] flex justify-center items-center border-[1px] rounded-md  ${scrolled?'text-gray-800':'text-[#FFCF50]'}`}>
                    <GrLanguage></GrLanguage>
                </div>
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
                    <button
                    onClick={() => {
                        navigate('/login')
                    }}
                    >دخول</button>
                )}


            </div>
            <div className='flex gap-4 items-center'>
                <ul className={`flex gap-10 text-[20px] font-bold ${scrolled?'text-gray-800':'text-[#FFCF50]'}`}>
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
