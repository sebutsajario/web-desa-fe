import React, { useContext, useEffect, useState } from 'react'
import DashboardSection from '../components/DashboardSection/Index'
import Paragraph from '../components/Paragraph'
import { Auth } from '../../contexts/AuthContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Toast } from '../../contexts/ToastContext';

const AddResidence = () => {
    const [formData, setFormData] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState('');
    const [familyCardData, setFamilyCardData] = useState([{id: Date.now(), data: [{id: Date.now(), position: 'Kepala Keluarga'}]}]);
    const {user} = useContext(Auth);
    const {showToast} = useContext(Toast);
    const navigate = useNavigate();
    const params = useParams();
    const dataId = params.id;
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if(!dataId) {
            setIsLoading(false);
            return;
        };
        setIsEdit(true);
        axios.get(`${apiUrl}/v1/residence/getdata/${dataId}`)
            .then(res => {
                const data = res.data.data;
                setFormData(
                    {
                        village: data.village,
                        number: data.number,
                        electricity: data.electricity,
                        waterSource: data.waterSource,
                        sanitation: data.sanitation,
                        buildingCondition: data.buildingCondition,
                        status: data.status,
                        image: data.image,
                    }
                );
                setCurrentImage(`${apiUrl}/${data.image}`);
                setFamilyCardData(data.familyCardData);
            })
            .catch(err => console.log(err))
            .finally(() => {
                setIsLoading(false);
            });
    }, []);
    
    const handleChange = (e) => {
        const id = e.target.id;
        const value = e.target.value;
        const file = e.target.files ? e.target.files[0] : null;
        if(!file) {
            setFormData(prev => ({...prev, [id]: value}));
        } else {
            const imageUrl = URL.createObjectURL(file);
            setCurrentImage(imageUrl);
            setFormData(prev => ({...prev, [id]: file}));
        };
    };

    const handleChangeFamilyData = (e, familyId, personId) => {
        const { id, value } = e.target;

        setFamilyCardData(prevFamilies =>
            prevFamilies.map(family => {
                if (family.id === familyId) {
                    return {
                        ...family,
                        data: family.data.map(person => {
                            if (person.id === personId) {
                                return {
                                    ...person,
                                    [id]: value, // dynamically update the field
                                };
                            }
                            return person;
                        }),
                    };
                }
                return family;
            })
        );
    };

    
    const addFamilyCard = () => {
        setFamilyCardData(family => [
            ...family,
            {
                id: Date.now(),
                data: [
                    {
                        id: Date.now(),
                        position: 'Kepala Keluarga',
                    },
                ],
            },
        ]);
    };

    const deleteFamilyCard = (id) => {
        const filteredFData = familyCardData.filter(item => item.id !== id);
        setFamilyCardData(filteredFData);
    };

    const addFamilyMember = (id) => {
        setFamilyCardData(prevFamilies =>
            prevFamilies.map(family => {
                if (family.id === id) {
                    const newMember = {
                        id: Date.now(),
                        position: 'Anggota Keluarga',
                    };
                    return {
                        ...family,
                        data: [...family.data, newMember],
                    };
                }
                return family;
            })
        );
    };

    const deleteFamilyMember = (familyId, personId) => {
        setFamilyCardData(prevFamilies =>
            prevFamilies.map(family => {
                if (family.id === familyId) {
                    return {
                        ...family,
                        data: family.data.filter(person => person.id !== personId),
                    };
                }
                return family;
            })
        );
    };

    const handleSubmit = () => {
        const data = new FormData();
        data.append('number', formData.number);
        data.append('village', formData.village);
        data.append('buildingCondition', formData.buildingCondition);
        data.append('sanitation', formData.sanitation);
        data.append('status', formData.status);
        data.append('waterSource', formData.waterSource);
        data.append('electricity', formData.electricity);
        data.append('familyCardData', JSON.stringify(familyCardData));
        data.append('image', formData.image || "");
        data.append('user', user.id);

        if(!isEdit) {
            axios.post(`${apiUrl}/v1/residence/create`, data, {withCredentials: true})
                .then(res => {
                    const message = res.data.message;
                    showToast(message, 'success');
                    navigate(-1);
                })
                .catch(err => {
                    console.log(err);
                    showToast('Gagal', 'failed');
                });
        } else {
            axios.put(`${apiUrl}/v1/residence/editdata/${dataId}`, data, {withCredentials: true})
                .then(res => {
                    const message = res.data.message;
                    showToast(message, 'success');
                    navigate(-1);
                })
                .catch(err => {
                    console.log(err);
                    showToast('Gagal', 'failed');
                });
        };
    };


    return (
        <>
            {!isLoading ? (
                <DashboardSection width = 'w-full' height = 'h-full'>
                    <Paragraph size = 'text-lg' weight = 'font-bold'>Tambahkan Data Tempat Tinggal dan Penduduk</Paragraph>
                    <div className='flex flex-col md:flex-row md:flex-wrap justify-between gap-x-5 gap-y-3 h-full'>
                        <div className='flex flex-col gap-y-2 flex-1 md:basis-2/5'>
                            <label htmlFor="village"><Paragraph weight = 'font-medium'>Dusun</Paragraph></label>
                            <select onChange={handleChange} id='village' value={formData.village || ""} defaultValue='' className="select w-full">
                                <option value="" disabled={true}>Nama Dusun</option>
                                <option value='Dusun Buntu Kaluaja'>Buntu Kaluaja</option>
                                <option value='Dusun Malenyong'>Malenyong</option>
                                <option value='Dusun Pemanukan'>Pemanukan</option>
                                <option value='Dusun Pongsimpin'>Pongsimpin</option>
                            </select>
                        </div>
                        <div className='flex flex-col gap-y-2 flex-1 md:basis-2/5'>
                            <label htmlFor="number"><Paragraph weight = 'font-medium'>Nomor Rumah</Paragraph></label>
                            <input onChange={handleChange} id='number' value={formData.number || ""} type="text" placeholder="Nomor Rumah" className="input w-full" />
                        </div>
                        <div className='flex flex-col gap-y-2 flex-1 md:basis-2/5'>
                            <label htmlFor="electricity"><Paragraph weight = 'font-medium'>Jaringan Listrik</Paragraph></label>
                            <select onChange={handleChange} id='electricity' value={formData.electricity || ""} defaultValue='' className="select w-full">
                                <option value="" disabled={true}>Pilih</option>
                                <option>PLN</option>
                                <option>Belum Tersambung/Menumpang</option>
                                <option>Turbin/PLTA</option>
                            </select>
                        </div>
                        <div className='flex flex-col gap-y-2 flex-1 md:basis-2/5'>
                            <label htmlFor="waterSource"><Paragraph weight = 'font-medium'>Sumber Air Minum</Paragraph></label>
                            <select onChange={handleChange} id='waterSource' value={formData.waterSource || ""} defaultValue='' className="select w-full">
                                <option value="" disabled={true}>Pilih</option>
                                <option>Air Ledeng/PDAM</option>
                                <option>Sumur Bor</option>
                                <option>Sumur Gali</option>
                                <option>Mata Air</option>
                                <option>Tidak Ada</option>
                            </select>
                        </div>
                        <div className='flex flex-col gap-y-2 flex-1 md:basis-2/5'>
                            <label htmlFor="sanitation"><Paragraph weight = 'font-medium'>Sanitasi</Paragraph></label>
                            <select onChange={handleChange} id='sanitation' value={formData.sanitation || ""} defaultValue='' className="select w-full">
                                <option value="" disabled={true}>Pilih</option>
                                <option>Ada WC</option>
                                <option>Tidak Ada WC</option>
                            </select>
                        </div>
                        <div className='flex flex-col gap-y-2 flex-1 md:basis-2/5'>
                            <label htmlFor="buildingCondition"><Paragraph weight = 'font-medium'>Kondisi Bangunan/Rumah</Paragraph></label>
                            <select onChange={handleChange} id='buildingCondition' value={formData.buildingCondition || ""} defaultValue='' className="select w-full">
                                <option value="" disabled={true}>Pilih</option>
                                <option>{`Rumah Permanen (Rumah Batu)`}</option>
                                <option>{`Rumah Panggung (Bahan Kayu)`}</option>
                                <option>{`Rumah Panggung (Bahan Kayu dan Batu)`}</option>
                                <option>{`Rumah Semi Permanen (Bahan Kayu dan Batu)`}</option>
                            </select>
                        </div>
                        <div className='flex flex-col gap-y-2 flex-1 basis-full'>
                            <label htmlFor="status"><Paragraph weight = 'font-medium'>Status Bangunan/Rumah</Paragraph></label>
                            <select onChange={handleChange} id='status' value={formData.status || ""} defaultValue='' className="select w-full">
                                <option value="" disabled={true}>Pilih</option>
                                <option>Bersertifikat</option>
                                <option>Akta Jual Beli</option>
                                <option>Tidak Bersertifikat</option>
                            </select>
                        </div>
                        <div className='flex flex-col gap-y-2 flex-1 basis-full'>
                            <label htmlFor="image"><Paragraph weight = 'font-medium'>Gambar Bangunan/Rumah</Paragraph></label>
                            <div className="w-full relative group flex flex-col gap-y-2">
                                <div className={`w-full aspect-video group-hover:bg-slate-600/50 transition-all ease-in-out duration-300  max-h-[60vh] gap-y-1 md:gap-y-2 bg-slate-600/30  rounded-lg flex flex-col justify-center items-center border-[0.5px] border-default/50 p-3 text-center`}>
                                    <input onChange={handleChange} id='image' className=" max-h-[60vh] opacity-0 absolute aspect-video w-full h-fit z-10 cursor-pointer" type="file" accept="image/*" />
                                    {formData.image ? (
                                        <>
                                        <img className='h-3/5' alt="" src={currentImage} />
                                        <Paragraph weight = 'font-light' size = 'text-xs sm:text-base'>{formData?.image?.name || currentImage}</Paragraph>
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
                        <label className='flex-1 basis-full'><Paragraph weight = 'font-medium'>{`Data Penghuni Bangunan (Per Kartu Keluarga)`}</Paragraph></label>
                        {familyCardData.length && familyCardData.map((family, i) => {
                            const familyId = family.id;
                            return (
                                <div key={i}>
                                    <div className='flex flex-row justify-between items-end'>
                                        <label className='flex-1 basis-full'><Paragraph weight = 'font-medium'>Kartu Keluarga {i + 1}</Paragraph></label>
                                        {i == 0 ? (
                                            <></>
                                        ) : <button onClick={()=>deleteFamilyCard(familyId)} type='submit' className="btn bg-red-600 hover:bg-red-800 text-white w-fit">Hapus Kartu Keluarga</button>}
                                    </div>
                                    {family.data.map((person, i) => 
                                        (
                                            <>
                                            <div key={person.id} className='flex flex-col md:flex-row md:flex-wrap flex-1 basis-full justify-between gap-x-5 gap-y-3 py-3'>
                                                <div className='flex flex-col gap-y-2 flex-1 md:basis-2/5'>
                                                    <label htmlFor="name"><Paragraph weight = 'font-medium'>Nama</Paragraph></label>
                                                    <input value={person.name} onChange={(e) => handleChangeFamilyData(e, familyId, person.id)} id='name' type="text" placeholder="Nama" className="input w-full" />
                                                </div>
                                                <div className='flex flex-col gap-y-2 flex-1 md:basis-2/5'>
                                                    <label htmlFor="position"><Paragraph weight = 'font-medium'>Posisi Dalam Kartu Keluarga</Paragraph></label>
                                                    <select disabled value={person.position} onChange={(e) => handleChangeFamilyData(e, familyId, person.id)} id='position' defaultValue={i === 0 ? 'Kepala Keluarga' : 'Anggota Keluarga'} className="select w-full">
                                                        <option value="" disabled={true}>Pilih</option>
                                                        <option>Kepala Keluarga</option>
                                                        <option>Anggota Keluarga</option>
                                                    </select>
                                                </div>
                                                <div className='flex flex-col gap-y-2 flex-1 md:basis-2/5'>
                                                    <label htmlFor="gender"><Paragraph weight = 'font-medium'>Jenis Kelamin</Paragraph></label>
                                                    <select value={person.gender} onChange={(e) => handleChangeFamilyData(e, familyId, person.id)} id='gender' defaultValue='' className="select w-full">
                                                        <option value="" disabled={true}>Pilih</option>
                                                        <option>Laki-laki</option>
                                                        <option>Perempuan</option>
                                                    </select>
                                                </div>
                                                <div className='flex flex-col gap-y-2 flex-1 md:basis-2/5'>
                                                    <label htmlFor="age"><Paragraph weight = 'font-medium'>Kelompok Umur</Paragraph></label>
                                                    <select value={person.age} onChange={(e) => handleChangeFamilyData(e, familyId, person.id)} id='age' defaultValue='' className="select w-full">
                                                        <option value="" disabled={true}>Pilih</option>
                                                        <option>0-5</option>
                                                        <option>6-10</option>
                                                        <option>11-15</option>
                                                        <option>16-20</option>
                                                        <option>21-25</option>
                                                        <option>26-30</option>
                                                        <option>31-35</option>
                                                        <option>36-40</option>
                                                        <option>41-45</option>
                                                        <option>46-50</option>
                                                        <option>51-55</option>
                                                        <option>56-60</option>
                                                        <option>61-65</option>
                                                        <option>66 Ke Atas</option>
                                                    </select>
                                                </div>
                                                <div className='flex flex-col gap-y-2 flex-1 md:basis-2/5'>
                                                    <label htmlFor="occupation"><Paragraph weight = 'font-medium'>Pekerjaan</Paragraph></label>
                                                    <select value={person.occupation} onChange={(e) => handleChangeFamilyData(e, familyId, person.id)} id='occupation' defaultValue='' className="select w-full">
                                                        <option value="" disabled={true}>Pilih</option>
                                                        <option>Petani</option>
                                                        <option>Buruh Tani</option>
                                                        <option>PNS</option>
                                                        <option>Guru</option>
                                                        <option>Wiraswasta</option>
                                                        <option>POLRI</option>
                                                        <option>TNI</option>
                                                        <option>Lainnya</option>
                                                    </select>
                                                </div>
                                                <div className='flex flex-col gap-y-2 flex-1 md:basis-2/5'>
                                                    <label htmlFor="education"><Paragraph weight = 'font-medium'>Pendidikan</Paragraph></label>
                                                    <select value={person.education} onChange={(e) => handleChangeFamilyData(e, familyId, person.id)} id='education' defaultValue='' className="select w-full">
                                                        <option value="" disabled={true}>Pilih</option>
                                                        <option>TK</option>
                                                        <option>SD</option>
                                                        <option>SMP</option>
                                                        <option>SMA</option>
                                                        <option>Perguruan Tinggi</option>
                                                        <option>Tidak Sekolah</option>
                                                    </select>
                                                </div>
                                                <div className='flex flex-row-reverse gap-x-2 w-full justify-between'>
                                                    {i == 0 ? (
                                                        <></>
                                                    ) : <button onClick={()=>deleteFamilyMember(familyId, person.id)} type='submit' className="btn bg-red-600 hover:bg-red-800 text-white w-fit">Hapus</button>}
                                                    {i == family.data.length -1 ? (
                                                        <button onClick={()=>addFamilyMember(familyId)} type='submit' className="btn w-fit">Tambah Anggota Keluarga</button>
                                                    ) : <></>}
                                                </div>
                                            </div>
                                            <div className='divider w-full'></div>
                                            </>
                                        )
                            )}
                                </div>
                            )
                            
                        })}
                    </div>
                    <div className='flex flex-col gap-y-2 flex-1 basis-full'>
                        <button onClick={addFamilyCard} type='submit' className="btn">Tambah Kartu Keluarga</button>
                    </div>
                    <div className='flex flex-col gap-y-2 flex-1 basis-full'>
                        <button onClick={handleSubmit} type='submit' className="btn btn-neutral">Simpan</button>
                    </div>
                </DashboardSection>

            ) : <></>}
        </>
    )
}

export default AddResidence