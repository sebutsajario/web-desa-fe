import React, { useContext, useEffect, useState } from 'react'
import Paragraph from '../../components/Paragraph'
import axios from 'axios';
import { Villager } from '../../../contexts/VillagerContext';
import { Link } from 'react-router-dom';
import { Observer } from 'tailwindcss-intersect';

const ServiceValidator = (props) => {
    const {width = 'w-full', toReload = false} = props;
    
    const [inputData, setInputData] = useState('');
    const [isGettingData, setIsGettingData] = useState(false);
    const [isDataExist, setIsDataExist] = useState(null);
    const [showMessage, setShowMessage] = useState(false);
    const [contact, setContact] = useState({});
    const {villager, setVillager} = useContext(Villager);
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleChangeInput = (e) => {
        const data = e.target.value;
        setInputData(data);
    };

    const handleLoginVillager = () => {
        if(!inputData) {
            return;
        }
        const form = new FormData();
        form.append('uid', inputData);
        setIsGettingData(true);

        axios.post(`${apiUrl}/v1/villager/postaccess`, form, {withCredentials:true})
            .then(res => {
                const data = res.data.data;
                console.log(res)
                setVillager(data);
                setIsDataExist(true)
                if(toReload) {
                    window.location.reload();
                };
            })
            .catch(err => {
                console.log(err)
                setIsDataExist(false);
            })
            .finally(() => {
                setIsGettingData(false);
            });
    };

    useEffect(() => {
        if(isDataExist === null) {
            setShowMessage(false);
        } else {
            setShowMessage(true);
            if(isDataExist === false) {
                const timeoutId = setTimeout(() => {
                    setShowMessage(false);
                    }, 5000);
                
                    // Cleanup function to clear the timeout if the component unmounts
                    return () => clearTimeout(timeoutId);
            }
        }
    }, [isDataExist, isGettingData]);

    useEffect(() => {
        axios.get(`${apiUrl}/v1/asset/get/portal-asset`)
            .then(res => {
                const data = res.data.data;
                const phone = data.phone;
                const address = data.address;
                setContact({phone, address});
            })
            .catch(err => console.log(err))
            .finally(() => Observer.start())
    }, []);
  return (
    <>
        <div className='flex flex-row w-full gap-x-16 bg-slate-500 justify-center lg:justify-between py-10 px-20 flex-wrap gap-y-5'>
            <div className={`relative flex flex-col gap-y-3 md:flex-row sm:flex-1 w-full justify-center gap-x-12 bg-gradient-to-b from-gray-950 to-gray-900 p-10 ${width} rounded-md intersect:motion-preset-slide-right-md intersect-once shadow-md shadow-slate-950`}>
                <div className={`absolute top-0 left-0 w-full h-full bg-white transition-opacity ease-in-out duration-150 ${isGettingData ? 'z-10 opacity-50' : 'z-0 opacity-0'}`}></div>
                <div className='flex flex-col gap-y-2'>
                    <Paragraph weight = 'font-bold' size = 'text-lg' color = 'text-white'>Layanan Mandiri</Paragraph>
                    <Paragraph color = 'text-white'>Untuk Masyarakat Desa Mappetajang</Paragraph>
                </div>
                <div className='flex flex-col gap-y-2'>
                    <div className="join">
                        <div>
                            <div>
                            <input onChange={handleChangeInput} className="input join-item border-none" placeholder="NIK Anda" />
                            </div>
                        </div>
                        <div className="indicator">
                            <button onClick={handleLoginVillager} className="btn join-item shadow-none">Masuk</button>
                        </div>
                    </div>
                    <Paragraph color = 'text-white' size = 'text-xs'>* Akses Layanan Menggunakan <span className='font-bold'>NIK Anda</span></Paragraph>
                    <div className={`${showMessage ? 'max-h-[1000px] opacity-100' : 'max-h-[0px] opacity-0'} transition-all ease-in-out duration-150 z-10`}>
                        {isDataExist ? (<Paragraph color = 'text-white' size = 'text-xs'>Data penduduk terdaftar. Akses <Link to = '/services'>Layanan</Link></Paragraph>) : <Paragraph color = 'text-red-500' size = 'text-xs'>Data penduduk tidak terdaftar</Paragraph>}
                    </div>
                </div>
            </div>
            <div className='flex bg-gradient-to-b w-full lg:w-fit from-gray-950 to-gray-900 rounded-md flex-col gap-y-3 p-10 intersect:motion-preset-slide-left-md intersect-once shadow-md shadow-slate-950'>
                <Paragraph color = 'text-white'>Hubungi perangkat desa untuk mendaftarkan NIK Anda</Paragraph>
                {contact && (
                    <div className='flex flex-col gap-y-2 items-start'>
                        <div className='flex flex-row gap-x-2 items-center'>
                            <svg className='icon w-8 h-8' viewBox="0 0 1024 1024" fill="#FFFFFF" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M512 1012.8c-253.6 0-511.2-54.4-511.2-158.4 0-92.8 198.4-131.2 283.2-143.2h3.2c12 0 22.4 8.8 24 20.8 0.8 6.4-0.8 12.8-4.8 17.6-4 4.8-9.6 8.8-16 9.6-176.8 25.6-242.4 72-242.4 96 0 44.8 180.8 110.4 463.2 110.4s463.2-65.6 463.2-110.4c0-24-66.4-70.4-244.8-96-6.4-0.8-12-4-16-9.6-4-4.8-5.6-11.2-4.8-17.6 1.6-12 12-20.8 24-20.8h3.2c85.6 12 285.6 50.4 285.6 143.2 0.8 103.2-256 158.4-509.6 158.4z m-16.8-169.6c-12-11.2-288.8-272.8-288.8-529.6 0-168 136.8-304.8 304.8-304.8S816 145.6 816 313.6c0 249.6-276.8 517.6-288.8 528.8l-16 16-16-15.2zM512 56.8c-141.6 0-256.8 115.2-256.8 256.8 0 200.8 196 416 256.8 477.6 61.6-63.2 257.6-282.4 257.6-477.6C768.8 172.8 653.6 56.8 512 56.8z m0 392.8c-80 0-144.8-64.8-144.8-144.8S432 160 512 160c80 0 144.8 64.8 144.8 144.8 0 80-64.8 144.8-144.8 144.8zM512 208c-53.6 0-96.8 43.2-96.8 96.8S458.4 401.6 512 401.6c53.6 0 96.8-43.2 96.8-96.8S564.8 208 512 208z" fill=""></path></g></svg>
                            <div className='flex flex-col gap-y-1'>
                                <Paragraph color = 'text-white' size = 'text-xs' weight = 'font-semibold'>Alamat Kantor Desa:</Paragraph>
                                <Paragraph color = 'text-white' size = 'text-xs'>{contact.address}</Paragraph>
                            </div>
                        </div>
                        <div className='flex flex-row gap-x-2 items-center'>
                            <svg className='w-8 h-8' viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#FFFFFF" fill-rule="evenodd" d="M96 16c-44.183 0-80 35.817-80 80 0 13.12 3.163 25.517 8.771 36.455l-8.608 36.155a6.002 6.002 0 0 0 7.227 7.227l36.155-8.608C70.483 172.837 82.88 176 96 176c44.183 0 80-35.817 80-80s-35.817-80-80-80ZM28 96c0-37.555 30.445-68 68-68s68 30.445 68 68-30.445 68-68 68c-11.884 0-23.04-3.043-32.747-8.389a6.003 6.003 0 0 0-4.284-.581l-28.874 6.875 6.875-28.874a6.001 6.001 0 0 0-.581-4.284C31.043 119.039 28 107.884 28 96Zm46.023 21.977c11.975 11.974 27.942 20.007 45.753 21.919 11.776 1.263 20.224-8.439 20.224-18.517v-6.996a18.956 18.956 0 0 0-13.509-18.157l-.557-.167-.57-.112-8.022-1.58a18.958 18.958 0 0 0-15.25 2.568 42.144 42.144 0 0 1-7.027-7.027 18.958 18.958 0 0 0 2.569-15.252l-1.582-8.021-.112-.57-.167-.557A18.955 18.955 0 0 0 77.618 52H70.62c-10.077 0-19.78 8.446-18.517 20.223 1.912 17.81 9.944 33.779 21.92 45.754Zm33.652-10.179a6.955 6.955 0 0 1 6.916-1.743l8.453 1.665a6.957 6.957 0 0 1 4.956 6.663v6.996c0 3.841-3.124 6.995-6.943 6.585a63.903 63.903 0 0 1-26.887-9.232 64.594 64.594 0 0 1-11.661-9.241 64.592 64.592 0 0 1-9.241-11.661 63.917 63.917 0 0 1-9.232-26.888C63.626 67.123 66.78 64 70.62 64h6.997a6.955 6.955 0 0 1 6.66 4.957l1.667 8.451a6.956 6.956 0 0 1-1.743 6.917l-1.12 1.12a5.935 5.935 0 0 0-1.545 2.669c-.372 1.403-.204 2.921.603 4.223a54.119 54.119 0 0 0 7.745 9.777 54.102 54.102 0 0 0 9.778 7.746c1.302.806 2.819.975 4.223.603a5.94 5.94 0 0 0 2.669-1.545l1.12-1.12Z" clip-rule="evenodd"></path></g></svg>
                            <div className='flex flex-col gap-y-1'>
                                <Paragraph color = 'text-white' size = 'text-xs' weight = 'font-semibold'>Nomor Telepon:</Paragraph>
                                <Paragraph color = 'text-white' size = 'text-xs'>{contact.phone}</Paragraph>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </>
  )
}

export default ServiceValidator