import React, { useContext, useEffect, useState } from 'react'
import DashboardSection from '../components/DashboardSection/Index'
import Paragraph from '../components/Paragraph'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { dateConvert } from '../utilities/dateConvert'
import { Auth } from '../../contexts/AuthContext'
import { Toast } from '../../contexts/ToastContext'

const DashboardServiceDetails = (props) => {
    const params = useParams();
    const id = params.id;
    const [serviceRequest, setServiceRequest] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const {user} = useContext(Auth);
    const {showToast} = useContext(Toast);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const requestStatus = [
        {
            index: 1,
            status: 'Belum diproses',
        },
        {
            index: 2,
            status: 'Diproses',
        },
        {
            index: 3,
            status: 'Selesai',
        },
    ];

    const loadData = () => {
        setIsLoading(true);
        axios.get(`${apiUrl}/v1/reqservice/get/${id}`)
            .then(res => {
                const data = res.data.data;
                setServiceRequest(data);
            })
            .catch(err => console.log(err))
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        loadData();
        }, []);

    useEffect(() => {
        const status = requestStatus.find(item => item.index == serviceRequest?.status)
        setSelectedStatus(status);
    }, [serviceRequest]);

    const handleSelectProcess = (i) => {
        const index = i;
        const status = requestStatus.find(item => item.index == index);
        setSelectedStatus(status);
    };

    const handleSubmitStatus = () => {
        const data = new FormData();
        data.append('value', selectedStatus.index);
        data.append('user', user.id);
        axios.put(`${apiUrl}/v1/reqservice/editstatus/${serviceRequest._id}`, data, {withCredentials:true})
            .then(res => {
                console.log(res);
                showToast(res.data.message, 'success');
                navigate('/dashboard/services');
            }
            )
            .catch(err => {
                console.log(err);
                showToast('Gagal mengganti status', 'failed');
            }
            )
            .finally(() => {
                loadData();
            })
    };

    const date = serviceRequest?.updatedAt ? dateConvert(serviceRequest.updatedAt) : null;
    const birthDate = serviceRequest?.villagerData ? dateConvert(serviceRequest.villagerData.birthDate) : null;

  return (
    <>
    {
        !isLoading ? (
        <DashboardSection width = 'w-full'>
            <Paragraph size = 'text-lg' weight = 'font-bold'>Permintaan Layanan Masuk</Paragraph>
            <Paragraph>Permintaan Layanan Masuk</Paragraph>
            <div className='flex flex-col gap-y-3 md:flex-row gap-x-5 w-full'>
                <div className='flex flex-col gap-y-2 w-full md:w-1/2 border border-gray-400 p-5 rounded-box'>
                    <div className='flex flex-row gap-x-3'>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>Jenis Permintaan Layanan</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>:</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm'>{serviceRequest.service}</Paragraph>
                    </div>
                    <div className='flex flex-row gap-x-3'>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>Tanggal Permintaan</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>:</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm'>{date}</Paragraph>
                    </div>
                    <div className='flex flex-col gap-y-3'>
                        <div className='flex flex-row gap-x-3'>
                            <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>Catatan</Paragraph>
                            <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>:</Paragraph>
                        </div>
                        <Paragraph size = 'text-xs md:text-sm'>{serviceRequest.note}</Paragraph>
                    </div>
                    <div className='flex flex-row gap-x-3 items-center'>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>Status</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>:</Paragraph>
                        <div className="dropdown dropdown-bottom">
                            {/* <div  role="button" className="btn m-1">Click ⬇️</div> */}
                            <div tabIndex={0} role='button' className={`px-2 py-1 rounded-sm w-fit h-fit ${selectedStatus?.index == 1 ? 'bg-red-800' : selectedStatus?.index == 2 ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                                <Paragraph size = 'text-xs md:text-sm' color = 'text-white'>{selectedStatus?.status}</Paragraph>
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                <li className = 'text-xs md:text-sm' onClick={()=>handleSelectProcess(1)}><a>Belum diproses</a></li>
                                <li className = 'text-xs md:text-sm' onClick={()=>handleSelectProcess(2)}><a>Diproses</a></li>
                                <li className = 'text-xs md:text-sm' onClick={()=>handleSelectProcess(3)}><a>Selesai</a></li>
                            </ul>
                        </div>
                        <div onClick={handleSubmitStatus}>
                            <Paragraph size = 'text-[11px] md:text-xs' otherClass = 'underline cursor-pointer'>Simpan</Paragraph>
                        </div>
                    </div>
                    <Paragraph size = 'text-[11px] md:text-xs'>Jika permohonan sedang/telah diproses, Anda dapat mengganti status permohonan layanan dengan mengklik ganti.</Paragraph>
                    <Paragraph size = 'text-[11px] md:text-xs'>Status permohonan dapat dilihat oleh pemohon melalui portal resmi desa.</Paragraph>
                </div>
                <div className='flex flex-col gap-y-2 flex-1 border border-gray-400 p-5 rounded-box'>
                    <div className='flex flex-row gap-x-3'>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>Nama Lengkap</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>:</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm'>{serviceRequest.villagerData.name}</Paragraph>
                    </div>
                    <div className='flex flex-row gap-x-3'>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>NIK</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>:</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm'>{serviceRequest.villagerData.uid}</Paragraph>
                    </div>
                    <div className='flex flex-row gap-x-3'>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>Tempat Lahir</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>:</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm'>{serviceRequest.villagerData.birthPlace}</Paragraph>
                    </div>
                    <div className='flex flex-row gap-x-3'>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>Tanggal Lahir</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>:</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm'>{birthDate}</Paragraph>
                    </div>
                    <div className='flex flex-row gap-x-3'>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>Jenis Kelamin</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>:</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm'>{serviceRequest.villagerData.gender}</Paragraph>
                    </div>
                    <div className='flex flex-row gap-x-3'>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>Status Pernikahan</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>:</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm'>{serviceRequest.villagerData.marriageStatus}</Paragraph>
                    </div>
                    <div className='flex flex-row gap-x-3'>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>Pekerjaan</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>:</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm'>{serviceRequest.villagerData.occupation}</Paragraph>
                    </div>
                    <div className='flex flex-row gap-x-3'>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>Riwayat Pendidikan</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>:</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm'>{serviceRequest.villagerData.education}</Paragraph>
                    </div>
                    <div className='flex flex-row gap-x-3'>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>Nomor Telepon</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm' weight = 'font-medium'>:</Paragraph>
                        <Paragraph size = 'text-xs md:text-sm'>{serviceRequest.villagerData.phone}</Paragraph>
                    </div>
                </div>
            </div>
        </DashboardSection>
        ) : <></>
    }
    </>
  )
}

export default DashboardServiceDetails