import { useEffect, useState } from 'react'
import Header from '../components/Header'
import PilgrimEvaluationSection from '../components/PilgrimEvaluationSection';

function Home() {

    const [services, setServices] = useState([]);

    useEffect(() => {
        fetchServices();
    }, []);
    function fetchServices() {
        fetch('http://localhost/ejadBackend/api/get_services.php')
            .then(response => response.json())
            .then(data => {
                setServices(data.services);
                console.log('Fetched services:', data);
            })
            .catch(error => console.error('Error fetching services:', error));
    }

    return (
        <div className='w-[100%] min-h-[100vh] bg-gray-200 flex flex-col items-center justify-center'>
            <Header />

            {/* intro vedio */}
            <div className='relative w-[100%] h-[100vh] flex flex-col items-center justify-center pt-[60px] bg-gray-500'>
                <video autoplay muted loop playsinline preload="auto"
                className='absolute top-0 left-0 w-[100%] h-[100vh] object-cover'
                >
                    <source src="videoplayback.mp4" type="video/mp4" />
                    المتصفح لا يدعم وسم الفيديو.
                </video>

                <div className='absolute top-0 left-0 w-full h-full bg-black opacity-75'></div>

                <div className='absolute bottom-[50px] left-[50px] h-[100px] w-[100px] flex flex-col border-[5px] border-double border-red-600 rounded-full items-center justify-center'>
                    <img 
                    className='w-[50%] h-[50%]'
                    src='emergency-call.png'></img>
                </div>

            </div>

            {/* basmah section */}
            <div className='w-[100%] h-[100vh] flex flex-col items-center justify-center pt-[60px]  bg-gray-300'>

            </div>

            {/* Services and their evaluation */}
            <div className='w-[100%] min-h-[100vh] flex flex-col items-center justify-center pt-[60px]  bg-gray-100'>
                <div className='w-[80%] h-[100%] flex flex-col items-center justify-center'>
                    <h1 className='text-[30px] font-bold'>الخدمات</h1>
                    <div className='w-[100%] h-[100%] flex flex-wrap gap-4 items-center justify-center'>
                        {services.map((service, index) => (
                            <div key={index} className='w-[300px] h-[fit-content] bg-white shadow-md rounded-lg p-4'>
                                <img src={service.image} alt={service.name} className='w-full h-48 object-cover rounded-lg mb-4' />
                                <h2 className='text-xl font-semibold mb-2'>{service.name}</h2>
                                <div className='space-y-2'>
                                    {service.criteria.map((item, index) => (
                                        <div key={index}>
                                            <div className='flex justify-between text-sm text-gray-600'>
                                                <span>{item.title}</span>
                                                <span>{item.rating}/5</span>
                                            </div>
                                            <div className='w-full bg-gray-200 rounded-full h-2.5'>
                                                <div
                                                    className='bg-green-500 h-2.5 rounded-full'
                                                    style={{ width: `${(item.rating / 5) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Service evaluation */}
            <PilgrimEvaluationSection services={services} />


        </div>
    )
}

export default Home
