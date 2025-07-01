import React, { useContext, useEffect, useState } from 'react'
import SectionTitle from '../components/SectionTitle/Index'
import Footer from '../components/Footer/Index'
import Navbar from '../components/Navbar/Index'
import { Loading } from '../../contexts/LoadingContext'
import axios from 'axios'
import { Villager } from '../../contexts/VillagerContext'
import Paragraph from '../components/Paragraph'
import { useNavigate } from 'react-router-dom'
import { Toast } from '../../contexts/ToastContext'

const ComplaintFormPage = () => {
    const {isPageLoading, setIsPageLoading} = useContext(Loading);
    const {villager, setVillager} = useContext(Villager);
    const {showToast} = useContext(Toast);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    useEffect(() => {
        if(villager) {
            setFormData({_id: villager._id, uid: villager.uid, name: villager.name});
            setIsPageLoading(false);
        };
        axios.get(`${apiUrl}/v1/villager/getaccess`, {withCredentials:true})
          .then(res => {
            const data = res.data;
            setVillager(data);
            setFormData({_id: data._id, uid: data.uid, name: data.name});
          })
          .catch((err) => {
            console.log(err)
            navigate('/401')
          })
          .finally(() => {
            setIsPageLoading(false);
          })
      }, []);

    const handleChangeForm = (e) => {
      const id = e.target.id;
      const value = e.target.value;

      setFormData(prev => ({...prev, [id]: value}));
    };

    const handleSubmit = () => {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('uid', formData.uid);
      data.append('address',  formData.address);
      data.append('gender', formData.gender);
      data.append('phone', formData.phone);
      data.append('note', formData.note);
      data.append('villager', JSON.stringify(villager));
      
      axios.post(`${apiUrl}/v1/complaint/create`, data, {withCredentials: true})
        .then(res => {
          console.log(res);
          showToast(res.data.message, 'success');
          navigate('/services/complaint/request');
        })
        .catch(err => console.log(err))
    }
  return (
    <>
      {villager && formData && (
        <div className='relative'>
            <Navbar />
            <div className='flex flex-col md:flex-row justify-between w-full'>
              <SectionTitle>PENGAJUAN KOMPLAIN</SectionTitle>
              {!isPageLoading && villager && (
                <div className='flex flex-row-reverse md:flex-row py-5 px-16 gap-x-3'>
                  <div className='flex flex-col items-start md:items-end'>
                    <Paragraph weight = 'font-normal'>Anda mengakses layanan sebagai</Paragraph>
                    <Paragraph>{`${villager.name} (${villager.uid})`}</Paragraph>
                    {/* <Paragraph size = 'text-xs' otherClass = 'underline cursor-pointer'><span onClick={handleLogout}>Keluar</span></Paragraph> */}
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-black h-8 w-8 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              )}
            </div>
            <div className='flex flex-col items-center'>
                <fieldset className="fieldset w-2/3 md:w-1/2 bg-base-200 border-base-300 rounded-box w-xs border p-4">
    
                    <label htmlFor='name' className="label">Nama</label>
                    <input id='name' onChange={handleChangeForm} type="email" defaultValue={formData.name} className="input w-full" placeholder="Nama" />
    
                    <div className='flex flex-row gap-1'>
                        <label htmlFor='uid' className="label">NIK</label>
                        <div className="tooltip tooltip-right" data-tip="Anda tidak dapat mengubah kolom NIK">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-3 w-3 shrink-0 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <input id='uid' type='text' value={formData.uid} className="input w-full" placeholder="NIK" disabled />
    
                    <label htmlFor='gender' className="label">Jenis Kelamin</label>
                    <select id='gender' onChange={handleChangeForm} defaultValue="" className="select w-full">
                        <option value="" disabled={true}>Jenis Kelamin</option>
                        <option>Laki-laki</option>
                        <option>Perempuan</option>
                    </select>
                    <label htmlFor='address' className="label">Alamat</label>
                    <input id='address' onChange={handleChangeForm} type="text" className="input w-full" placeholder="Alamat" />
                    <div className='flex flex-row gap-1'>
                        <label htmlFor='phone' className="label">No. Handphone</label>
                        <div className="tooltip tooltip-right" data-tip="Masukkan No. HP yang dapat dihubungi (diutamakan Whatsapp)">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-3 w-3 shrink-0 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <input onChange={handleChangeForm} id='phone' type="text" className="input w-full" placeholder="Nomor Handphone" />
                    <div className='flex flex-row gap-1'>
                        <label htmlFor='note' className="label">Keluhan</label>
                        <div className="tooltip tooltip-right" data-tip="Anda perlu melengkapi data tambahan yang dibutuhkan dan perlu untuk dilampirkan dalam surat yang akan diterbitkan">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-3 w-3 shrink-0 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <textarea id='note' onChange={handleChangeForm} className="textarea w-full resize-none" placeholder="Tambahkan keterangan lainnya" rows="10"></textarea>
                    <button onClick={handleSubmit} className="btn btn-neutral mt-4">Kirim</button>
                </fieldset>
            </div>
            <Footer />
        </div>
      )}
    </>
  )
}

export default ComplaintFormPage