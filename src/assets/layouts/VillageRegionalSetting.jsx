import React, { useContext, useEffect, useState } from 'react'
import DashboardSection from '../components/DashboardSection/Index'
import Paragraph from '../components/Paragraph'
import EditorComponent from '../components/EditorComponent/Index'
import axios from 'axios'
import { Toast } from '../../contexts/ToastContext'
import { useNavigate } from 'react-router-dom'
import { Auth } from '../../contexts/AuthContext'

const VillageRegionalSetting = () => {
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const {showToast} = useContext(Toast);
    const {user} = useContext(Auth);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        axios.get(`${apiUrl}/v1/asset/get/region`)
            .then(res => {
                const data = res.data.data;
                setFormData({region: data});
            })
            .catch(err => console.log(err))
            .finally(() => {
                setIsLoading(false);
            })
    }, []);

    const handleSubmitData = () => {
        const data = new FormData();
        data.append('region', JSON.stringify(formData.region));
        data.append('user', user.id);
        axios.put(`${apiUrl}/v1/asset/edit/region`, data, {withCredentials: true})
            .then(res => {
                console.log(res);
                showToast(res.data.message, 'success');
                navigate('/dashboard/assets');
            })
            .catch(err => {
                console.log(err);
                showToast('Gagal memperbarui data', 'failed');
            });
    };

  return (
    <>
        {!isLoading ? (
            <DashboardSection width = 'w-full'>
                <Paragraph size = 'text-lg' weight = 'font-bold'>Pengaturan Data Kewilayahan Desa</Paragraph>
                <Paragraph>Pengaturan data kewilayahan Desa Mappetajang</Paragraph>
                <label htmlFor="region"><Paragraph weight = 'font-medium'>Data Wilayah Desa</Paragraph></label>
                <EditorComponent setFormData = {setFormData} value = {formData.region} id='region' />
                <button onClick={handleSubmitData} type='submit' className="btn btn-primary w-fit self-end">Simpan</button>
            </DashboardSection>
        ) : <></>}
    </>
  )
}

export default VillageRegionalSetting