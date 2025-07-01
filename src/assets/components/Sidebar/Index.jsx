import React, { useContext, useEffect, useState } from 'react'
import Paragraph from '../Paragraph'
import { Link, useNavigate } from 'react-router-dom';
import { Auth } from '../../../contexts/AuthContext';
import { Toast } from '../../../contexts/ToastContext';
import axios from 'axios';
import SidebarModal from '../Modal/SidebarModal';

const Sidebar = (props) => {
    const {onHandleToggle, isToggle, setIsToggle} = props;
    const {user, logout, getUser} = useContext(Auth);
    const [passwordMatch, setPasswordMatch] = useState(null);
    const [editErr, setIsEditErr] = useState('');
    const [formData, setFormData] = useState({});
    const {showToast} = useContext(Toast);
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    
    const handleOpenEditModal = (user) => {
        setFormData(user);
        return document.getElementById('sidebar_modal').showModal();
    };
    
    const handleLogout = async () => {
        const isLoggedOut = await logout();
        if(isLoggedOut) {
            navigate('/login');
        } else {
            return;
        }
    };

    const handleCloseModal = () => {
        setFormData({});
        return document.getElementById('sidebar_modal').close();
    };

    const handleChange = (e) => {
        const id = e.target.id;
        const value = e.target.value;
        setFormData(prev => ({...prev, [id]: value}));
    };

    useEffect(() => {
        if(formData.password && formData.confirmPassword) {
            if(formData.confirmPassword == formData.password) {
                setPasswordMatch(true);
            } else {
                setPasswordMatch(false);
            };
        };
    }, [formData])

    const handleSubmitEdit = () => {
        if(!passwordMatch) {
            setIsEditErr('Konfirmasi kata sandi terlebih dahulu');
            const timeout = setTimeout(() => {
                    setIsEditErr('');
                }, 5000)
                return () => clearTimeout(timeout);
        }
        const data = new FormData();
        data.append('userName', formData.userName);
        data.append('name', formData.name);
        data.append('currentPassword', formData.currentPassword);
        data.append('password', formData.password);
        data.append('role', formData.role);

        axios.put(`${apiUrl}/v1/auth/edit-user/${formData.id}`, data, {withCredentials: true})
            .then(res => {
                console.log(res);
                const message = res.data.message;
                showToast(message, 'success');
                setFormData({});
                getUser();
                setPasswordMatch(null);
                return document.getElementById('sidebar_modal').close();
            })
            .catch(err => {
                console.log(err);
                const message = err.response.data.message;
                setIsEditErr(message);
            })
            .finally(() => {
                const timeout = setTimeout(() => {
                    setIsEditErr('');
                }, 5000)
                return () => clearTimeout(timeout);
            });

    }
  return (
    <div className={`h-screen md:h-full fixed ${isToggle ? 'z-30' : 'z-0'} top-0 md:flex flex-col flex-none w-64 antialiased bg-gray-50 text-gray-800 md:relative ${!isToggle ? 'max-w-[0px] opacity-0 md:max-w-[1000px] md:opacity-100' : 'max-w-[1000px] opacity-100'} transition-all ease-in-out duration-300`}>
        <div className="fixed flex flex-col w-64 bg-white h-full border-r">
            <SidebarModal>
                <div className='flex flex-col gap-y-3'>
                    <div className='flex flex-col gap-y-2'>
                        <div className='flex flex-row justify-between'>
                            <Paragraph size = 'text-lg' weight = 'font-bold'>Edit Pengguna</Paragraph>
                            <svg onClick={handleCloseModal} className='w-6 h-6 self-end cursor-pointer' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" fill="#000000"></path></g></svg>
                        </div>
                        <label htmlFor="userName"><Paragraph weight = 'font-medium'>User ID</Paragraph></label>
                            <input id='userName' onChange={handleChange} value={formData.userName || ""} type="text" placeholder="User ID" className="input w-full" />
                            <label htmlFor="currentPassword"><Paragraph weight = 'font-medium'>Kata Sandi Saat Ini</Paragraph></label>
                            <input id='currentPassword' value={formData.currentPassword || ""} onChange={handleChange} type="password" placeholder="Kata Sandi" className="input w-full" />
                            <label htmlFor="password"><Paragraph weight = 'font-medium'>Kata Sandi Baru</Paragraph></label>
                            <input id='password' value={formData.password || ""} onChange={handleChange} type="password" placeholder="Kata Sandi" className="input w-full" />
                            <label htmlFor="password"><Paragraph weight = 'font-medium'>Konfirmasi Kata Sandi</Paragraph></label>
                            <input id='confirmPassword' value={formData.confirmPassword || ""} onChange={handleChange} type="password" placeholder="Kata Sandi" className={`input w-full ${passwordMatch === false ? 'input-error' : ''} `}/>
                            <Paragraph size = 'text-xs' otherClass = {`italic ${passwordMatch === false ? 'max-h-[1000px] opacity-100' : 'max-h-[0px] opacity-0'} ease-in-out duration-300 transition-all`} color = 'text-error'>Konfirmasi kata sandi tidak sesuai</Paragraph>
                            <label htmlFor="name"><Paragraph weight = 'font-medium'>Nama</Paragraph></label>
                            <input value={formData.name || ""} onChange={handleChange} id='name' type="text" placeholder="Nama" className="input w-full" />
                            <label htmlFor="role"><Paragraph weight = 'font-medium'>Peran</Paragraph></label>
                            <select value={formData.role || ""} onChange={handleChange} id='role' defaultValue="" className="select w-full">
                                <option value="" disabled={true}>Peran</option>
                                <option>Admin</option>
                                <option>User</option>
                            </select>
                            <Paragraph size = 'text-xs' otherClass = {`text-center ${editErr ? 'max-h-[1000px] opacity-100' : 'max-h-[0px] opacity-0'} ease-in-out duration-300 transition-all`} color = 'text-error'>{editErr}</Paragraph>
                            <button onClick={handleSubmitEdit} className="btn btn-neutral mt-4">Simpan</button>
                    </div>
                </div>
            </SidebarModal>
            <div className={`md:hidden flex justify-end ${!isToggle ? 'max-w-[0px] max-h-[0px]' : 'max-w-[1000px] pt-5 pr-5'}`}>
                <svg onClick={onHandleToggle}
                    className={`swap-on fill-current cursor-pointer transition-all ease-in-out duration-300 w-8 self-end`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512">
                    <polygon
                    points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                </svg>
            </div>
            <div className="overflow-y-auto overflow-x-hidden flex-grow">
            <ul className="flex flex-col py-2 space-y-1">
                <li className="px-5">
                    {user && (
                        <div className="flex flex-col justify-center gap-y-1 py-2">
                            <div className='flex flex-row justify-between items-center'>
                                <div className='flex flex-row gap-x-2 items-center'>
                                    <Paragraph weight ='font-semibold'>{user.name}</Paragraph>
                                    <div className='px-2 bg-teal-600 rounded-sm'>
                                        <Paragraph color = 'text-white' size = 'text-xs'>{user.role}</Paragraph>
                                    </div>
                                </div>
                                <svg onClick={()=>handleOpenEditModal(user)} className='w-5 h-5 cursor-pointer' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.3785 8.44975L8.9636 17.8648C8.6844 18.144 8.3288 18.3343 7.94161 18.4117L4.99988 19.0001L5.58823 16.0583C5.66566 15.6711 5.85597 15.3155 6.13517 15.0363L15.5501 5.62132M18.3785 8.44975L19.7927 7.03553C20.1832 6.64501 20.1832 6.01184 19.7927 5.62132L18.3785 4.20711C17.988 3.81658 17.3548 3.81658 16.9643 4.20711L15.5501 5.62132M18.3785 8.44975L15.5501 5.62132" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            </div>
                            <Paragraph weight ='font-light' size = 'text-xs' color ='text-gray-500'>{user.userName}</Paragraph>
                        </div>
                    )}
                </li>
                <div className='divider'></div>
                <li className="px-5">
                <div className="flex flex-row items-center h-8">
                    <div className="text-sm font-light tracking-wide text-gray-500">Menu</div>
                </div>
                </li>
                <li>
                <Link to="" onClick={()=>setIsToggle(false)} className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                    <span className="inline-flex justify-center items-center ml-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    </span>
                    <span className="ml-2 text-sm tracking-wide truncate">Beranda</span>
                </Link>
                </li>
                <li>
                <Link onClick={()=>setIsToggle(false)} to="services" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                    <span className="inline-flex justify-center items-center ml-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                    </span>
                    <span className="ml-2 text-sm tracking-wide truncate">Permintaan Layanan</span>
                </Link>
                </li>
                <li>
                <Link onClick={()=>setIsToggle(false)} to="complaints" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                    <span className="inline-flex justify-center items-center ml-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                    </span>
                    <span className="ml-2 text-sm tracking-wide truncate">Keluhan</span>
                </Link>
                </li>
                <li>
                <Link onClick={()=>setIsToggle(false)} to="news" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                    <span className="inline-flex justify-center items-center ml-4">
                        <svg className='w-5 h-5' fill="currentColor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 92 92" enable-background="new 0 0 92 92" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_1210_" d="M76,2H16c-2.2,0-4,1.8-4,4v80c0,2.2,1.8,4,4,4h60c2.2,0,4-1.8,4-4V6C80,3.8,78.2,2,76,2z M72,82H20V10h52 V82z M30,67.5c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,71,57.3,71H33.5C31.6,71,30,69.4,30,67.5z M30,53.5 c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,57,57.3,57H33.5C31.6,57,30,55.4,30,53.5z M61,24.5c0-1.9-1.6-3.5-3.5-3.5 h-24c-1.9,0-3.5,1.6-3.5,3.5v14c0,1.9,1.6,3.5,3.5,3.5h24c1.9,0,3.5-1.6,3.5-3.5V24.5z M37,28h17v7H37V28z"></path> </g></svg>
                    </span>
                    <span className="ml-2 text-sm tracking-wide truncate">Berita & Pengumuman</span>
                </Link>
                </li>
                <li>
                {user?.role.toLowerCase() === 'admin' && 
                    <Link onClick={()=>setIsToggle(false)} to="assets" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">Aset Halaman</span>
                    </Link>
                }
                </li>
                <li>
                </li>
                <li className="px-5">
                <div className="flex flex-row items-center h-8">
                    <div className="text-sm font-light tracking-wide text-gray-500">Pengaturan</div>
                </div>
                </li>
                <li>
                {user?.role.toLowerCase() === 'admin' &&
                    <Link to="settings" onClick={()=>setIsToggle(false)} className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                        <span className="inline-flex justify-center items-center ml-4">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">Pengaturan Portal</span>
                    </Link>
                }
                </li>
                <li>
                <div onClick={handleLogout} className="relative flex flex-row items-center cursor-pointer h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                    <span className="inline-flex justify-center items-center ml-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </span>
                    <span className="ml-2 text-sm tracking-wide truncate">Keluar</span>
                </div>
                </li>
            </ul>
            </div>
        </div>
    </div>
  )
}

export default Sidebar