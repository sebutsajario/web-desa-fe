import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar/Index'
import DashboardContainer from '../fragments/DashboardContainer/Index'
import DashboardSection from '../components/DashboardSection/Index'
import Paragraph from '../components/Paragraph'
import Table from '../components/Table/Index'
import DashboardCard from '../components/DashboardCard/Index'
import DashboardHome from '../layouts/DashboardHome'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import ToastComponent from '../components/Toast/Index'
import Modal from '../components/Modal/Index'
import { Toast } from '../../contexts/ToastContext'
import { Auth } from '../../contexts/AuthContext'

const DashboardPage = () => {
    const [isToggle, setIsToggle] = useState(false);
    const {user} = useContext(Auth);
    const location = useLocation();
    const path = location.pathname.split('/');
    const navigate = useNavigate();
    const adminOnlyPath = ['assets', 'settings'];

    const handleToggle = () => {
        setIsToggle(!isToggle);
    };

    useEffect(() => {
        if(adminOnlyPath.includes(path[2])) {
            if(user.role !== 'Admin') {
                navigate('/401');
            };
        };
    }, []);

  return (
    <div className='flex flex-col w-screen h-screen relative'>
        <div className="flex justify-end sticky top-0 z-30 bg-white md:justify-center items-center h-14 px-10 py-5 border-b shadow">
            <svg onClick={handleToggle}
                className={`swap-off fill-current ${isToggle ? 'max-w-[0px] opacity-0 w-0' : 'max-w-[1000px] opacity-100 w-8 md:max-w-[0px] md:opacity-0'} cursor-pointer`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512">
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </svg>

            <div className='flex grow justify-center'>
                <Paragraph weight = 'font-bold' size = 'text-lg'>Portal Desa Mappetajang</Paragraph>
            </div>
        </div>
        <div className='flex flex-row flex-1 w-full shrink'>
            <Sidebar onHandleToggle = {handleToggle} setIsToggle={setIsToggle} isToggle = {isToggle} />
            <DashboardContainer>
                <ToastComponent />
                <Outlet />
            </DashboardContainer>
        </div>
    </div>
  )
}

export default DashboardPage