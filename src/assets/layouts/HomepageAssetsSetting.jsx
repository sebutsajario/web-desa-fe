import React, { useContext, useEffect, useState } from 'react'
import DashboardSection from '../components/DashboardSection/Index'
import Paragraph from '../components/Paragraph'
import axios from 'axios';
import { Auth } from '../../contexts/AuthContext';
import { Toast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

const HomepageAssetsSetting = () => {
    const [formData, setFormData] = useState({});
    const [currentImage, setCurrentImage] = useState({});
    const [currentHero, setCurrentHero] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const {user} = useContext(Auth);
    const {showToast} = useContext(Toast);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        axios.get(`${apiUrl}/v1/asset/get/portal-asset`)
            .then(res => {
                const data = res.data.data;
                console.log(data.chiefImage);
                setCurrentHero({url: `${apiUrl}/${data.hero.replace(/\\/g, '/')}`});
                setCurrentImage({url: `${apiUrl}/${data.chiefImage}`, name: data.chiefImage});
                setFormData(data);
            })
            .catch(err => console.log(err))
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const id = e.target.id;
        const value = e.target.value;
        const file = e.target.files;
        if(!file) {
            setFormData(prevItem => ({...prevItem, [id]: value}));
        } else {
            if(id == 'chiefImage') {
                const url = URL.createObjectURL(file[0]);
                setCurrentImage({url: url, name: file[0].name});
            } else {
                const url = URL.createObjectURL(file[0]);
                setCurrentHero({url: url});
            }
            setFormData(prevItem => ({...prevItem, [id]: file[0]}));
        }
    };

    console.log(formData)

    const handleSubmit = () => {
        const data = new FormData();
        data.append('user', user.id);
        data.append('chiefName', formData.chiefName);
        data.append('greet', formData.greet);
        data.append('address', formData.address);
        data.append('phone', formData.phone);
        data.append('hero', formData.hero);
        data.append('chiefImage', formData.chiefImage);
        axios.put(`${apiUrl}/v1/asset/edit/portal-asset`, data, {withCredentials: true})
            .then(res => {
                console.log(res)
                const message = res.data.message;
                showToast(message, 'success');
                navigate(-1);
            })
            .catch(err => {
                showToast('Gagal memperbarui data', 'failed');
            });
    };

  return (
    <>
        {!isLoading ? (
            <DashboardSection width = 'w-full' height = 'h-full'>
                <Paragraph size = 'text-lg' weight = 'font-bold'>Pengaturan Data Halaman Utama</Paragraph>
                <Paragraph>Pengaturan data halaman utama Portal Desa Mappetajang</Paragraph>
                <div className='flex flex-col gap-y-2 md:flex-row gap-x-3'>
                    <div className='flex flex-col gap-y-2 flex-1'>
                        <label htmlFor="chiefName"><Paragraph weight = 'font-medium'>Nama Kepala Desa</Paragraph></label>
                        <input value={formData.chiefName} onChange={handleChange} id='chiefName' type="text" placeholder="Nama Kepala Desa" className="input w-full" />
                        <label htmlFor="greet"><Paragraph weight = 'font-medium'>Sambutan Kepala Desa</Paragraph></label>
                        <textarea value={formData.greet} onChange={handleChange} id='greet' className="textarea w-full resize-none" placeholder="Sambutan Kepala Desa" rows="10"></textarea>
                    </div>
                    <div className="relative md:w-1/2 group flex flex-col gap-y-2">
                        <label htmlFor="chiefImage"><Paragraph weight = 'font-medium'>{`Foto Kepala Desa (format .png)`}</Paragraph></label>
                        <div className={`w-full aspect-video group-hover:bg-slate-600/50 transition-all ease-in-out duration-300 gap-y-1 md:gap-y-2 bg-slate-600/30  rounded-lg flex flex-col justify-center items-center border-[0.5px] border-default/50 p-3 text-center`}>
                            <input onChange={handleChange} id='chiefImage' className="opacity-0 absolute aspect-video w-full h-fit z-10 cursor-pointer" type="file" accept=".png" />
                            {formData.chiefImage ? (
                                <>
                                    <img className='h-3/5' src={currentImage?.url} alt="" />
                                    <Paragraph weight = 'font-light' size = 'text-xs sm:text-base'>{currentImage.name}</Paragraph>
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
                </div>
                <label htmlFor="address"><Paragraph weight = 'font-medium'>Alamat Kantor Desa</Paragraph></label>
                <input value={formData.address} onChange={handleChange} id='address' type="text" placeholder="Alamat Kantor Desa" className="input w-full" />
                <label htmlFor="phone"><Paragraph weight = 'font-medium'>Nomor Telepon Kantor Desa</Paragraph></label>
                <input value={formData.phone} onChange={handleChange} id='phone' type="text" placeholder="Nomor Telepon Kantor Desa" className="input w-full" />
                <label htmlFor="hero"><Paragraph weight = 'font-medium'>Hero</Paragraph></label>
                <div className="w-full relative group flex flex-col gap-y-2">
                    <div className={`w-full aspect-video group-hover:bg-slate-600/50 transition-all ease-in-out duration-300 gap-y-1 md:gap-y-2 bg-slate-600/30  rounded-lg flex flex-col justify-center items-center border-[0.5px] border-default/50 p-3 text-center`}>
                        <input onChange={handleChange} id='hero' className="opacity-0 absolute aspect-video w-full h-fit z-10 cursor-pointer" type="file" accept="image/*" />
                        {formData.hero ? (
                            <>
                            <div
                                className="hero aspect-video bg-cover bg-center"
                                style={{
                                    backgroundImage:
                                    `url('${currentHero?.url}')`,
                                }}
                                >
                                <div className="hero-overlay"></div>
                                <div className="hero-content text-neutral-content text-center">
                                    <div className="max-w-lg flex flex-col gap-y-2">
                                        <h1 className="text-lg sm:text-xl md:text-2xl font-medium font-roboto">Website Resmi</h1>
                                        <p className="text-xl sm:text-2xl md:text-3xl font-archivo w-full">
                                            Desa Mappetajang
                                        </p>
                                    </div>
                                </div>
                            </div>
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
                <button onClick={handleSubmit} className="btn btn-neutral mt-4">Simpan</button>
            </DashboardSection>

        ) : <></>}
    </>
  )
}

export default HomepageAssetsSetting