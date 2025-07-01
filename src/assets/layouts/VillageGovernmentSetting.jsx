import React, { useContext, useEffect, useState } from 'react'
import DashboardSection from '../components/DashboardSection/Index'
import Paragraph from '../components/Paragraph'
import EditorComponent from '../components/EditorComponent/Index';
import axios from 'axios';
import { Auth } from '../../contexts/AuthContext';
import { Toast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

const VillageGovernmentSetting = () => {
    const [formData, setFormData] = useState({});
    const [people, setPeople] = useState([{id: Date.now(), name: '', role: ''}]);
    const [isLoading, setIsLoading] = useState(true);
    const {user} = useContext(Auth);
    const {showToast} = useContext(Toast);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        axios.get(`${apiUrl}/v1/asset/get/government`)
            .then(res => {
                console.log(res.data.data.governmentData)
                const data = res.data.data;
                setFormData({visionMission: data.visionMission});
                data.governmentData ? setPeople(data.governmentData) : setPeople(people);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const handleAddPeople = () => {
        setPeople(
            [
                ...people,
                {
                    id: Date.now(),
                    name: '',
                    role: '',
                },
            ]
        )
    };

    const handleRemovePeople = (id) => {
        setPeople(people.filter(person => person.id !== id));
    };

    const handleChange = (id, field, value) => {
        setPeople(prev =>
            prev.map(person =>
            person.id == id ? { ...person, [field]: value } : person
            )
        );
    };

    const handleImageChange = (id, file) => {
        setPeople(prev =>
            prev.map(person =>
            person.id === id ? { ...person, image: file } : person
            )
        );
    };

    const hanldeSubmitData = () => {
        const data = new FormData();
        data.append('visionMission', JSON.stringify(formData.visionMission));
        data.append('user', user.id);
        people.forEach((person, index) => {
            data.append(`officer[${index}][id]`, person.id);
            data.append(`officer[${index}][name]`, person.name);
            data.append(`officer[${index}][role]`, person.role);
            if (person.image) {
            data.append(`officer[${index}][image]`, person.image);
            }
        });

        axios.put(`${apiUrl}/v1/asset/edit/government`, data, {withCredentials: true})
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
                <Paragraph size = 'text-lg' weight = 'font-bold'>Pengaturan Data Pemerintahan Desa</Paragraph>
                <Paragraph>Pengaturan Data Pemerintahan Desa</Paragraph>
                <div className='mt-4'>
                    <label><Paragraph weight = 'font-medium'>Visi dan Misi Desa</Paragraph></label>
                    <EditorComponent id='visionMission' setFormData={setFormData} value = {formData.visionMission} placeholder = 'Tuliskan visi dan misi desa di sini' />
                </div>
                <div className='flex flex-col gap-y-4 mt-4 transition-all ease-in-out duration-300'>
                    <label><Paragraph weight = 'font-medium'>DATA PEMERINTAH DESA</Paragraph></label>
                    {people?.length && people?.map((item, i) => (
                        <div key={item.id} className="flex flex-col gap-y-2 md:flex-row gap-x-3">
                            <div className="w-full md:w-1/3 relative group flex flex-col gap-y-2">
                                <div className={`w-full aspect-video group-hover:bg-slate-600/50 transition-all ease-in-out duration-300 gap-y-1 md:gap-y-2 bg-slate-600/30  rounded-lg flex flex-col justify-center items-center border-[0.5px] border-default/50 p-3 text-center overflow-hidden`}>
                                    <input onChange={(e) => handleImageChange(item.id, e.target.files[0])} id='image' className="opacity-0 absolute aspect-video w-full h-fit z-10 cursor-pointer" type="file" accept="image/*" />
                                    {item.image ? (
                                        <>
                                        <img className='h-3/5' src={typeof item.image === 'string' ? `${apiUrl}/${item.image}` : URL.createObjectURL(item.image)} alt="Preview" />
                                        <Paragraph weight = 'font-light' size = 'text-xs sm:text-base'>{item.image.name || item.image}</Paragraph>
                                    </>
                                    ) : (
                                    <>
                                        <span className="rounded-full">
                                        <svg className='w-10' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.5535 2.49392C12.4114 2.33852 12.2106 2.25 12 2.25C11.7894 2.25 11.5886 2.33852 11.4465 2.49392L7.44648 6.86892C7.16698 7.17462 7.18822 7.64902 7.49392 7.92852C7.79963 8.20802 8.27402 8.18678 8.55352 7.88108L11.25 4.9318V16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16V4.9318L15.4465 7.88108C15.726 8.18678 16.2004 8.20802 16.5061 7.92852C16.8118 7.64902 16.833 7.17462 16.5535 6.86892L12.5535 2.49392Z" fill="#1C274C"></path> <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z" fill="#1C274C"></path> </g></svg>
                                        </span>
                                        <Paragraph weight = 'font-bold' size = 'text-sm sm:text-lg'>Unggah Gambar</Paragraph>
                                        <Paragraph weight = 'font-light' size = 'text-xs sm:text-base'>Masukkan file gambar di sini</Paragraph>
                                    </>
                                    
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 gap-y-2">
                                <div className='flex flex-row justify-between items-start'>
                                    <label><Paragraph weight = 'font-medium'>Nama</Paragraph></label>
                                    <div onClick={() => handleRemovePeople(item.id)} className={`cursor-pointer ${i == 0 ? 'hidden' : ''}`}>
                                        <Paragraph size = 'text-xs' color= 'text-red-600' otherClass = 'underline'>Hapus</Paragraph>
                                    </div>
                                </div>
                                <input value={item.name} onChange={(e) => handleChange(item.id, 'name', e.target.value)} type="text" placeholder="Nama" className="input w-full" />
                                <label><Paragraph weight = 'font-medium'>Jabatan</Paragraph></label>
                                <input value={item.role} onChange={(e) => handleChange(item.id, 'role', e.target.value)} type="text" placeholder="Jabatan" className="input w-full" />
                            </div>
                        </div>
                    ))}
                    <button onClick={handleAddPeople} className="btn btn-outline mt-4">Tambah Data</button>
                    <button onClick={hanldeSubmitData} className="btn btn-neutral">Simpan</button>
                </div>
            </DashboardSection>
        ) : <></>}
    </>
  )
}

export default VillageGovernmentSetting