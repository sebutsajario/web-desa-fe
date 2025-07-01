import React, { useContext, useEffect, useState } from 'react'
import DashboardSection from '../components/DashboardSection/Index'
import Paragraph from '../components/Paragraph'
import { Auth } from '../../contexts/AuthContext';
import axios from 'axios';
import { Toast } from '../../contexts/ToastContext';
import { useNavigate, useParams } from 'react-router-dom';

const AddVillager = (props) => {
    const {isEdit = false} = props;
    const [formData, setFormData] = useState({});
    const {user} = useContext(Auth);
    const {showToast} = useContext(Toast);
    const params = useParams();
    const id = params.id;
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    // console.log(user)
    const handleChange = (e) => {
        const id = e.target.id;
        const value = e.target.value;
        setFormData(prev => ({...prev, [id]: value}));
    };

    const handleSubmitData = () => {
        const data = new FormData();
        data.append('uid', formData.uid);
        data.append('name', formData.name);
        data.append('address', formData.address);
        data.append('gender', formData.gender);
        data.append('birthDate', formData.birthDate);
        data.append('birthPlace', formData.birthPlace);
        data.append('religion', formData.religion);
        data.append('education', formData.education);
        data.append('occupation', formData.occupation);
        data.append('user', user.id);

        if(!isEdit) {
            axios.post(`${apiUrl}/v1/villager/create`, data, {withCredentials:true})
                .then(res => {
                    showToast(res.data.message, 'success');
                    navigate('/dashboard/settings/villager');
                })
                .catch(err => {
                    console.log(err);
                    showToast('Gagal menambahkan data penduduk', 'failed');
                });
        } else {
            axios.put(`${apiUrl}/v1/villager/editdata/${id}`, data, {withCredentials: true})
                .then(res => {
                    showToast(res.data.message, 'success');
                    navigate('/dashboard/settings/villager');
                })
                .catch(err => {
                    console.log(err);
                    showToast('Gagal menambahkan data penduduk', 'failed');
                });
        }
    };
    console.log(user)

    useEffect(() => {
        if(!isEdit) {
            return;
        };
        axios.get(`${apiUrl}/v1/villager/getdata/${id}`)
            .then(res => {
                const data = res.data.data;
                setFormData(data);
                console.log(res);
            })
            .catch(err => console.log(err));
    }, []);
  return (
    <>
        <DashboardSection width = 'w-full' height = 'h-full'>
            <Paragraph size = 'text-lg' weight = 'font-bold'>Tambahkan/Edit Data Penduduk</Paragraph>
            <div className='flex flex-col gap-y-2'>
                <label htmlFor="uid"><Paragraph weight = 'font-medium'>Nomor Induk Kependudukan</Paragraph></label>
                <input onChange={handleChange} value={formData.uid} id='uid' type="text" placeholder="Nomor Induk Kependudukan" className="input w-full" />
                <label htmlFor="name"><Paragraph weight = 'font-medium'>Nama</Paragraph></label>
                <input onChange={handleChange} value={formData.name} id='name' type="text" placeholder="Nama" className="input w-full" />
                <label htmlFor="address"><Paragraph weight = 'font-medium'>Alamat</Paragraph></label>
                <select onChange={handleChange} value={formData.address} id='address' defaultValue="" className="select w-full">
                    <option value="" disabled={true}>Alamat</option>
                    <option value='Dusun Buntu Kaluaja'>Buntu Kaluaja</option>
                    <option value='Dusun Malenyong'>Malenyong</option>
                    <option value='Dusun Pemanukan'>Pemanukan</option>
                    <option value='Dusun Pongsimpin'>Pongsimpin</option>
                </select>
                <label htmlFor="gender"><Paragraph weight = 'font-medium'>Jenis Kelamin</Paragraph></label>
                <select onChange={handleChange} value={formData.gender} id='gender' defaultValue="" className="select w-full">
                    <option value="" disabled={true}>Jenis Kelamin</option>
                    <option>Laki-laki</option>
                    <option>Perempuan</option>
                </select>
                <label htmlFor="birthPlace"><Paragraph weight = 'font-medium'>Tempat Lahir</Paragraph></label>
                <input onChange={handleChange} value={formData.birthPlace} id='birthPlace' type="text" placeholder="Tempat Lahir" className="input w-full" />
                <label htmlFor="birthDate"><Paragraph weight = 'font-medium'>Tanggal Lahir</Paragraph></label>
                <input onChange={handleChange} value={formData.birthDate} id='birthDate' type="date" className="input w-full" />
                <label htmlFor="religion"><Paragraph weight = 'font-medium'>Agama</Paragraph></label>
                <select onChange={handleChange} value={formData.religion} id='religion' defaultValue="" className="select w-full">
                    <option value="" disabled={true}>Agama</option>
                    <option>Islam</option>
                    <option>Kristen Protestan</option>
                    <option>Kristen Katolik</option>
                    <option>Hindu</option>
                    <option>Buddha</option>
                    <option>Konghucu</option>
                    <option>Lainnya</option>
                </select>
                <label htmlFor="education"><Paragraph weight = 'font-medium'>Pendidikan Terakhir</Paragraph></label>
                <select onChange={handleChange} value={formData.education} id='education' defaultValue="" className="select w-full">
                    <option value="" disabled={true}>Pendidikan Terakhir</option>
                    <option>SD Sederajat</option>
                    <option>SMP Sederajat</option>
                    <option>SMA Sederajat</option>
                    <option>Sarjana/D4</option>
                    <option>Magister</option>
                    <option>Doktor</option>
                </select>
                <label htmlFor="occupation"><Paragraph weight = 'font-medium'>Pekerjaan</Paragraph></label>
                <input onChange={handleChange} value={formData.education} id='occupation' type="text" placeholder="Pekerjaan" className="input w-full" />
                <button onClick={handleSubmitData} className="btn btn-neutral mt-4">Tambahkan</button>
            </div>
        </DashboardSection>
    </>
  )
}

export default AddVillager