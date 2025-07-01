import React, { useContext, useEffect } from 'react'
import Navbar from '../components/Navbar/Index'
import Footer from '../components/Footer/Index'
import SectionTitle from '../components/SectionTitle/Index'
import ServicesListContainer from '../fragments/ServicesListContainer/Index'
import { Loading } from '../../contexts/LoadingContext'
import axios from 'axios'
import { Villager } from '../../contexts/VillagerContext'
import Paragraph from '../components/Paragraph'
import ServiceValidator from '../fragments/ServiceValidator/Index'
import { Link, useNavigate } from 'react-router-dom'
import { Toast } from '../../contexts/ToastContext'
import ToastComponent from '../components/Toast/Index'
import Header from '../components/Header'

const ServicesPage = () => {
  const {setIsPageLoading, isPageLoading} = useContext(Loading);
  const {villager, setVillager} = useContext(Villager);
  const {showToast} = useContext(Toast);
  const navigate = useNavigate('');
  const apiUrl = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    axios.get(`${apiUrl}/v1/villager/getaccess`, {withCredentials:true})
      .then(res => {
        const data = res.data;
        setVillager(data)
      })
      .catch(err => console.log(err))
      .finally(() => {
        setIsPageLoading(false);
      })
  }, []);

  const handleLogout = () => {
    axios.get(`${apiUrl}/v1/villager/deleteaccess`, {withCredentials:true})
      .then(res => {
        setVillager(null);
        window.location.reload();
      })
      .catch(err => console.log(err));
  };

  const handleToService = (link) => {
    if(!villager) {
      showToast('Masuk terlebih dahulu', 'failed');
      window.scrollTo({
        top: 0,
        behavior: "smooth"});
      return
    } else {
      navigate(link);
    }
  }

  return (
    <div className='relative'>
        <Navbar />
        {!isPageLoading && !villager && (
          <div className='flex w-full justify-center'>
            <ServiceValidator width = 'w-fit' toReload = {true}/>
          </div>
        )}
        <div className='flex flex-col md:flex-row justify-between w-full'>
          <ToastComponent />
          <div className='flex items-end'>
            <SectionTitle>LAYANAN ADMINISTRASI</SectionTitle>
          </div>
          {!isPageLoading && villager && (
            <div className='flex flex-row-reverse md:flex-row py-5 px-16 gap-x-3'>
              <div className='flex flex-col items-start md:items-end'>
                <Paragraph size='text-xs md:text-base' weight = 'font-normal'>Anda mengakses layanan sebagai</Paragraph>
                <Paragraph size='text-xs md:text-base'>{`${villager.name} (${villager.uid})`}</Paragraph>
                <div className='flex flex-row gap-x-2'>
                  <Link to='service/request' style={{display: 'contents'}}>
                    <Paragraph size = 'text-xs' otherClass = 'underline cursor-pointer'><span>Riwayat Layanan</span></Paragraph>
                  </Link>
                  <Link to='complaint/request' style={{display: 'contents'}}>
                    <Paragraph size = 'text-xs' otherClass = 'underline cursor-pointer'><span>Riwayat Keluhan</span></Paragraph>
                  </Link>
                  <Paragraph size = 'text-xs' otherClass = 'underline cursor-pointer'><span onClick={handleLogout}>Keluar</span></Paragraph>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-black h-8 w-8 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          )}
        </div>
        <ServicesListContainer handleToService = {()=>handleToService('service/request')} />
        <div className='flex flex-row items-center bg-gradient-to-t from-slate-800 to-slate-600 py-10 gap-x-5'>
          <div className='w-0 overflow-hidden md:w-1/3 flex justify-end px-5 md:px-10'>
            <svg fill="#F1F5F9" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 25.56 25.56" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M24.15,18.642V14.75c0-1.464-0.006-2.711-0.011-3.219l-4.844,3.396L24.15,18.642z"></path> <path d="M1.41,18.499v-3.892c0-1.464,0.009-2.712,0.011-3.218l4.844,3.396L1.41,18.499z"></path> <path d="M17.229,15.883l-4.061,2.849c-0.104,0.073-0.234,0.109-0.363,0.109s-0.257-0.036-0.366-0.109l-4.05-2.843l-6.798,5.203 c-0.055,0.041-0.116,0.072-0.181,0.092v0.074l0.018,4.302h22.697l0.017-4.302v-0.089L17.229,15.883z"></path> <path d="M17.499,0.061v3.124c0,0.647,0.526,1.174,1.176,1.174l2.421,0.071L17.499,0.061z"></path> <path d="M21.143,10.494V5.339h-3.59c-0.648,0-1.174-0.526-1.174-1.175V0H5.582c-0.65,0-1.175,0.524-1.175,1.175v9.278l8.028,5.633 c0.11,0.075,0.237,0.111,0.371,0.111c0.129,0,0.261-0.036,0.366-0.111L21.143,10.494z"></path> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </g></svg>
          </div>
          <div className='flex flex-col flex-1 gap-y-3'>
            <Header size= 'text-xl md:text-2xl' color = 'text-slate-100'>Layanan Keluhan</Header>
            <Paragraph size = 'text-sm md:text-base' color = 'text-slate-100'>Jika Anda memiliki keluhan/saran. Jangan ragu untuk menghubungi kami melalui:</Paragraph>
            <div className='flex flex-col gap-y-2'>
              <div className='flex flex-row gap-x-2 items-center'>
                  <svg className='icon w-8 h-8' viewBox="0 0 1024 1024" fill="#FFFFFF" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M512 1012.8c-253.6 0-511.2-54.4-511.2-158.4 0-92.8 198.4-131.2 283.2-143.2h3.2c12 0 22.4 8.8 24 20.8 0.8 6.4-0.8 12.8-4.8 17.6-4 4.8-9.6 8.8-16 9.6-176.8 25.6-242.4 72-242.4 96 0 44.8 180.8 110.4 463.2 110.4s463.2-65.6 463.2-110.4c0-24-66.4-70.4-244.8-96-6.4-0.8-12-4-16-9.6-4-4.8-5.6-11.2-4.8-17.6 1.6-12 12-20.8 24-20.8h3.2c85.6 12 285.6 50.4 285.6 143.2 0.8 103.2-256 158.4-509.6 158.4z m-16.8-169.6c-12-11.2-288.8-272.8-288.8-529.6 0-168 136.8-304.8 304.8-304.8S816 145.6 816 313.6c0 249.6-276.8 517.6-288.8 528.8l-16 16-16-15.2zM512 56.8c-141.6 0-256.8 115.2-256.8 256.8 0 200.8 196 416 256.8 477.6 61.6-63.2 257.6-282.4 257.6-477.6C768.8 172.8 653.6 56.8 512 56.8z m0 392.8c-80 0-144.8-64.8-144.8-144.8S432 160 512 160c80 0 144.8 64.8 144.8 144.8 0 80-64.8 144.8-144.8 144.8zM512 208c-53.6 0-96.8 43.2-96.8 96.8S458.4 401.6 512 401.6c53.6 0 96.8-43.2 96.8-96.8S564.8 208 512 208z" fill=""></path></g></svg>
                  <Paragraph color = 'text-slate-100' size = 'text-xs'>Nama Jalan</Paragraph>
              </div>
              <div className='flex flex-row gap-x-2 items-center'>
                  <svg className='w-8 h-8' viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#FFFFFF" fill-rule="evenodd" d="M96 16c-44.183 0-80 35.817-80 80 0 13.12 3.163 25.517 8.771 36.455l-8.608 36.155a6.002 6.002 0 0 0 7.227 7.227l36.155-8.608C70.483 172.837 82.88 176 96 176c44.183 0 80-35.817 80-80s-35.817-80-80-80ZM28 96c0-37.555 30.445-68 68-68s68 30.445 68 68-30.445 68-68 68c-11.884 0-23.04-3.043-32.747-8.389a6.003 6.003 0 0 0-4.284-.581l-28.874 6.875 6.875-28.874a6.001 6.001 0 0 0-.581-4.284C31.043 119.039 28 107.884 28 96Zm46.023 21.977c11.975 11.974 27.942 20.007 45.753 21.919 11.776 1.263 20.224-8.439 20.224-18.517v-6.996a18.956 18.956 0 0 0-13.509-18.157l-.557-.167-.57-.112-8.022-1.58a18.958 18.958 0 0 0-15.25 2.568 42.144 42.144 0 0 1-7.027-7.027 18.958 18.958 0 0 0 2.569-15.252l-1.582-8.021-.112-.57-.167-.557A18.955 18.955 0 0 0 77.618 52H70.62c-10.077 0-19.78 8.446-18.517 20.223 1.912 17.81 9.944 33.779 21.92 45.754Zm33.652-10.179a6.955 6.955 0 0 1 6.916-1.743l8.453 1.665a6.957 6.957 0 0 1 4.956 6.663v6.996c0 3.841-3.124 6.995-6.943 6.585a63.903 63.903 0 0 1-26.887-9.232 64.594 64.594 0 0 1-11.661-9.241 64.592 64.592 0 0 1-9.241-11.661 63.917 63.917 0 0 1-9.232-26.888C63.626 67.123 66.78 64 70.62 64h6.997a6.955 6.955 0 0 1 6.66 4.957l1.667 8.451a6.956 6.956 0 0 1-1.743 6.917l-1.12 1.12a5.935 5.935 0 0 0-1.545 2.669c-.372 1.403-.204 2.921.603 4.223a54.119 54.119 0 0 0 7.745 9.777 54.102 54.102 0 0 0 9.778 7.746c1.302.806 2.819.975 4.223.603a5.94 5.94 0 0 0 2.669-1.545l1.12-1.12Z" clip-rule="evenodd"></path></g></svg>
                  <Paragraph color = 'text-slate-100' size = 'text-xs'>Nomor Whatsapp</Paragraph>
              </div>
            </div>
            <Paragraph size = 'text-sm md:text-base' color = 'text-slate-100'>Atau dengan mengisi formulir dengan klik tombol di bawah.</Paragraph>
            <button onClick={()=>handleToService('complaint/request')} className="btn w-fit">Isi Formulir</button>
          </div>
        </div>
        <Footer />
    </div>
  )
}

export default ServicesPage